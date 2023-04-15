import React, { memo, useCallback, useEffect } from "react";
import PropTypes from "prop-types";

function DialogList({ children, visible, onClose, className }) {
  const escapeHandler = useCallback((e) => {
    const { keyCode } = e;
    if (keyCode === 27) {
      onClose();
      e.target.blur();
    }
  }, []);

  useEffect(() => {
    window.addEventListener("keydown", escapeHandler);
    return () => {
      window.removeEventListener("keydown", escapeHandler);
    };
  }, [escapeHandler]);

  return (
    <div
      className={`${
        visible ? "opacity-1" : "opacity-0"
      } transition-all bg-light-drawer-background dark:bg-dark-drawer-background w-full h-screen top-0 left-0 fixed z-50 backdrop-blur-sm flex items-center justify-center pointer-events-none`}
    >
      <div
        className={`dialog transition-all ${
          visible ? "scale-100" : "scale-0"
        } ${className}`}
      >
        {children}
      </div>
    </div>
  );
}

const DialogListMemo = memo(
  (props) => <DialogList {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.children === newProps.children &&
    oldProps.visible === newProps.visible &&
    oldProps.onClose === newProps.onClose
  );
}

export default DialogListMemo;
