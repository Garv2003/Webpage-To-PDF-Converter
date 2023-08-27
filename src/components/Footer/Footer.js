import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="flex flex-row justify-start gap-x-9 absolute bottom-0 h-20 cursor-pointer w-10/12 border-t-2 border-gray">
      <Link
        to="/"
        className="hover:text-blue-800 hover:font-normal  mt-2 font-thin"
      >
        Web to PDF
      </Link>
      <Link
        to="/web-to-image"
        className="hover:text-blue-800 hover:font-normal mt-2 font-thin"
      >
        Web to Image
      </Link>
      <Link
        to="/html-to-pdf"
        className="hover:text-blue-800 hover:font-normal mt-2 font-thin"
      >
        HTML to PDF
      </Link>
      <Link
        to="/html-to-image"
        className="hover:text-blue-800 hover:font-normal mt-2 font-thin"
      >
        HTML to Image
      </Link>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">
        Terms
      </div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">
        English
      </div>
    </div>
  );
};
// fixed bottom-0
export default Footer;
