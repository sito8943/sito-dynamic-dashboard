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
    ["name", "descriptionShape"],
    ["name", "pharmaceuticGroup"],
  ],
  descriptions: ["id", "date", "name"],
  pharmaceuticGroups: ["id", "date", "name"],
};

export const parseAttributesWidth = (attribute) => {
  switch (attribute) {
    default: // going left
      return "first";
  }
};

export const parseAttributes = (attribute, value) => {
  switch (attribute) {
    case "date": {
      const date = new Date();
      date.setTime(value);
      return date.toLocaleString("es-es");
    }
    default:
      return value;
  }
};
