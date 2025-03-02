import dao from '../store/index.js';
import { fetchInformationFromRaiderIoByPlayer } from './keys.js';
import axios from 'axios';

export const migrateCharacters = async () => {
  const guild = await axios.get(`https://raider.io/api/v1/guilds/profile`, {
    params: {
      region: 'eu',
      realm: 'gordunni',
      name: 'Гуляйполе',
      fields: 'members',
    },
  });

  const guildMembers = guild.data.members;
  const raiders = guildMembers.filter((member) => member.rank <= 5);
  const normalizedRaiders = raiders.map((raider) => ({
    name: raider.character.name,
    realm: raider.character.realm,
    region: raider.character.region,
  }));

  const promisesStack = normalizedRaiders.map(async (player) => {
    const profile = await fetchInformationFromRaiderIoByPlayer(player);
    return {
      ...player,
      rating: profile.rating,
    };
  });

  const charactersToBeInserted = await Promise.all(promisesStack);

  await dao.rebuildCollection(charactersToBeInserted);
};
