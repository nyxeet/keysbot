import axios from "axios";
import { commandExecutor } from "./commands/index.js";
import { startDiscordBackgroundWorker } from "./discrod/index.js";
import { State } from "./store/index.js";

// Настройки бота

// Функция для получения данных о игроке
async function fetchPlayerData(player) {
  const url = `https://raider.io/api/v1/characters/profile`;
  const params = {
    region: player.region,
    realm: player.realm,
    name: player.name,
    fields:
      "mythic_plus_weekly_highest_level_runs,mythic_plus_previous_weekly_highest_level_runs",
  };

  try {
    const response = await axios.get(url, { params });
    return response.data;
  } catch (error) {
    console.error(`Ошибка при запросе для ${player.name}:`, error.message);
    return null;
  }
}

// Функция для проверки игроков
async function checkPlayers() {
  const playersWithoutKey10 = [];
  const playersWithoutKey10PreviousWeek = [];

  for (const player of State.subscribes.getSubscribers()) {
    const data = await fetchPlayerData(player);

    if (!data || !data.mythic_plus_weekly_highest_level_runs) {
      playersWithoutKey10.push(player.name);
      continue;
    }

    if (!data || !data.mythic_plus_previous_weekly_highest_level_runs) {
      playersWithoutKey10PreviousWeek.push(player.name);
      continue;
    }

    const hasKey10 = data.mythic_plus_weekly_highest_level_runs.some(
      (run) => run.mythic_level >= 10
    );
    const hasKey10PreviousWeek =
      data.mythic_plus_previous_weekly_highest_level_runs.some(
        (run) => run.mythic_level >= 10
      );

    if (!hasKey10) {
      playersWithoutKey10.push(player.name);
    }

    if (!hasKey10PreviousWeek) {
      playersWithoutKey10PreviousWeek.push(player.name);
    }
  }

  return { playersWithoutKey10, playersWithoutKey10PreviousWeek };
}

(async () => {
  await startDiscordBackgroundWorker({
    onStart: (client) => {
      console.info(`Background worker started like ${client.user.tag}`);
    },
    onCommand: commandExecutor,
  });
})();
