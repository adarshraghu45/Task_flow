export const param = (value: string | string[]): string =>
  String(Array.isArray(value) ? value[0] : value);
