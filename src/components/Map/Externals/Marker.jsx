import React from "react";
import PropTypes from "prop-types";

import { Marker as MapMarker } from "react-map-gl";

function Marker(props) {
  return <MapMarker {...props}>{props?.children}</MapMarker>;
}

export default Marker;
