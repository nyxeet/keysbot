import {
  ActionRowBuilder,
  ModalBuilder,
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
  TextInputBuilder,
  TextInputStyle,
} from "discord.js";
import { addCharacter } from "../store/index.js";
import { fetchInformationFromRaiderIoByPlayer } from "./keys.js";
import { buildId, parseId } from "./utils.js";

export const SUBSCRIBE_REGION_SETTED = "SUBSCRIBE_REGION_SETTED";
export const SUBSCRIBE_FINAL_MODAL_SETTED = "SUBSCRIBE_FINAL_MODAL_SETTED";

export const subscribe = async (interaction) => {
  const { command, rest } = parseId(interaction.customId);

  switch (command) {
    case SUBSCRIBE_FINAL_MODAL_SETTED: {
      const character = interaction.fields.getTextInputValue("character");
      const realm = interaction.fields.getTextInputValue("realm");
      const region = rest[0];

      const data = await fetchInformationFromRaiderIoByPlayer({
        name: character,
        realm,
        region,
      });

      if (data.error) {
        await interaction.reply({
          content: `Не можу знайти персонажа "${character}" на сервері "${realm}-${region}"\n- Перевірте правильність написання сервера та імені персонажа. Якщо ви впевнені, що все вірно, зверніться до розробника`,
          ephemeral: true,
        });
      } else {
        await addCharacter({
          name: character,
          realm,
          region,
        });
        await interaction.reply({
          content: `Персонажа "${character}" додано`,
          ephemeral: true,
        });
      }

      break;
    }
    case SUBSCRIBE_REGION_SETTED: {
      const region = interaction.values;

      const characterNameInput = new TextInputBuilder()
        .setCustomId("character")
        .setLabel("Ім'я персонажа:")
        .setStyle(TextInputStyle.Short);
      const realmNameInput = new TextInputBuilder()
        .setCustomId("realm")
        .setLabel("Ім'я сервера:")
        .setStyle(TextInputStyle.Short);
      const firstRow = new ActionRowBuilder().addComponents(realmNameInput);
      const secondRow = new ActionRowBuilder().addComponents(
        characterNameInput
      );
      const modal = new ModalBuilder()
        .setCustomId(buildId(SUBSCRIBE_FINAL_MODAL_SETTED, region))
        .setTitle("Ну давайте додамо роботягу");
      modal.addComponents(firstRow, secondRow);

      await interaction.showModal(modal);
      break;
    }
    default: {
      const regionSelector = new StringSelectMenuBuilder()
        .setCustomId(SUBSCRIBE_REGION_SETTED)
        .setPlaceholder("Виберіть регіон")
        .addOptions(
          new StringSelectMenuOptionBuilder()
            .setLabel("us")
            .setDescription("US - United States (США)")
            .setValue("us"),
          new StringSelectMenuOptionBuilder()
            .setLabel("eu")
            .setDescription("EU - Europe (Європа)")
            .setValue("eu"),
          new StringSelectMenuOptionBuilder()
            .setLabel("tw")
            .setDescription("TW - Taiwan (Тайвань)")
            .setValue("tw"),
          new StringSelectMenuOptionBuilder()
            .setLabel("kr")
            .setDescription("KR - Korea (Корея)")
            .setValue("kr"),
          new StringSelectMenuOptionBuilder()
            .setLabel("cn")
            .setDescription("CN - China (Китай)")
            .setValue("cn")
        );
      const actionRow = new ActionRowBuilder().addComponents(regionSelector);

      await interaction.reply({
        components: [actionRow],
        ephemeral: true,
      });
    }
  }
};
