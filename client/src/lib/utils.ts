export const ellipsis = (
  str: string,
  length: number = 20,
  tail: string = "..."
) => {
  if (str.length > 20) {
    return str.substring(0, length) + tail;
  }
  return str;
};
