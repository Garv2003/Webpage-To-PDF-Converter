const fs = require("fs");
const path = require("path");
const validUrl = require("valid-url");
const puppeteer = require("puppeteer");
const PdfModel = require("../models/Pdf");

const cloudinary = require("cloudinary").v2;
const multer = require("multer");
const { CloudinaryStorage } = require("multer-storage-cloudinary");

cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.API_KEY,
  api_secret: process.env.API_SECRET,
});
const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: "pdfs",
  },
});
const upload = multer({ storage: storage }).single("file");

module.exports.getpdfimage = async (req, res) => {
  const { id } = req.params;
  try {
    const pdfModel = await PdfModel.findById(id);
    if (!pdfModel) {
      return res
        .status(404)
        .json({ success: false, message: "PDF not found." });
    }
    const filePath = pdfModel.path;
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=` +
        (req.query.type === "pdf" ? "converted.pdf" : "screenshot.jpg")
    );
    res.setHeader("Content-Type", `application/${req.query.type}`);
    const stream = fs.createReadStream(filePath);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Failed to retrieve ${req.query.type}.`,
    });
  }
};

module.exports.postpdfimage = async (req, res) => {
  const { url } = req.body;
  const { type } = req.query;
  let DataBuffer;
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ success: false, message: "Invalid URL." });
  }
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle0" });
    if (type === "pdf") {
      await page.setViewport({ width: 1400, height: 1000 });
      await page.emulateMediaType("screen");
      DataBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });
    } else {
      DataBuffer = await page.screenshot({ fullPage: true });
    }
    await browser.close();
    const filePath = path.join(
      __dirname,
      "../pdfs",
      `${Date.now()}.${type === "pdf" ? "pdf" : "jpg"}`
    );
    fs.writeFileSync(filePath, DataBuffer);
    const pdfModel = new PdfModel({ path: filePath });
    await pdfModel.save();
    const pdfUrl = `http://localhost:3001/download/${pdfModel._id}/?type=${type}`;
    res.json({
      success: true,
      message: `Webpage converted to ${type} successfully.`,
      filePath: pdfUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: `Failed to convert webpage to ${type}.`,
    });
  }
};

module.exports.postHtml = async (req, res) => {
  const { htmlContent } = req.body;
  const { type } = req.query;
  if (!htmlContent) {
    return res
      .status(400)
      .json({ success: false, message: "HTML content is required." });
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    if (type === "pdf") {
      DataBuffer = await page.pdf({
        format: "A4",
        margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
      });
    } else {
      const screenshot = await page.screenshot({ fullPage: true });
    }
    await browser.close();
    // const cloudinaryUpload = await cloudinary.uploader
    //   .upload_stream({}, (error, result) => {
    //     if (error) {
    //       console.error(error);
    //       return res.status(500).json({
    //         success: false,
    //         message: "Failed to upload PDF to Cloudinary.",
    //       });
    //     }

    //     // Store the Cloudinary URL in MongoDB
    //     const pdfModel = new PdfModel({ cloudinaryUrl: result.secure_url });
    //     pdfModel.save();

    //     // Construct the PDF download URL
    //     const pdfUrl = `/pdfs/${pdfModel._id}`;

    //     res.json({
    //       success: true,
    //       message: "HTML content converted to PDF successfully.",
    //       pdfUrl,
    //     });
    //   })
    //   .end(pdfBuffer);

    const pdfPath = path.join(__dirname, "../pdfs", `${Date.now()}.pdf`);
    fs.writeFileSync(pdfPath, pdfBuffer);
    const pdfModel = new PdfModel({ path: pdfPath });
    await pdfModel.save();
    const pdfUrl = `http://localhost:3001/download/${pdfModel._id}/?type=${type}`;
    res.json({
      success: true,
      message: "HTML converted to PDF successfully.",
      pdfPath: pdfUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to convert HTML content to PDF.",
    });
  }
};

module.exports.postHtmlImage = async (req, res) => {
  const { htmlContent } = req.body;
  if (!htmlContent) {
    return res
      .status(400)
      .json({ success: false, message: "HTML content is required." });
  }

  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.setContent(htmlContent, { waitUntil: "domcontentloaded" });
    const screenshot = await page.screenshot({ fullPage: true });
    await browser.close();
    const pdfPath = path.join(__dirname, "../pdfs", `${Date.now()}.jpg`);
    fs.writeFileSync(pdfPath, screenshot);
    const pdfModel = new PdfModel({ path: pdfPath });
    await pdfModel.save();
    const pdfUrl = `http://localhost:3001/downloadImages/${pdfModel._id}/?type=image`;
    res.json({
      success: true,
      message: "HTML converted to Image successfully.",
      pdfPath: pdfUrl,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Failed to convert HTML content to PDF.",
    });
  }
};
