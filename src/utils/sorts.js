export const sortStringsAlphabetically = (value, nextValue) => {
  return value.localeCompare(nextValue);
};

export const sortStringsUnAlphabetically = (value, nextValue) => {
  return nextValue.localeCompare(value);
};
