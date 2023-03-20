export const copyArray = (arr: string[][]): string[][] => {
  return [...arr.map(rows => [...rows])];
};

export const getDayOfTheYear = (): number => {
  const now: Date = new Date();
  const start: Date = new Date(now.getFullYear(), 0, 0);
  const diff: number = now.getTime() - start.getTime();
  const oneDay: number = 1000 * 60 * 60 * 24;
  const day: number = Math.floor(diff / oneDay);
  return day;
};

export const getDayKey = (): string => {
  const date = new Date();
  const year = date.getFullYear();
  const day = getDayOfTheYear();
  return `day-${day}-${year}`;
};

export const getWordIndex = (): number => {
  const today: Date = new Date();
  const zeroDay: Date = new Date('2023-03-20');
  const daysSinceZero: number = Math.floor(
    (today.getTime() - zeroDay.getTime()) / (1000 * 60 * 60 * 24),
  ); // Calculate the number of days since the zero day
  const index: number = daysSinceZero % 5535; // 5535 is a dictionary size (don't want to import dictionary here)
  return index;
};
