/**
 * Use to generate header of token
 * @param key
 * @returns
 */
function getBearerTokenHeader(key: string) {
  if (!key) throw new Error("API Key of Atoma is required");
  return { Authorization: `Bearer ${key}` };
}

/**
 * Use to merge headers of request
 * @param args
 */
function mergeHeaders<T extends Array<any>>(...args: T) {
  const result = {};

  for (const arg of args) {
    for (const key of Object.keys(arg)) {
      (result as any)[key] = (arg as any)[key];
    }
  }

  return result as { [K in keyof T]: T[K] };
}

export const APIUtils = {
  getBearerTokenHeader,
  mergeHeaders,
};
