import React, { useState, useEffect, useCallback } from "react";

// @fortawesome
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// @emotion/css
import { css } from "@emotion/css";

// contexts
import { useNotification } from "../../context/NotificationProvider";

// styles
import styles from "../../styles/Notification.module.css";

export default function Notification() {
  const { notificationState } = useNotification();

  const [open, setOpen] = useState(false);
  const [openR, setOpenR] = useState(false);

  useEffect(() => {
    if (open) setOpenR(true);
    else
      setTimeout(() => {
        setOpenR(false);
      }, 400);
  }, [open]);

  useEffect(() => {
    setOpen(notificationState.visible);
    setTimeout(function () {
      setOpen(false);
    }, 6000);
  }, [notificationState]);

  const handleClose = () => setOpen(false);

  const getColor = useCallback(() => {
    switch (notificationState.type) {
      case "info":
        return "bg-info";
      case "warning":
        return "bg-warning";
      case "success":
        return "bg-success";
      default:
        return "bg-error";
    }
  }, [notificationState]);

  return (
    <div
      onClick={handleClose}
      className={`${styles.back} ${open ? styles.appear : styles.disappear} ${
        open ? styles.canClick : styles.noClick })
      }`}
    >
      {openR ? (
        <div className={`${styles.notification} ${getColor()}`}>
          <button onClick={handleClose}>
            <FontAwesomeIcon icon={faClose} />
          </button>
          <h4>{notificationState.message}</h4>
        </div>
      ) : null}
    </div>
  );
}
