/* eslint-disable react/function-component-definition */
/* eslint-disable react/jsx-no-undef */
import React, { useEffect, useState } from "react";
// prop-types
import PropTypes from "prop-types";

// images
import logo from "../../assets/images/logonotext.png";

// styles
import "./style.css";

export default function BigLoading({ visible }) {
  const [active, setActive] = useState(false);

  useEffect(() => {
    setTimeout(() => {
      setActive(true);
    }, 100);
  }, []);

  return (
    <div
      className="bg-pdark fixed z-50 top-0 left-0"
      id="contenedor_carga"
      style={{
        paddingTop: "100px",
        opacity: visible ? 1 : 0,
        pointerEvents: "none",
      }}
    >
      <div className="logo-entrance">
        <div className="logo-container">
          {/* <img className="image" src={logo} alt="logo trinidad" /> */}
          LOGO
        </div>
      </div>

      {active ? (
        <div className="bar-entrance progress_bar">
          <div className="bar_h" />
        </div>
      ) : null}
    </div>
  );
}

BigLoading.propTypes = {
  visible: PropTypes.bool.isRequired,
};
