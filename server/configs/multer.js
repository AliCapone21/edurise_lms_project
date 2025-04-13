// server/configs/multer.js

import multer from "multer";

const storage = multer.diskStorage({});

const upload = multer({
    storage,
    limits: { fileSize: 500 * 1024 * 1024 } // Up to 500MB
});

export default upload;
