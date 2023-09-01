const express = require("express");
const router = express.Router();
const controller = require("../controllers/pdf");

router.post("/convert", controller.postpdf);
router.get("/pdfs/:id/download",controller.getpdf);

router.post("/convertImage", controller.postImage);
router.get("/webimage/:id/download",controller.getImage);

router.post("/convertHtml", controller.postHtml);
router.get("/htmlpdf/:id/download",controller.getHtml);

router.post("/convertHtmlImage", controller.postHtmlImage);
router.get("/htmlImages/:id/download",controller.getHtmlImage);

module.exports = router;
