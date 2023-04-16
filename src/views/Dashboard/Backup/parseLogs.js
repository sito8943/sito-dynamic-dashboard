// services
import { fetchModel } from "../../../services/general";

export const parseRows = async (item, texts) => {
  const parsedItem = {
    id: item.id,
    user: item.user,
  };
  //* date
  parsedItem.date = item.id;
  //* action
  parsedItem.action = texts.backup.logs.actions[item.action];
  //* collection
  parsedItem.collection = texts.backup.logs.titles[item.collection];
  //* model
  try {
    if (item.model) {
      const response = await fetchModel(
        item.model,
        item.collection,
        ["title", "name", "id"],
        "id",
        "equal"
      );
      const { data } = response;
      parsedItem.model = data.name || data.title || data.id;
    }
  } catch (err) {}
  //* models
  try {
    if (item.models) {
      const query = {};
      item.models.forEach(
        (/** @type {string | number} */ item) => (query[item] = item)
      );
      const response = await fetchList(query, remoteCollection, 1, -1, "id", [
        "id",
        "name",
        "title",
      ]);
      const { list } = response;
      parsedItem.model = "";
      list.forEach((item, i) => {
        if (i < list.length - 1)
          parsedItem.model += `${item.name || item.title}, `;
        else parsedItem.model += item.name || item.title;
      });
    }
  } catch (err) {}
  return parsedItem;
};

export const tableQuery = () => [];
