import fs from "fs";

const PATH_TO_SUBSCRIBES = "./src/store/subscribes.json";

export const SUBSCRIBERS_STATE = {
  entries: (() => {
    try {
      return JSON.parse(
        fs.readFileSync(PATH_TO_SUBSCRIBES, {
          encoding: "utf-8",
        })
      ).players;
    } catch (error) {
      console.error(
        "[subscribersState] error reading or parsing subscribes.json:",
        error
      );
      return [];
    }
  })(),

  // #region Actions
  subscribePlayer: function () {
    // TODO: [Ivan]
  },

  /**
   * Retrieves the list of subscribers from the state.
   *
   * @returns {Array} An array of subscribers. If there are no subscribers, returns an empty array.
   */
  getSubscribers: function () {
    return this.entries || [];
  },
  // #endregion
};
