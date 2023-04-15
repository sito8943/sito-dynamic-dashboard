import React from "react";
import PropTypes from "prop-types";

// @emotion/css
import { css } from "@emotion/css";

// styles
import "./styles.css";

function Printer({ text }) {
    return (
        <div className="printer flex flex-col gap-5">
            {text.map((item, i) => (
                <span key={i} className={`${css({ ...item.sx })} text-${item.variant}`}>
          {item.content}
        </span>
            ))}
        </div>
    );
}

Printer.propTypes = {
    text: PropTypes.arrayOf(
        PropTypes.shape({ variant: "string", content: "string" })
    ),
};

export default Printer;
