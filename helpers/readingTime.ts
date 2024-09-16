export function estimateReadingTime(
  text: string,
  wordsPerMinute: number = 200
): string {
  const words = text.split(/\s+/).filter((word) => word.length > 0);
  const wordCount = words.length;

  if (wordCount === 0) {
    return "Less than a minute";
  }

  const minutes = Math.ceil(wordCount / wordsPerMinute);
  return `${minutes} min`;
}
