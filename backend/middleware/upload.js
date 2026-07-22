import multer from "multer";
const allowed = /^(image\/(jpeg|png|webp|gif)|video\/(mp4|quicktime|webm)|application\/(pdf|msword|vnd.openxmlformats-officedocument.wordprocessingml.document))$/;
const storage = multer.memoryStorage();
export default multer({ storage, limits: { fileSize: 50 * 1024 * 1024 }, fileFilter: (_req, file, cb) => allowed.test(file.mimetype) ? cb(null, true) : cb(new Error("Only images, videos and PDF/DOC documents are allowed")) });
