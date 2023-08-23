const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const axios = require("axios");
const { PDFDocument, rgb } = require("pdf-lib");

const app = express();
const PORT = process.env.PORT || 3001;

mongoose.connect("mongodb://your_database_url", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});
const PdfModel = mongoose.model("Pdf", { data: Buffer });

app.use(express.json());
app.use(cors());

app.post("/convert", async (req, res) => {
  const { url } = req.body;

  try {
    const response = await axios.get(url);
    const html = response.data;
    const pdfDoc = await PDFDocument.create();
    const page = pdfDoc.addPage([600, 800]);
    const { width, height } = page.getSize();
    // Embed the HTML content into the PDF
    const { data } = await page.drawText(html, {
      x: 10,
      y: height - 30,
      size: 12,
      color: rgb(0, 0, 0),
    });
    // Serialize the PDF
    const pdfBytes = await pdfDoc.save();
    console.log(pdfBytes);
    // // Save the PDF to the database
    const pdfModel = new PdfModel({ data: pdfBytes });
    await pdfModel.save();
    // // Construct the PDF download URL
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
});

app.get("/pdfs/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const pdfDoc = await PdfModel.findById(id);
    if (!pdfDoc) {
      return res
        .status(404)
        .json({ success: false, message: "PDF not found." });
    }
    // Send the PDF as a download
    res.set("Content-Type", "application/pdf");
    res.set("Content-Disposition", 'attachment; filename="converted.pdf"');
    res.send(pdfDoc.data);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ success: false, message: "Failed to retrieve PDF." });
  }
});

app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
