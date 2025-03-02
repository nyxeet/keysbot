import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} from 'discord.js';
import { parseId } from './utils.js';
import dao from '../store/index.js';

export const SUBSCRIBE_NAME_SETTED = 'SUBSCRIBE_NAME_SETTED';

export const unsubscribe = async (interaction) => {
  const { command } = parseId(interaction.customId);

  switch (command) {
    case SUBSCRIBE_NAME_SETTED: {
      const character = interaction.fields.getTextInputValue('character');

      const characters = await dao.listCharacters();
      const characterExists = characters.find(
        (value) => value.name === character
      );

      if (characterExists) {
        await dao.removeCharacter(character);
        await interaction.reply({
          content: `Персонажа "${character}" було видалено`,
          ephemeral: true,
        });
      } else {
        await interaction.reply({
          content: `Персонаж "${character}" не був підписаний на ключі`,
          ephemeral: true,
        });
      }
      break;
    }
    default: {
      const characterNameInput = new TextInputBuilder()
        .setCustomId('character')
        .setLabel("Ім'я персонажа:")
        .setStyle(TextInputStyle.Short);

      const firstRow = new ActionRowBuilder().addComponents(characterNameInput);
      const modal = new ModalBuilder()
        .setCustomId(SUBSCRIBE_NAME_SETTED)
        .setTitle('Видаляємо роботягу з ключів');
      modal.addComponents(firstRow);
      await interaction.showModal(modal);
    }
  }
};
