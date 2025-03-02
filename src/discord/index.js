import { Client, Events, GatewayIntentBits, REST, Routes } from 'discord.js';
import { getCommandsForRegistration } from '../commands/index.js';
import {
  getDiscordApplicationId,
  getDiscordToken,
} from '../utils/credential.js';

const TOKEN = getDiscordToken();

/** Guliapole id */
export const DISCORD_SERVER_ID = '1160185443430703145';
export const CHANNEL_ID = '1332787596513771580';

/** test */
// export const DISCORD_SERVER_ID = "1322148736658440243";
// export const CHANNEL_ID = "1322148737170280522";
/** dima test */
// export const DISCORD_SERVER_ID = '628155476554809344';
//export const CHANNEL_ID = '1321084360946094151';

const DISCORD_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.DirectMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageTyping,
  ],
});
const REPRESENT = new REST().setToken(TOKEN);

/**
 * Starts the Discord background worker.
 *
 * @param {Object} options - The options for the background worker.
 * @param {Function} options.onMessage - The callback function to handle message events.
 * @param {Function} options.onStart - The callback function to handle the client ready event.
 * @param {Function} options.onCommand - The callback function to handle interaction create events.
 * @returns {Promise<void>} A promise that resolves when the background worker has started.
 */
export const startDiscordBackgroundWorker = async ({
  onMessage,
  onStart,
  onCommand,
}) => {
  await REPRESENT.put(Routes.applicationCommands(getDiscordApplicationId()), {
    body: getCommandsForRegistration(),
  });

  onStart && DISCORD_CLIENT.on(Events.ClientReady, onStart);
  onMessage && DISCORD_CLIENT.on(Events.MessageCreate, onMessage);
  onCommand && DISCORD_CLIENT.on(Events.InteractionCreate, onCommand);
};

/**
 * Retrieves a Discord channel by its name.
 *
 * @param {string} chatName - The name of the chat channel to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the Discord channel object.
 * @throws {Error} If the channel with the specified name is not found.
 */
const getChannelByDiscordChatName = async (chatName) => {
  const guild = await DISCORD_CLIENT.guilds.fetch(DISCORD_SERVER_ID);
  const channels = await guild.channels.fetch();
  const channel = channels.find((chat) => chat.name === chatName);

  if (!channel) {
    throw new Error(`Channel with name ${chatName} not found`);
  }

  return channel;
};

/**
 * Retrieves a Discord channel by its ID.
 *
 * @param {string} channelId - The ID of the chat channel to retrieve.
 * @returns {Promise<Object>} A promise that resolves to the Discord channel object.
 * @throws {Error} If the channel with the specified ID is not found.
 */
export const getChannelByDiscordById = async (channelId) => {
  const guild = await DISCORD_CLIENT.guilds.fetch(DISCORD_SERVER_ID);
  const channel = await guild.channels.fetch(channelId);

  if (!channel) {
    throw new Error(`Channel with ID ${channelId} not found`);
  }

  return channel;
};

DISCORD_CLIENT.login(TOKEN);
