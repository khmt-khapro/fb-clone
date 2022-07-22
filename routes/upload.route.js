import express from "express";
const router = express.Router();
import multer from "multer";

const storage = multer.diskStorage({
  destination: (req, res, cb) => {
    cb(null, "./public/images");
  },
  filename: (req, file, cb) => {
    cb(null, req.body.name);
  },
});

const upload = multer({ storage: storage });

router.post("/", upload.single("file"), (req, res) => {
  try {
    return res.status(200).json({ message: "Upload image successfully !!! " });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

export default router;
