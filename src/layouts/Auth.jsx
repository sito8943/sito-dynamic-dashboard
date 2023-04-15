import React, { Suspense } from "react";
import { Outlet } from "react-router-dom";
import loadable from "@loadable/component";

// components
const Footer = loadable((props) =>
  import("../views/Auth/components/Footer.jsx")
);
const Nav = loadable((props) => import("../views/Auth/components/Nav.jsx"));

const Auth = () => {
  return (
    <div className="flex flex-col w-full min-h-screen">
      <Suspense>
        <Nav />
        <Outlet />
        <Footer />
      </Suspense>
    </div>
  );
};

export default Auth;
