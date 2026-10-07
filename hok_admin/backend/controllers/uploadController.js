import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";
import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(
      options,
      (error, result) => (error ? reject(error) : resolve(result)),
    );
    Readable.from(buffer).pipe(stream);
  });

export const uploadFile = async (req, res) => {
  try {
    if (!req.file) {
      return res
        .status(422)
        .json({ success: false, message: "file is required" });
    }

    if (
      !process.env.CLOUD_NAME ||
      !process.env.CLOUD_API_KEY ||
      !process.env.CLOUD_API_SECRET
    ) {
      // Local disk fallback storage
      const rootUploadsDir = path.resolve(__dirname, "../../../public/uploads");
      const adminUploadsDir = path.resolve(__dirname, "../../public/uploads");
      if (!fs.existsSync(rootUploadsDir)) fs.mkdirSync(rootUploadsDir, { recursive: true });
      if (!fs.existsSync(adminUploadsDir)) fs.mkdirSync(adminUploadsDir, { recursive: true });

      const ext = path.extname(req.file.originalname) || ".jpg";
      const filename = `hero_${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;

      await fs.promises.writeFile(path.join(rootUploadsDir, filename), req.file.buffer);
      try {
        await fs.promises.writeFile(path.join(adminUploadsDir, filename), req.file.buffer);
      } catch (_) {}

      return res.status(201).json({
        success: true,
        data: {
          url: `/uploads/${filename}`,
          publicId: filename,
          resourceType: "image",
          bytes: req.file.size,
        },
      });
    }

    const baseSection = String(req.body.folder || "products")
      .replace(/\s+/g, "-")
      .replace(/[^a-zA-Z0-9/_-]/g, "")
      .trim();
    const mediaType = req.file.mimetype.startsWith("video/")
      ? "video"
      : req.file.mimetype === "application/pdf" ||
          req.file.mimetype.includes("word")
        ? "documents"
        : "image";

    // Build structured folder: e.g. "product/instagram/video", "product/image", "order/issue/image", "submissions/image"
    const folderPath = `${baseSection}/${mediaType}`
      .toLowerCase()
      .slice(0, 100);

    const resourceType =
      mediaType === "video"
        ? "video"
        : mediaType === "documents"
          ? "raw"
          : "image";

    const result = await uploadBuffer(req.file.buffer, {
      folder: folderPath,
      resource_type: resourceType,
      use_filename: true,
      unique_filename: true,
      overwrite: false,
    });

    res.status(201).json({
      success: true,
      data: {
        url: result.secure_url,
        publicId: result.public_id,
        folder: folderPath,
        resourceType,
        format: result.format,
        bytes: result.bytes,
        width: result.width,
        height: result.height,
        duration: result.duration,
      },
    });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};

export const deleteFile = async (req, res) => {
  try {
    const result = await cloudinary.uploader.destroy(req.body.publicId, {
      resource_type: req.body.resourceType || "image",
    });
    res.json({ success: true, data: result });
  } catch (e) {
    res.status(400).json({ success: false, message: e.message });
  }
};
