export function extractParamsFromUrl(url: string): Record<string, string> {
  const pathname = new URL(url).pathname;
  const urlParts = pathname.split("/");

  const params: Record<string, string> = {};
  urlParts.forEach((part) => {
    if (part.startsWith(":")) {
      params[part.slice(1)] = "";
    }
  });

  return params;
}
