const express = require("express");
const router = express.Router();
const controller = require("../controllers/pdf");

router.post("/convert", controller.postpdf);
router.get("/pdfs/:id/download",controller.getpdf);

module.exports = router;
