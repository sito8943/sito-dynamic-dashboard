export const prefabs = {
  centers: ["id", "name", ["name", "municipalities"], ["count", "medicines"]],
  provinces: ["id", "name"],
  municipalities: ["id", "name", ["name", "provinces"]],
};
