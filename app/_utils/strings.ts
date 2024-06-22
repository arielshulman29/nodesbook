export const capitalize = (string: string) => {
  if (!string.length) return string;
  const capitalizedFirstLetter = string[0].toLocaleUpperCase();
  return capitalizedFirstLetter + string.slice(1);
};

export function toCamelCase(string: string): string {
  return string
    .replaceAll("_", " ")
    .split(" ")
    .map((c) => capitalize(c))
    .join(" ");
}
