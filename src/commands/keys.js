import { EmbedBuilder } from "@discordjs/builders";
import axios from "axios";
import { DataBase } from "../store/index.js";
import { sortStringsAlphabetically } from "../utils/sorts.js";

export const fetchInformationFromRaiderIoByPlayer = async ({
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
          fields:
            "mythic_plus_weekly_highest_level_runs,mythic_plus_previous_weekly_highest_level_runs",
        },
      }
    );
    const data = response.data;

    return {
      name,
      currentWeekKeys: data.mythic_plus_weekly_highest_level_runs.filter(
        ({ mythic_level }) => mythic_level >= 10
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
    const { name: playerName, currentWeekKeys, error } = player;

    if (error) {
      playersWithError.push({ playerName, error });
      continue;
    }

    if (currentWeekKeys.length >= 8) {
      closedKeysPlayers.push({ playerName });
    } else {
      inprogressKeysPlayers.push({
        playerName,
        keys: `${currentWeekKeys.length} / 8`,
      });
    }
  }

  playersWithError = playersWithError.sort(
    ({ playerName }, { playerName: nextPlayerName }) =>
      sortStringsAlphabetically(playerName, nextPlayerName)
  );
  closedKeysPlayers = closedKeysPlayers.sort(
    ({ playerName }, { playerName: nextPlayerName }) =>
      sortStringsAlphabetically(playerName, nextPlayerName)
  );
  inprogressKeysPlayers = inprogressKeysPlayers.sort(
    ({ playerName }, { playerName: nextPlayerName }) =>
      sortStringsAlphabetically(playerName, nextPlayerName)
  );

  const closedKeysTable =
    closedKeysPlayers.length > 0 &&
    new EmbedBuilder()
      .setColor(0x0099ff)
      .setTitle(`Закрили – і молодці (${closedKeysPlayers.length})`)
      .addFields({
        name: "Нікнейм",
        value: closedKeysPlayers.map(({ playerName }) => playerName).join("\n"),
        inline: true,
      });

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
          value: inprogressKeysPlayers.map(({ keys }) => keys).join("\n"),
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
