import fs from "fs";

const PATH_TO_SUBSCRIBES = "subscribes.json";

const State = {
  subscribes: JSON.parse(
    fs.readFileSync(PATH_TO_SUBSCRIBES, {
      encoding: "utf-8",
    })
  ).players,
};

export const subscribe = () => {};

/**
 * Retrieves the list of subscribers from the state.
 *
 * @returns {Array} An array of subscribers. If there are no subscribers, returns an empty array.
 */
export const getSubscribers = () => {
  return State.subscribes || [];
};
