export const toIndex = (v, l) => ((v % l) + l) % l;

export const sum = (arr) => arr.reduce((x, y) => x + y, 0);

export function calcItemsOnLastSlide(itemSizes, itemsPerSlide) {
  const last2Sum = sum(itemSizes.slice(-2));
  if (last2Sum > itemsPerSlide) return 1;

  for (let i = 0; i < itemsPerSlide - 2; i++) {
    const a = itemsPerSlide - i;

    const [h, ...tail] = itemSizes.slice(-a);

    const tailSum = sum(tail);
    if (tailSum >= a || (h > 1 && tailSum === a - 1)) return a - 1;
  }

  return itemsPerSlide;
}
