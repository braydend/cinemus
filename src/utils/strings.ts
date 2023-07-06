export const sentenceCase = (input: string) => {
  const restOfString = input.slice(1);

  return `${input.charAt(0).toUpperCase()}${restOfString.toLowerCase()}`;
};
