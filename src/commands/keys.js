import { EmbedBuilder } from "@discordjs/builders";
import axios from "axios";
import { DataBase } from "../store/index.js";
import { sortStringsAlphabetically } from "../utils/sorts.js";

const MINIMUM_KEY_LEVEL = 10;
const REQUIRED_KEY_COUNT = 1;

export const fetchInformationFromRaiderIoByPlayer = async ({
  name,
  realm,
  region,
  rating,
}) => {
  try {
    const response = await axios.get(
      `https://raider.io/api/v1/characters/profile`,
      {
        params: {
          region,
          realm,
          name,
          fields:
            "mythic_plus_weekly_highest_level_runs,mythic_plus_previous_weekly_highest_level_runs",
        },
      }
    );
    const data = response.data;

    return {
      name,
      rating,
      currentWeekKeys: data.mythic_plus_weekly_highest_level_runs.filter(
        ({ mythic_level }) => mythic_level >= MINIMUM_KEY_LEVEL
      ),
    };
  } catch (error) {
    console.error(error);
    return {
      name,
      error: `Не можу отримати інформацію з raider.io.`,
    };
  }
};

export const keys = async () => {
  const promisesStack = DataBase.data.characters.map((player) =>
    fetchInformationFromRaiderIoByPlayer(player)
  );

  const results = await Promise.all(promisesStack);

  let playersWithError = [];
  let closedKeysPlayers = [];
  let inprogressKeysPlayers = [];

  for (const player of results) {
    const { name: playerName, rating, currentWeekKeys, error } = player;

    if (error) {
      playersWithError.push({ playerName, error });
      continue;
    }

    if (currentWeekKeys.length >= REQUIRED_KEY_COUNT) {
      closedKeysPlayers.push({ playerName, rating });
    } else {
      inprogressKeysPlayers.push({
        playerName,
        keys: currentWeekKeys.length,
      });
    }
  }

  playersWithError = playersWithError.sort(
    ({ playerName }, { playerName: nextPlayerName }) =>
      sortStringsAlphabetically(playerName, nextPlayerName)
  );
  closedKeysPlayers = closedKeysPlayers.sort(
    ({ rating }, { rating: nextRating }) => nextRating - rating
  );
  inprogressKeysPlayers = inprogressKeysPlayers.sort(
    ({ keys }, { keys: nextKey }) => nextKey - keys
  );

  const closedKeysTable =
    closedKeysPlayers.length > 0 &&
    new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Закрили – і молодці (${closedKeysPlayers.length})`)
      .addFields(
        {
          name: "Нікнейм",
          value: closedKeysPlayers
            .map(({ playerName }) => playerName)
            .join("\n"),
          inline: true,
        },
        {
          name: "Рейтинг",
          value: closedKeysPlayers
            .map(({ rating }) => rating || "немає даних")
            .join("\n"),
          inline: true,
        }
      );

  const inprogressKeysTable =
    inprogressKeysPlayers.length > 0 &&
    new EmbedBuilder()
      .setColor(0xff9900)
      .setTitle(`У прогресі (${inprogressKeysPlayers.length})`)
      .addFields(
        {
          name: "Нікнейм",
          value: inprogressKeysPlayers
            .map(({ playerName }) => playerName)
            .join("\n"),
          inline: true,
        },
        {
          name: "Прогрес",
          value: inprogressKeysPlayers
            .map(({ keys }) => `${keys} / ${REQUIRED_KEY_COUNT}`)
            .join("\n"),
          inline: true,
        }
      );
  const playersWithErrorsTable =
    playersWithError.length > 0 &&
    new EmbedBuilder()
      .setColor(0xff1a00)
      .setTitle("Невдалося завантажити інформацію")
      .addFields(
        {
          name: "Нікнейм",
          value: playersWithError
            .map(({ playerName }) => playerName)
            .join("\n"),
          inline: true,
        },
        {
          name: "Помилка",
          value: inprogressKeysPlayers
            .map(({ error }) => String(error))
            .join("\n"),
          inline: true,
        }
      );

  return {
    embeds: [
      closedKeysTable,
      inprogressKeysTable,
      playersWithErrorsTable,
    ].filter(Boolean),
  };
};
