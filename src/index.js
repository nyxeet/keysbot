import { commandExecutor } from "./commands/index.js";
import { startDiscordBackgroundWorker } from "./discord/index.js";
import { registerJobs } from "./jobs/index.js";

(async () => {
  await startDiscordBackgroundWorker({
    onStart: async (client) => {
      registerJobs();

      console.info(`Background worker started like ${client.user.tag}`);
    },
    onCommand: commandExecutor,
  });
})();
