// images
import noPhoto from "../../../assets/images/no-product.jpg";

export const parseRows = (item, texts) => {
  const parsedItem = { id: item.id };
  //* date
  parsedItem.date = item.date;
  //* headerImages
  if (item.headerImages) parsedItem.headerImages = item.headerImages;
  else parsedItem.headerImages = [{ url: noPhoto }];
  //* visibility
  if (item.visibility) parsedItem.visibility = texts.table.values.true;
  else parsedItem.visibility = texts.table.values.false;
  //* name
  if (item.name)
    parsedItem.name = `${item.name.substring(0, 40)}${
      item.name.length > 40 ? "..." : ""
    }`;
  else parsedItem.name = texts.table.values.false;
  return parsedItem;
};

export const tableQuery = () => [];
