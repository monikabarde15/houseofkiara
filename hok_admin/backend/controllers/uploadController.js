import cloudinary from "../config/cloudinary.js";
import { Readable } from "stream";

const uploadBuffer = (buffer, options) =>
  new Promise((resolve, reject) => {
    const stream = cloudinary.uploader.upload_stream(options, (error, result) =>
      error ? reject(error) : resolve(result)
    );
    Readable.from(buffer).pipe(stream);
  });

export const uploadFile = async (req, res) => {
  try {
    if (!process.env.CLOUD_NAME || !process.env.CLOUD_API_KEY || !process.env.CLOUD_API_SECRET) {
      return res.status(503).json({ success: false, message: "Cloudinary is not configured" });
    }
    if (!req.file) {
      return res.status(422).json({ success: false, message: "file is required" });
    }

    const baseSection = String(req.body.folder || "products").replace(/[^a-zA-Z0-9/_-]/g, "").trim();
    const mediaType = req.file.mimetype.startsWith("video/")
      ? "video"
      : req.file.mimetype === "application/pdf" || req.file.mimetype.includes("word")
      ? "documents"
      : "image";

    // Build structured folder: e.g. "product/instagram/video", "product/image", "order/issue/image", "submissions/image"
    const folderPath = `${baseSection}/${mediaType}`.toLowerCase().slice(0, 100);

    const resourceType = mediaType === "video" ? "video" : mediaType === "documents" ? "raw" : "image";

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
