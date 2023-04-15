import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import loadable from "@loadable/component";

// components
const Footer = loadable((props) => import("../components/Footer/Footer"));
const Navbar = loadable((props) => import("../components/Navbar/Navbar"));
const Sidebar = loadable((props) => import("../components/Sidebar/Sidebar"));

const View = ({ noFooter, noNavbar, noSidebar }) => {
  return (
    <div className="flex w-full min-h-screen">
      {!noSidebar ? <Sidebar /> : null}
      <div className="flex flex-col min-h-full w-full">
        {!noNavbar ? <Navbar /> : null}
        <Outlet />
        {!noFooter ? <Footer /> : null}
      </div>
    </div>
  );
};

export default View;
