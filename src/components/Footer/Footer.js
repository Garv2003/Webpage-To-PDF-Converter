import React from "react";
import { Link } from "react-router-dom";
const Footer = () => {
  return (
    <div className="flex flex-row justify-start gap-x-9 absolute bottom-0 h-20 cursor-pointer w-10/12 border-t-2 border-gray">
      <div className="hover:text-blue-800 hover:font-normal  mt-2 font-thin">Web to PDF</div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">Web to Image</div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">HTML to PDF</div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">HTML to Image</div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">Terms</div>
      <div className="hover:text-blue-800 hover:font-normal mt-2 font-thin">English</div>
    </div>
  );
};
// fixed bottom-0
export default Footer;
