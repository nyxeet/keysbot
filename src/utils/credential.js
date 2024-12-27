import fs from "fs";

const PATH_TO_CREDENTIAL = "credential.json";

/**
 * Retrieves the value of a credential by key.
 *
 * This function first checks if the credential file exists at the specified path.
 * If the file exists, it reads the file, parses the JSON content, and returns the value associated with the given key.
 * If the key is not found in the file, it then checks the environment variables for the key.
 * If the key is found in the environment variables, it returns the value.
 * If the key is not found in both the credential file and the environment variables, it throws an error.
 *
 * @param {string} key - The key of the credential to retrieve.
 * @returns {string} The value of the credential.
 * @throws {Error} If the key is not found in both the credential file and the environment variables.
 */
const getCredentialValue = (key, path = PATH_TO_CREDENTIAL) => {
  if (fs.existsSync(path)) {
    const credentialJson = fs.readFileSync(path, {
      encoding: "utf-8",
    });
    const parsedJson = JSON.parse(credentialJson);

    if (parsedJson[key]) return parsedJson[key];
  }

  if (process.env[key]) {
    return process.env[key];
  }

  throw new Error(`[getCredentialValue] Can't get ${key}`);
};

/**
 * Retrieves the Discord token from a credential file or environment variable.
 *
 * @returns {string} The Discord token.
 * @throws {Error} If the Discord token cannot be found in the credential file or environment variable.
 */
export const getDiscordToken = () => {
  return getCredentialValue("DISCORD_TOKEN");
};

/**
 * Retrieves the Discord Application ID from a credential file or environment variable.
 *
 * @returns {string} The Discord Application ID.
 * @throws {Error} If the Discord Application ID cannot be found in the credential file or environment variable.
 */
export const getDiscordApplicationId = () => {
  return getCredentialValue("DISCORD_APP_ID");
};
