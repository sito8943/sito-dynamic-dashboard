import React, { useState, useCallback, useEffect } from "react";

// fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowUp } from "@fortawesome/free-solid-svg-icons";

// utils
import { scrollTo } from "some-javascript-utils/browser";

// styles
import "./style.css";

const ToTop = () => {
  const [visible, setVisible] = useState(false);

  const onScroll = useCallback(
    (e) => {
      const top = window.pageYOffset || document.documentElement.scrollTop;
      if (top > 100) setVisible(true);
      else setVisible(false);
    },
    [setVisible]
  );

  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, [onScroll]);

  return (
    <button
      onClick={() => scrollTo(0)}
      style={{
        zIndex: visible ? 10 : -1,
        transform: visible ? "scale(1)" : "scale(0)",
      }}
      className="to-top fixed bottom-5 right-5 rounded-circle w-9 h-9 pt-1 dark:text-primary  dark:hover:bg-primary hover:bg-primary transition hover:text-white dark:hover:text-white"
    >
      <FontAwesomeIcon className="external" icon={faArrowUp} />
    </button>
  );
};

export default ToTop;
