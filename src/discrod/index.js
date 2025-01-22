import { Client, Events, GatewayIntentBits, REST, Routes } from "discord.js";
import { getCommandsForRegistration } from "../commands/index.js";
import {
  getDiscordApplicationId,
  getDiscordToken,
} from "../utils/credential.js";

const TOKEN = getDiscordToken();
const DISCORD_CLIENT = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
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

DISCORD_CLIENT.login(TOKEN);

export const sendMessageToDiscord = async (channelId, message) => {
  const channel = await DISCORD_CLIENT.channels.fetch(channelId);
  if (channel) {
    channel.send(message);
  } else {
    console.error("Channel not found");
  }
};
