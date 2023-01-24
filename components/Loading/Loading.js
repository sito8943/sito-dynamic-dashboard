import React from "react";

// styles
import styles from "../../styles/Loading.module.css";

const Loading = () => {
  return (
    <div className="flex w-full h-full align-center justify-center">
      <div className={styles["lds-ring"]}>
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
    </div>
  );
};

export default Loading;
