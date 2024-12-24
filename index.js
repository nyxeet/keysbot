const { Client, GatewayIntentBits } = require('discord.js');
const axios = require('axios');

// Настройки бота
const TOKEN = process.env.DISCORD_TOKEN; // Замените на ваш токен
const client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

// Список игроков
const players = [
  { region: 'eu', realm: 'Silvermoon', name: 'Obezbashen' },
  { region: 'eu', realm: 'Gordunni', name: 'Камнеруд' },
  { region: 'eu', realm: 'Gordunni', name: 'Птичьемолоко' },
  { region: 'eu', realm: 'Gordunni', name: 'Каллиоп' },
  { region: 'eu', realm: 'Gordunni', name: 'Фляжка' },
  { region: 'eu', realm: 'Fordragon', name: 'Варимас' },
  { region: 'eu', realm: 'Turalyon', name: 'Maleficee' },
  { region: 'eu', realm: 'Gordunni', name: 'Пипкабупка' },
  { region: 'eu', realm: 'Gordunni', name: 'Роготбога' },
  { region: 'eu', realm: 'Gordunni', name: 'Бокетра' },
  { region: 'eu', realm: 'Gordunni', name: 'Самураши' },
  { region: 'eu', realm: 'TarrenMill', name: 'Shelbis' },
  { region: 'eu', realm: 'Gordunni', name: 'Фарельэ' },
  { region: 'eu', realm: 'Eversong', name: 'Хоумра' },
  { region: 'eu', realm: 'Blackscar', name: 'Минайра' },
  { region: 'eu', realm: 'Gordunni', name: 'Юлисана' },
  { region: 'eu', realm: 'Eversong', name: 'Танлей' },
  { region: 'eu', realm: 'Gordunni', name: 'Намгун' },
  { region: 'eu', realm: 'Gordunni', name: 'Эрвиртур' },
  { region: 'eu', realm: 'Silvermoon', name: 'Nyma' },
  { region: 'eu', realm: 'Gordunni', name: 'Озаарённая' },
  { region: 'eu', realm: 'Gordunni', name: 'Архитас' },
  { region: 'eu', realm: 'Eversong', name: 'Джусихилл' },
  { region: 'eu', realm: 'Gordunni', name: 'Ватканаранку' },
];

// Функция для получения данных о игроке
async function fetchPlayerData(player) {
  const url = `https://raider.io/api/v1/characters/profile`;
  const params = {
    region: player.region,
    realm: player.realm,
    name: player.name,
    fields: 'mythic_plus_weekly_highest_level_runs',
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

  for (const player of players) {
    const data = await fetchPlayerData(player);

    if (!data || !data.mythic_plus_weekly_highest_level_runs) {
      playersWithoutKey10.push(player.name);
      continue;
    }

    const hasKey10 = data.mythic_plus_weekly_highest_level_runs.some(
      (run) => run.mythic_level >= 10
    );

    if (!hasKey10) {
      playersWithoutKey10.push(player.name);
    }
  }

  return playersWithoutKey10;
}

// Слушаем события
client.on('ready', () => {
  console.log(`Бот запущен как ${client.user.tag}`);
});

client.on('messageCreate', async (message) => {
  // Если сообщение от бота или не содержит команду !keys, пропускаем
  if (message.author.bot || message.content !== '!keys') return;

  await message.channel.send('Проверяю данные...');

  const playersWithoutKey10 = await checkPlayers();

  if (playersWithoutKey10.length === 0) {
    message.channel.send('Все игроки закрыли хотя бы один 10-й ключ!');
  } else {
    message.channel.send(`10 ключ не закрыли: ${playersWithoutKey10.join(', ')}`);
  }
});

// Запуск бота
client.login(TOKEN);
