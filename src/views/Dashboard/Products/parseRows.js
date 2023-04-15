// utils
import { parseApps } from "../../../utils/parser";
import { getUserName } from "../../../utils/auth";

// images
import noPhoto from "../../../assets/images/no-product.jpg";

export const parseRows = (item, texts) => {
  const parsedItem = { id: item.id };
  //* date
  parsedItem.date = item.date;

  //* photo
  if (item.photo) parsedItem.photo = item.photo;
  else parsedItem.photo = { url: noPhoto };
  //* visibility
  if (item.visibility) parsedItem.visibility = texts.table.values.true;
  else parsedItem.visibility = texts.table.values.false;
  //* name
  if (item.name)
    parsedItem.name = `${item.name.substring(0, 40)}${
      item.name.length > 40 ? "..." : ""
    }`;
  else parsedItem.name = texts.table.values.false;
  /* //* category
  if (item.category) parsedItem.category = parseApps(item.category);
  else parsedItem.category = texts.table.values.false; */
  //* price
  parsedItem.price = item.price;

  return parsedItem;
};

export const tableQuery = () => ["owner", "equal", getUserName()];
export const tableQueryAdmin = () => [];
