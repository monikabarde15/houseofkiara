import multer from "multer";

const storage = multer.memoryStorage();

export default multer({
  storage,
  limits: { fileSize: 50 * 1024 * 1024 }, // 50 MB
  fileFilter: (_req, file, cb) => {
    const isAllowed =
      file.mimetype.startsWith("image/") ||
      file.mimetype.startsWith("video/") ||
      file.mimetype.startsWith("application/pdf") ||
      file.mimetype.includes("word") ||
      file.mimetype === "application/octet-stream";

    if (isAllowed) {
      cb(null, true);
    } else {
      cb(new Error("Only images, videos and PDF/DOC documents are allowed"));
    }
  },
});
