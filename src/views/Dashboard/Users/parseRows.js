import { parseApps } from "../../../utils/parser";

export const parseRows = (item, texts) => {
  const parsedItem = { id: item.id };
  //* date
  parsedItem.date = item.date;

  //* user
  if (item.user)
    parsedItem.user = `${item.user.substring(0, 40)}${
      item.user.length > 40 ? "..." : ""
    }`;
  else parsedItem.user = texts.table.values.false;
  //* photo
  if (item.photo) parsedItem.photo = item.photo;
  //* state
  if (item.state)
    parsedItem.state = texts.table.local.userStates[item.state].name;
  else parsedItem.state = texts.table.values.false;
  //* fName
  if (item.fName)
    parsedItem.fName = `${item.fName.substring(0, 40)}${
      item.fName.length > 40 ? "..." : ""
    }`;
  else parsedItem.fName = texts.table.values.false;
  //* apps
  if (item.apps) parsedItem.apps = parseApps(item.apps);
  else parsedItem.apps = texts.table.values.false;
  return parsedItem;
};

export const tableQuery = () => [];
