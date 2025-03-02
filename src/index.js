import { commandExecutor } from './commands/index.js';
import { startDiscordBackgroundWorker } from './discord/index.js';
import { registerJobs } from './jobs/index.js';
import { mongoConnect } from './store/mongoConnector.js';

(async () => {
  await startDiscordBackgroundWorker({
    onStart: async (client) => {
      await mongoConnect();
      registerJobs();

      console.info(`Background worker started like ${client.user.tag}`);
    },
    onCommand: commandExecutor,
  });
})();
