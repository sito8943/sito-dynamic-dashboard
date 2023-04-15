import React from "react";
import { Source as MapSource } from "react-map-gl";

function Source(props) {
  return <MapSource {...props}>{props?.children}</MapSource>;
}

export default Source;
