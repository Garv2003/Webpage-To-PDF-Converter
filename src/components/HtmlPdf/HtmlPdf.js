import React, { useState } from "react";
import axios from "axios";
const HtmlPdf= () => {
  const [url, setUrl] = useState("");
  const [pdfUrl, setPdfUrl] = useState("");
  const [message, setMessage] = useState("");

  const convertToPDF = async () => {
    try {
      const response = await axios.post("http://localhost:3001/convert", {
        url,
      });
      setMessage(response.data.message);
      setPdfUrl(response.data.pdfPath);
      setUrl("");
      console.log(response.data);
    } catch (error) {
      console.error(error);
      setMessage("Failed to convert webpage to PDF.");
    }
  };

  return (
    <div className="flex justify-center justify-items-center">
      <div className="text-2xl absolute top-1/4">Convert Web to PDF</div>
      <div className="flex flex-row absolute top-1/3 w-4/12 ">
        <textarea
          className="rounded-l-lg w-full py-2 px-11 border-2 w-9/12 border-sky-500 focus:outline-none focus:border-sky-500"
          type="text"
          placeholder="www.example.com"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
        />
        <button className="bg-sky-500 text-white p-2 px-0 rounded-r-lg w-3/12 focus:outline-none focus:border-sky-500" onClick={convertToPDF}>Convert to PDF</button>
      </div>
      <p className="absolute top-96">{message}</p>
      {pdfUrl && (
        <div className="absolute top-2/4 text-center">
          <p>Click below to download the PDF:</p>
          <a
            className="text-sky-500"
            href={pdfUrl}
            download="converted.pdf"
            target="_blank"
            rel="noopener noreferrer"
          >
            Download PDF
          </a>
        </div>
      )}
    </div>
  );
};

export default HtmlPdf;
