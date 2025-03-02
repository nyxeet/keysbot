import { sortStringsAlphabetically } from '../utils/sorts.js';
import dao from '../store/index.js';

export const list = async () => {
  const chars = await dao.listCharacters();
  return chars
    .map(({ realm, name }) => `${realm} - ${name}`)
    .sort(sortStringsAlphabetically)
    .map((value, index) => `${index + 1}) ${value}`)
    .join('\n');
};
