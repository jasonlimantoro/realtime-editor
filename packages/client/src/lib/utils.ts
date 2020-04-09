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

export const tryCatch = (fn: Function) => async ({
  errorFn = (x: any) => x,
  successFn = (x: any) => x,
}) => {
  try {
    const res = await fn();
    successFn(res);
  } catch (e) {
    errorFn(e);
  }
};

export const confirmedAction = (
  action: Function,
  message = "Are you sure"
) => () => {
  // eslint-disable-next-line no-useless-return,no-restricted-globals,no-alert
  if (!confirm(message)) return;
  action();
};
