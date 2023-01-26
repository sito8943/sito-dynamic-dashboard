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
    >
      <div className={styles["sk-circle"]}>
        <div className={`${styles["sk-circle1"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle2"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle3"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle4"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle5"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle6"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle7"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle8"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle9"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle10"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle11"]} ${styles["sk-child"]}`}></div>
        <div className={`${styles["sk-circle12"]} ${styles["sk-child"]}`}></div>
      </div>
    </div>
  );
};

Loading.propTypes = {
  type: PropTypes.string,
};

export default Loading;
