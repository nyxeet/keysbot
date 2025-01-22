import { keys } from "./keys.js";
import { list } from "./list.js";
import {
  subscribe,
  SUBSCRIBE_FINAL_MODAL_SETTED,
  SUBSCRIBE_REGION_SETTED,
} from "./subscribe.js";
import { SUBSCRIBE_NAME_SETTED, unsubscribe } from "./unsubscribe.js";
import { parseId } from "./utils.js";

const COMMANDS = {
  keys: "keys",
  list: "list",
  subscribe: "subscribe",
  unsubscribe: "unsubscribe",
};

export const getCommandsForRegistration = () => {
  return [
    {
      name: COMMANDS.keys,
      description: `Перевіряє та повертає інформацію про статус ключів для підписаних гравців`,
    },
    {
      name: COMMANDS.list,
      description: `Повертає список гравців, які підписані на закриття ключів`,
    },
    {
      name: COMMANDS.subscribe,
      description: `Додає гравця, який буде підписаний на закриття ключів`,
    },
    {
      name: COMMANDS.unsubscribe,
      description: `Видаляє гравця, який був підписаний на закриття ключів`,
    },
  ];
};

export const commandExecutor = async (interaction) => {
  let customCommand = undefined;

  if (interaction.customId) {
    const { command } = parseId(interaction.customId);
    customCommand = command;
  }

  const commandName = interaction.commandName || customCommand;

  try {
    switch (commandName) {
      case COMMANDS.keys:
        await interaction.reply(await keys());
        break;
      case COMMANDS.list:
        await interaction.reply(await list());
        break;
      case COMMANDS.subscribe:
      case SUBSCRIBE_REGION_SETTED:
      case SUBSCRIBE_FINAL_MODAL_SETTED:
        await subscribe(interaction);
        break;
      case COMMANDS.unsubscribe:
      case SUBSCRIBE_NAME_SETTED:
        await unsubscribe(interaction);
        break;
      default:
        await interaction.reply(`Unknown command: ${interaction.commandName}`);
    }
  } catch (error) {
    console.error(error);
    await interaction.reply(
      `Execute command "${interaction.commandName}" panic with error ${String(
        error
      )}`
    );
  }
};
