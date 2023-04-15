import React from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faChartSimple,
  faHome,
  faUser,
  faMap,
  faCloud,
  faFileLines,
  faMapLocation,
  faMapLocationDot,
  faNotesMedical,
  faFileMedical,
  faKitMedical,
  faHouseMedical,
} from "@fortawesome/free-solid-svg-icons";

export default function getIcon(icon, className) {
  let theIcon = faHome;
  switch (icon) {
    case "/auth/sign-out":
      theIcon = faArrowRightFromBracket;
      break;
    case "/users/":
      theIcon = faUser;
      break;
    case "/texts/":
      theIcon = faFileLines;
      break;
    case "/provinces/":
      theIcon = faMapLocation;
      break;
    case "/municipalities/":
      theIcon = faMapLocationDot;
      break;
    case "/medicine/":
      theIcon = faKitMedical;
      break;
    case "/descriptions/":
      theIcon = faFileMedical;
      break;
    case "/pharmaceuticGroups/":
      theIcon = faNotesMedical;
      break;
    case "/centers/":
      theIcon = faHouseMedical;
      break;
    case "/map/":
      theIcon = faMap;
      break;
    case "/backup/":
      theIcon = faCloud;
      break;
    default:
      theIcon = faChartSimple;
      break;
  }
  return <FontAwesomeIcon icon={theIcon} className={className} />;
}
