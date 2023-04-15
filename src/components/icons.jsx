import React from "react";

// @fortawesome
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faArrowRightFromBracket,
  faCalendarDays,
  faCameraRetro,
  faChartSimple,
  faGear,
  faHome,
  faIcons,
  faRoute,
  faStore,
  faUser,
  faBagShopping,
  faMap,
  faCloud,
  faNewspaper,
  faBullhorn,
  faListCheck,
  faFileLines,
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
    case "/campaigns/":
      theIcon = faBullhorn;
      break;
    case "/texts/":
      theIcon = faFileLines;
      break;
    case "/surveys/":
      theIcon = faListCheck;
      break;
    case "/events/":
      theIcon = faCalendarDays;
      break;
    case "/news/":
      theIcon = faNewspaper;
      break;
    case "/profile/":
    case "/profile/change-password":
    case "/profile/map":
    case "/profile/social":
    case "/profile/schedule":
    case "/profile/qr":
      theIcon = faGear;
      break;
    case "/places/":
      theIcon = faHome;
      break;
    case "/routes/":
      theIcon = faRoute;
      break;
    case "/activityTypes/":
      theIcon = faIcons;
      break;
    case "/activities/":
      theIcon = faCameraRetro;
      break;
    case "/placeTypes/":
      theIcon = faStore;
      break;
    case "/products/":
      theIcon = faBagShopping;
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
