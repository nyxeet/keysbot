const DELIMITER = "|||";

export const buildId = (...values) => values.join(DELIMITER);
export const parseId = (value) => {
  if (value && typeof value === "string") {
    const [command, ...rest] = value.split(DELIMITER);
    return { command, rest };
  }

  return { command: undefined };
};
