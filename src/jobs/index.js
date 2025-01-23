import { ratingUpCheck } from "./ratingUpCheck.js";
import { remainderToCloseKeys } from "./remainderToCloseKeys.js";

export const registerJobs = () => {
  remainderToCloseKeys.start();
  ratingUpCheck.start();
};
