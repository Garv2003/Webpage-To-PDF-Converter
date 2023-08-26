const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3001;

const pdfrouter = require("./routes/pdf");

app.use(express.json());
app.use(cors());

app.use("/", pdfrouter);

mongoose
  .connect("mongodb://127.0.0.1:27017/pdf", {
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
