import React, { memo } from "react";
import PropTypes from "prop-types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

// styles
import "./styles.css";

function ActionCard({ title, icon, onClick }) {
  return (
    <div className="action-card" onClick={onClick}>
      <FontAwesomeIcon className="text-2xl text-primary" icon={icon} />
      <h6 className="text-md">{title}</h6>
    </div>
  );
}

ActionCard.propTypes = {};

const ActionCardMemo = memo(
  (props) => <ActionCard {...props} />,
  arePropsEqual
);

function arePropsEqual(oldProps, newProps) {
  return (
    oldProps.title === newProps.title &&
    oldProps.icon === newProps.icon &&
    oldProps.onClick === newProps.onClick
  );
}

export default ActionCardMemo;
