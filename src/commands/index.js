import { keys } from "./keys.js";
import { list } from "./list.js";

const COMMANDS = {
  ping: "ping",
  keys: "keys",
  list: "list",
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
  ];
};

export const commandExecutor = async (interaction) => {
  if (!interaction.isChatInputCommand()) return;

  try {
    switch (interaction.commandName) {
      case COMMANDS.keys:
        await interaction.reply(await keys());
        break;
      case COMMANDS.list:
        await interaction.reply(await list());
        break;
      default:
        await interaction.reply(`Unknown command: ${interaction.commandName}`);
    }
  } catch (error) {
    await interaction.reply(
      `Execute command "${interaction.commandName}" panic with error ${String(
        error
      )}`
    );
  }
};
