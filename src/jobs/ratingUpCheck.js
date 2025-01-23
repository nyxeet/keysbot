import { EmbedBuilder } from "@discordjs/builders";
import axios from "axios";
import { CronJob } from "cron";
import { CHANNEL_ID, getChannelByDiscordById } from "../discord/index.js";
import { DataBase, updateCharacterInformation } from "../store/index.js";

const fetchInformationFromRaiderIoByPlayer = async ({
  name,
  realm,
  region,
}) => {
  try {
    const response = await axios.get(
      `https://raider.io/api/v1/characters/profile`,
      {
        params: {
          region,
          realm,
          name,
          fields: "mythic_plus_scores_by_season:current",
        },
      }
    );
    const data = response.data;

    return {
      name,
      rating: data.mythic_plus_scores_by_season[0].scores.all,
    };
  } catch (error) {
    console.error(error);
    return {
      name,
      error: `Не можу отримати інформацію з raider.io.`,
    };
  }
};

export const ratingUpCheck = new CronJob(
  "0 9-21/3 * * *",
  async () => {
    const channel = await getChannelByDiscordById(CHANNEL_ID);
    const promisesStack = DataBase.data.characters.map((player) =>
      fetchInformationFromRaiderIoByPlayer(player)
    );
    let charactersThatIncreasedTheirRating = [];
    const results = await Promise.all(promisesStack);

    for (const player of results) {
      const { name, rating, error } = player;
      const character = DataBase.data.characters.find(
        (char) => char.name === name
      );

      if (error) continue;

      if (character.rating && rating > character.rating) {
        charactersThatIncreasedTheirRating.push({
          name: character.name,
          newRating: rating,
          oldRating: character.rating,
        });
      }

      await updateCharacterInformation({ ...character, rating });
    }

    if (charactersThatIncreasedTheirRating.length > 0) {
      const charactersThatIncreasedTheirRatingTable = new EmbedBuilder()
        .setColor(0x457b9d)
        .setTitle("Підвищили свій рейтинг")
        .addFields({
          name: ":heart_eyes_cat:",
          value: charactersThatIncreasedTheirRating
            .sort(
              (character, nextCharacter) =>
                nextCharacter.newRating - character.newRating
            )
            .map(
              ({ name, oldRating, newRating }) =>
                `${name}: ~~${oldRating}~~ -> ${newRating} (**+${
                  newRating - oldRating
                }**)`
            )
            .join("\n"),
          inline: true,
        });

      await channel.send({
        embeds: [charactersThatIncreasedTheirRatingTable],
      });
    }
  },
  null,
  false,
  "Europe/Kiev"
);
