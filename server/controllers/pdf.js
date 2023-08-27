const fs = require("fs");
const path = require("path");
const validUrl = require("valid-url");
const puppeteer = require("puppeteer");
const PdfModel = require("../models/Pdf");
const { chromium } = require('playwright');

// module.exports.postpdf = async (req, res) => {
//   const { url } = req.body;
//   if (!validUrl.isUri(url)) {
//     return res.status(400).json({ success: false, message: "Invalid URL." });
//   }
//   try {
//     const browser = await puppeteer.launch({ headless: "new" });
//     const page = await browser.newPage();
//     await page.setViewport({ width: 1400, height: 1000 });
//     await page.emulateMediaType("screen");
//     await page.goto(url, { waitUntil: "networkidle0" });
//     await page.waitForTimeout(2000);
//     const pdfBuffer = await page.pdf({
//       format: "A4",
//       margin: { top: "20px", right: "20px", bottom: "20px", left: "20px" },
//     });
//     await browser.close();
//     const pdfPath = path.join(__dirname, "../pdfs", `${Date.now()}.pdf`);
//     fs.writeFileSync(pdfPath, pdfBuffer);
//     const pdfModel = new PdfModel({ path: pdfPath });
//     await pdfModel.save();
//     const pdfUrl = `/pdfs/${pdfModel._id}`;
//     res.json({
//       success: true,
//       message: "Webpage converted to PDF successfully.",
//       pdfUrl,
//     });
//   } catch (error) {
//     console.error(error);
//     res
//       .status(500)
//       .json({ success: false, message: "Failed to convert webpage to PDF." });
//   }
// };

module.exports.postpdf = async (req, res) => {
  const { url } = req.body;

  try {
    const browser = await chromium.launch();
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'networkidle0' });
    const imagePath = path.join(__dirname, "../pdfs", `${Date.now()}.png`);
    await page.screenshot({ path: imagePath, fullPage: true });         
    await page.waitForTimeout(2000);
    const pdfPath =path.join(__dirname, "../pdfs", `${Date.now()}.pdf`);
    const pdfBuffer = await page.pdf({
      format: 'A4', 
      margin: { top: '20px', right: '20px', bottom: '20px', left: '20px' },  
    });
    fs.writeFileSync(pdfPath, pdfBuffer);

    await browser.close();

    res.json({
      success: true,
      message: "Webpage converted to PDF and image successfully.",
      pdfPath,
      imagePath,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({
        success: false,
        message: "Failed to convert webpage to PDF and image.",
      });
  }
};

module.exports.getpdf = async (req, res) => {
  const { id } = req.params;
  try {
    const pdfModel = await PdfModel.findById(id);
    if (!pdfModel) {
      return res
        .status(404)
        .json({ success: false, message: "PDF not found." });
    }
    const pdfPath = pdfModel.path;
    // Set the response headers for downloading
    res.setHeader("Content-Disposition", `attachment; filename=converted.pdf`);
    res.setHeader("Content-Type", "application/pdf");
    // Send the PDF file as a stream
    const stream = fs.createReadStream(pdfPath);
    stream.pipe(res);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve PDF." });
  }
};

// app.post('/convert', async (req, res) => {
//   const { htmlContent } = req.body;

//   // Ensure that the HTML content is provided
//   if (!htmlContent) {
//     return res.status(400).json({ success: false, message: 'HTML content is required.' });
//   }

//   try {
//     const browser = await puppeteer.launch({ headless: 'new' });
//     const page = await browser.newPage();

//     // Set the HTML content to the page
//     await page.setContent(htmlContent, { waitUntil: 'domcontentloaded' });

//     // Generate the PDF from the HTML content
//     const pdfBuffer = await page.pdf();

//     // Close the browser
//     await browser.close();

//     // Upload the PDF to Cloudinary
//     const cloudinaryUpload = await cloudinary.uploader.upload_stream({}, (error, result) => {
//       if (error) {
//         console.error(error);
//         return res.status(500).json({ success: false, message: 'Failed to upload PDF to Cloudinary.' });
//       }

//       // Store the Cloudinary URL in MongoDB
//       const pdfModel = new PdfModel({ cloudinaryUrl: result.secure_url });
//       pdfModel.save();

//       // Construct the PDF download URL
//       const pdfUrl = `/pdfs/${pdfModel._id}`;

//       res.json({ success: true, message: 'HTML content converted to PDF successfully.', pdfUrl });
//     }).end(pdfBuffer);
//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ success: false, message: 'Failed to convert HTML content to PDF.' });
//   }
// });
