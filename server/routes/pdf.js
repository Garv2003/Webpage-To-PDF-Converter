const express = require("express");
const router = express.Router();
const controller = require("../controllers/pdf");

router.get("/download/:id/",controller.getpdfimage);

router.post("/convert/", controller.postpdfimage);

router.post("/convertHtml", controller.postHtml);

router.post("/convertHtmlImage", controller.postHtmlImage);

module.exports = router;
