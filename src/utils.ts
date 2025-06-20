export function shuffle<T>(array: T[]): T[] {
  const result = [...array]; // create a shallow copy
  let currentIndex = result.length;

  while (currentIndex !== 0) {
    const randomIndex = Math.floor(Math.random() * currentIndex);
    currentIndex--;

    [result[currentIndex], result[randomIndex]] = [
      result[randomIndex], result[currentIndex],
    ];
  }

  return result;
}
