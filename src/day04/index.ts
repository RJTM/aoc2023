import run from "aocrunner";

const exampleInput = `Card 1: 41 48 83 86 17 | 83 86  6 31 17  9 48 53
Card 2: 13 32 20 16 61 | 61 30 68 82 17 32 24 19
Card 3:  1 21 53 59 44 | 69 82 63 72 16 21 14  1
Card 4: 41 92 73 84 69 | 59 84 76 51 58  5 54 83
Card 5: 87 83 26 28 32 | 88 30 70 12 93 22 82 36
Card 6: 31 18 13 56 72 | 74 77 10 23 35 67 36 11`;

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((card) => {
    const [winning, ours] = card
      .split(":")[1]
      .trim()
      .split("|")
      .map((s) => s.trim());

    return {
      winning: winning
        .split(" ")
        .map((number) => parseInt(number.trim()))
        .filter((n) => !isNaN(n)),
      ours: ours
        .split(" ")
        .map((number) => parseInt(number.trim()))
        .filter((n) => !isNaN(n)),
    };
  });

function intersection<T>(a: T[], b: T[]): T[] {
  return a.filter((x) => b.includes(x));
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((prev, { winning, ours }) => {
    const ourWinningNumbers = intersection(winning, ours).length;
    const score =
      ourWinningNumbers === 0 ? 0 : Math.pow(2, ourWinningNumbers - 1);

    return prev + score;
  }, 0);
};

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const cards = input.map((_) => 1);

  cards.forEach((cardAmount, cardNumber) => {
    const winningNumbers = intersection(
      input[cardNumber].winning,
      input[cardNumber].ours,
    ).length;

    for (let i = cardNumber + 1; i <= cardNumber + winningNumbers; i++) {
      cards[i] += cardAmount;
    }
  });

  return cards.reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 13,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 30,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
