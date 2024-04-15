import React from "react";
import Footer from "./components/Footer/Footer";
import Navbar from "./components/Navbar/Navbar";
import Body from "./components/Body/Body";
import HtmlImage from "./components/HtmlImage/HtmlImage";
import HtmlPdf from "./components/HtmlPdf/HtmlPdf";
import { Routes,Route } from "react-router-dom";
import ImagePdf from "./components/ImagePdf/ImagePdf";

function App() {
  return (
    <div className="container flex flex-col mx-auto  w-10/12 box-border font-serif">
      <Navbar />
      <Routes>
        <Route path="/" element={<Body />} />
        <Route path="/web-to-image" element={<ImagePdf />} />
        <Route path="/html-to-pdf" element={<HtmlPdf />} />
        <Route path="/html-to-image" element={<HtmlImage />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;
