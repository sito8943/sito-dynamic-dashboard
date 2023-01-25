export const prefabs = {
  provinces: ["id", "name"],
  municipalities: ["id", "name", ["name", "provinces"]],
  centers: [
    "id",
    "date",
    "name",
    ["name", "municipalities"],
    ["count", "medicines"],
  ],
  medicines: [
    "id",
    "date",
    "name",
    ["name", "presentationShape"],
    ["name", "pharmacologicalCategory"],
  ],
  presentationShape: ["id", "date", "name"],
  presentationCategory: ["id", "date", "name"],
};
