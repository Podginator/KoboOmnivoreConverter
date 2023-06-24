export function wordsToReadingTime(wordCount: number): number {
  const wordsPerMinute = 200;
  const minutes = wordCount / wordsPerMinute;

  // Round to the nearest minute
  const roundedMinutes = Math.round(minutes);

  // Return a string that represents the reading time
  return roundedMinutes;
}
