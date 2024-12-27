import axios from "axios";
import { Client, GatewayIntentBits } from "discord.js";
import { getDiscordToken } from "./utils/credential.js";

// Настройки бота
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
  ],
});

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

  for (const player of getSubscribers()) {
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

// Слушаем события
client.on("ready", () => {
  console.log(`Background worker started like ${client.user.tag}`);
});

client.on("messageCreate", async (message) => {
  // Если сообщение от бота или не содержит команду !keys, пропускаем
  if (message.author.bot || message.content !== "!keys") return;

  await message.channel.send("Перевірка інформації...");

  const { playersWithoutKey10, playersWithoutKey10PreviousWeek } =
    await checkPlayers();

  if (
    playersWithoutKey10.length === 0 &&
    playersWithoutKey10PreviousWeek === 0
  ) {
    message.channel.send("Все игроки закрыли хотя бы один 10-й ключ!");
  } else {
    message.channel.send(
      `10 ключ не закрыли: ${playersWithoutKey10.join(
        ", "
      )}\n10 ключ на предыдущей неделе не закрыли: ${playersWithoutKey10PreviousWeek.join(
        ", "
      )}`
    );
  }
});

// Запуск бота
client.login(getDiscordToken());
