const fs = require("fs");
const path = require("path");
const validUrl = require("valid-url");
const puppeteer = require("puppeteer");
const PdfModel = require("../models/Pdf");

module.exports.postpdf = async (req, res) => {
  const { url } = req.body;
  if (!validUrl.isUri(url)) {
    return res.status(400).json({ success: false, message: "Invalid URL." });
  }
  try {
    const browser = await puppeteer.launch({ headless: "new" });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: "networkidle2" });
    // Generate the PDF from the webpage
    const pdfBuffer = await page.pdf();
    // Close the browser
    await browser.close();
    // Define the path where you want to save the PDF file on the server
    const pdfPath = path.join(__dirname, "../pdfs", `${Date.now()}.pdf`); // Assuming a 'pdfs' directory
    // Save the PDF file to the server
    fs.writeFileSync(pdfPath, pdfBuffer);
    // Store the file path in the database
    const pdfModel = new PdfModel({ path: pdfPath });
    await pdfModel.save();
    // Construct the PDF download URL
    const pdfUrl = `/pdfs/${pdfModel._id}`;
    res.json({
      success: true,
      message: "Webpage converted to PDF successfully.",
      pdfUrl,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to convert webpage to PDF." });
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
