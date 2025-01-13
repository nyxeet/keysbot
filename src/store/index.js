import { JSONFilePreset } from "lowdb/node";

const defaultData = { characters: [] };

export const DataBase = await JSONFilePreset(
  "src/store/store.json",
  defaultData
);

export const addCharacter = async ({ name, realm, region }) => {
  const buildUniq = ({ name, realm, region }) =>
    [name, realm, region].join("-");

  DataBase.data.characters.push({ name, realm, region });
  DataBase.data.characters = DataBase.data.characters.filter(
    (character, index, self) =>
      index ===
      self.findIndex(
        (nextCharacter) => buildUniq(nextCharacter) === buildUniq(character)
      )
  );

  await DataBase.write();
};

export const removeCharacter = async (name) => {
  DataBase.data.characters = DataBase.data.characters.filter(
    (character) => character.name !== name
  );

  await DataBase.write();
};
