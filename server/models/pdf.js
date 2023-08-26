const mongoose = require("mongoose");
const { Schema } = mongoose;

const pdfschema = new Schema({
    path: String,
});

module.exports = mongoose.model("Pdf", pdfschema);