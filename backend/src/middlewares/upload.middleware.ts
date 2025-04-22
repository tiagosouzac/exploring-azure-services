import multer from "multer";
import path from "path";
import fs from "fs";
import crypto from "crypto";
import { Request, Response, NextFunction } from "express";
import { MulterAzureStorage } from "multer-azure-blob-storage";

const uploadFolder = path.resolve(__dirname, "..", "uploads");

if (!fs.existsSync(uploadFolder)) {
  fs.mkdirSync(uploadFolder, { recursive: true });
}

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadFolder);
  },
  filename: (req, file, cb) => {
    cb(null, createUniqueFileName(file));
  },
});

const azureStorage = new MulterAzureStorage({
  connectionString: process.env.AZURE_STORAGE_CONNECTION_STRING!,
  accessKey: process.env.AZURE_STORAGE_ACCESS_KEY!,
  accountName: process.env.AZURE_STORAGE_ACCOUNT_NAME!,
  containerName: process.env.AZURE_STORAGE_CONTAINER_NAME!,
  containerAccessLevel: process.env.AZURE_STORAGE_CONTAINER_ACCESS_LEVEL!,
  blobName: async (_, file) => createUniqueFileName(file),
});

const fileFilter = (
  req: Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedMimes = [
    "image/jpeg",
    "image/pjpeg",
    "image/png",
    "application/pdf",
    "text/plain",
    "application/msword",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/vnd.ms-excel",
    "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
  ];

  if (allowedMimes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(
      new Error(
        "Invalid file type. Only JPEG, PNG, PDF and document files are allowed."
      )
    );
  }
};

export const upload = multer({
  storage: azureStorage,
  fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB
  },
});

export const handleUploadError = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (err instanceof multer.MulterError) {
    if (err.code === "LIMIT_FILE_SIZE") {
      return res.status(400).json({
        status: "error",
        message: "File exceeds maximum allowed size of 10MB",
      });
    }
    return res.status(400).json({
      status: "error",
      message: `Upload error: ${err.message}`,
    });
  }

  next(err);
};
function createUniqueFileName(file: Express.Multer.File) {
  const fileHash = crypto.randomBytes(10).toString("hex");
  const timestamp = Date.now();
  return `${timestamp}-${fileHash}${path.extname(file.originalname)}`;
}
