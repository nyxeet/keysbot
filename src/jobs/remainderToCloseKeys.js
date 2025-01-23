import { CronJob } from "cron";
import { keys } from "../commands/keys.js";
import { CHANNEL_ID, getChannelByDiscordById } from "../discord/index.js";

export const remainderToCloseKeys = new CronJob(
  "0 18 * * 2",
  async () => {
    const channel = await getChannelByDiscordById(CHANNEL_ID);
    const message = await keys();
    await channel.send(message);
  },
  null,
  false,
  "Europe/Kiev"
);
