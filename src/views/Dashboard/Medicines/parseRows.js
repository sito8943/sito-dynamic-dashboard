import { fetchModel } from "../../../services/general";

// images
import noPhoto from "../../../assets/images/no-product.jpg";

export const parseRows = async (item, texts) => {
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
  //* descriptions
  if (item.descriptions && item.descriptions.length) {
    parsedItem.descriptions = item.descriptions[0].name;
  } else parsedItem.descriptions = texts.table.values.false;
  //* pharmaceuticGroups
  if (item.pharmaceuticGroups && item.pharmaceuticGroups.length) {
    parsedItem.pharmaceuticGroups = item.pharmaceuticGroups[0].name;
  } else parsedItem.pharmaceuticGroups = texts.table.values.false;
  //* pharmaceuticShapes
  if (item.pharmaceuticShapes && item.pharmaceuticShapes.length) {
    parsedItem.pharmaceuticShapes = item.pharmaceuticShapes[0].name;
  } else parsedItem.pharmaceuticShapes = texts.table.values.false;
  return parsedItem;
};

export const tableQuery = () => [];
