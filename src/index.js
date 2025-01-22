import { commandExecutor } from "./commands/index.js";
import { startDiscordBackgroundWorker } from "./discrod/index.js";
import { registerJobs } from "./jobs/index.js";

(async () => {
  registerJobs();
  await startDiscordBackgroundWorker({
    onStart: (client) => {
      console.info(`Background worker started like ${client.user.tag}`);
    },
    onCommand: commandExecutor,
  });
})();
