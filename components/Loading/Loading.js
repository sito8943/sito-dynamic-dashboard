import React from "react";
import PropTypes from "prop-types";

// styles
import styles from "../../styles/Loading.module.css";

const Loading = (props) => {
  const { type } = props;

  return (
    <div
      className={`flex w-full h-full items-center justify-center ${
        styles[`type-${type}`]
      }`}
    ></div>
  );
};

Loading.propTypes = {
  type: PropTypes.number,
};

export default Loading;
