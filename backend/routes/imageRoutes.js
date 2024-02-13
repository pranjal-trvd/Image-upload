import express from "express";
import { authMiddleware } from "../middlewares/authMiddleware.js";
import multer from "multer";
import path from "path";
import { imageUploadController,getImagesController } from "../controllers/imageController.js";

const router = express.Router();

const __dirname = path.resolve();

const storage = multer({
    fileFilter: function (req, file, callback) {
        const fileExtension = file.originalname.split(".").pop().toLowerCase();

        if (["png", "jpg", "jpeg"].indexOf(fileExtension) === -1) {
            return callback(null, false);
        }
        callback(null, true);
    },
    storage: multer.diskStorage({
        destination: (req, file, cb) => {
            const uploadFolderPath = path.join(__dirname, 'backend/uploads');
            cb(null, uploadFolderPath);
        },
        filename: (req, file, cb) => {
            cb(null, `${Date.now().toString()}-${file.originalname}`);
        },
    }),
});

router.post('/upload', authMiddleware, storage.single("file"), imageUploadController);
router.get('/images', authMiddleware, getImagesController);
export default router;