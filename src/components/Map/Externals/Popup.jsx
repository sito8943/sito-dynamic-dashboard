import React from "react";
import { Popup as MapPopup } from "react-map-gl";

function Popup(props) {
  return <MapPopup {...props}>{props?.children}</MapPopup>;
}

export default Popup;
