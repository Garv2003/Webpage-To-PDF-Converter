const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const morgan = require("morgan");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 3001;
app.use(morgan("dev"));

const pdfrouter = require("./routes/pdf");

app.use(express.urlencoded({ extended: true }));
app.use(express.static('pdfs'));
app.use(express.json());
app.use(cors());

app.use("/", pdfrouter);

mongoose
  .connect(process.env.MONGODB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.log(err);
  });
