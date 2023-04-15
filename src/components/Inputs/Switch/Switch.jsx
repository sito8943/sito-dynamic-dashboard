import React, { memo } from "react";

// styles
import "./style.css";

function Switch({ label, value, onChange, id }) {
  return (
    <div className="flex gap-5 cursor-pointer" onClick={onChange}>
      <input
        id={id}
        checked={value}
        onChange={onChange}
        className="check-input"
        type="checkbox"
      />
      <div
        className={`switcher ${value ? "bg-success" : "bg-placeholder-dark"}`}
      >
        <div className={`ball ${value ? "activated" : "deactivated"}`} />
      </div>
      <label className="cursor-pointer">{label}</label>
    </div>
  );
}

const SwitchMemo = memo((props) => <Switch {...props} />, arePropsEqual);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.label === newProps.label &&
    oldProps.value === newProps.value &&
    oldProps.onChange === newProps.onChange &&
    oldProps.id === newProps.id
  );
}

export default SwitchMemo;
