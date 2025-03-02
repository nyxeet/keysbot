import { mongoConnect } from './mongoConnector.js';

let charactersCollection;

async function initDB() {
  const db = await mongoConnect();
  charactersCollection = db.collection('characters');
}
await initDB();

export const addCharacter = async ({ name, realm, region, rating }) => {
  const existingCharacter = await charactersCollection.findOne({
    name,
    realm,
    region,
  });
  if (!existingCharacter) {
    await charactersCollection.insertOne({ name, realm, region, rating });
  }
  console.log(`✅ Персонаж ${name} був доданий!`);
};

export const updateCharacterInformation = async ({
  name,
  realm,
  region,
  rating,
}) => {
  const filter = { name };
  const update = {
    $set: {
      realm,
      region,
      rating,
    },
  };

  const result = await charactersCollection.updateOne(filter, update);

  if (result.matchedCount > 0) {
    console.log(`Персонаж ${name} був оновлений!`);
  } else {
    console.log(`Персонажа ${name} не знайдено!`);
  }
};

export const removeCharacter = async (name) => {
  const result = await charactersCollection.deleteOne({ name });

  if (result.deletedCount > 0) {
    console.log(`Персонаж ${name} був видалений!`);
  } else {
    console.log(`Персонажа ${name} не знайдено!`);
  }
};

export const listCharacters = async () => {
  try {
    return await charactersCollection.find({}).toArray();
  } catch (error) {
    console.error('Здохло:', error);
    throw error;
  }
};

export const rebuildCollection = async (documents) => {
  try {
    await charactersCollection.deleteMany({});
    await charactersCollection.insertMany(documents);
  } catch (error) {
    console.error('Помилка при переносі даних з JSON в MongoDB:', error);
  }
};

export default {
  addCharacter,
  listCharacters,
  updateCharacterInformation,
  removeCharacter,
  rebuildCollection,
};
