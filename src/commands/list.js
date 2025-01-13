import { DataBase } from "../store/index.js";
import { sortStringsAlphabetically } from "../utils/sorts.js";

export const list = () => {
  return DataBase.data.characters
    .map(({ realm, name }) => `${realm} - ${name}`)
    .sort(sortStringsAlphabetically)
    .map((value, index) => `${index + 1}) ${value}`)
    .join("\n");
};
