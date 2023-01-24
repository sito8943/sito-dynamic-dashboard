export const prefabs = {
  provinces: ["id", "name"],
  municipalities: ["id", "name", ["name", "provinces"]],
  centers: ["id", "name", ["name", "municipalities"], ["count", "medicines"]],
  medicines: ["id", "name", ["name", "types"]],
  types: ["id", "name"],
};
