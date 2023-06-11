interface Media {
  title: string;
}

export const sortMediaAlphabetically: (a: Media, b: Media) => number = (
  { title: firstTitle },
  { title: secondTitle }
) => (firstTitle > secondTitle ? 1 : 0);
