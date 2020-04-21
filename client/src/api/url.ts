export const route = window.location.origin;
export const mainPrefix = "/api/1.0";

export const getUrl = (prefix: string = mainPrefix) => `${route}${prefix}`;
