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

export const updateCharacterInformation = async ({
  name,
  realm,
  region,
  rating,
}) => {
  const characterIndex = DataBase.data.characters.findIndex(
    (character) => character.name === name
  );

  if (characterIndex !== -1) {
    const character = DataBase.data.characters[characterIndex];

    DataBase.data.characters[characterIndex] = {
      name: name || character.name,
      realm: realm || character.realm,
      region: region || character.region,
      rating: rating || character.rating,
    };

    await DataBase.write();
  }
};

export const removeCharacter = async (name) => {
  DataBase.data.characters = DataBase.data.characters.filter(
    (character) => character.name !== name
  );

  await DataBase.write();
};
