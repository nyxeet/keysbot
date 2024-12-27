import fs from "fs";

const PATH_TO_CREDENTIAL = "credential.json";

/**
 * Retrieves the Discord token from a credential file or environment variable.
 *
 * @returns {string} The Discord token.
 * @throws {Error} If the Discord token cannot be found in the credential file or environment variable.
 */
export const getDiscordToken = () => {
  if (fs.existsSync(PATH_TO_CREDENTIAL)) {
    const credentialJson = fs.readFileSync(PATH_TO_CREDENTIAL, {
      encoding: "utf-8",
    });
    const parsedJson = JSON.parse(credentialJson);

    if (parsedJson.discord_token) return parsedJson.discord_token;
  }

  if (process.env.DISCORD_TOKEN) {
    return process.env.DISCORD_TOKEN;
  }

  throw new Error("Can't get Discord token");
};
