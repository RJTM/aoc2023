import run from "aocrunner";

const exampleInputFirstPart = `1abc2
pqr3stu8vwx
a1b2c3d4e5f
treb7uchet`;

const exampleInputSecondPart = `two1nine
eightwothree
abcone2threexyz
xtwone3four
4nineeightseven2
zoneight234
7pqrstsixteen`;

const parseInput = (rawInput: string) => rawInput;

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map((l) => {
      const numbers = l
        .split("")
        .map(Number)
        .filter((n) => !isNaN(n));

      return Number(`${numbers[0]}${numbers.at(-1)!}`);
    })
    .reduce((a, b) => a + b, 0);
};

const numberMap: { [name: string]: string } = {
  one: "1",
  two: "2",
  three: "3",
  four: "4",
  five: "5",
  six: "6",
  seven: "7",
  eight: "8",
  nine: "9",
  zero: "0",
};

function findNumbers(line: string): string {
  const digits: string[] = [];
  for (let i = 0; i < line.length; i++) {
    if (!isNaN(Number(line[i]))) {
      digits.push(line[i]);
      continue;
    }

    const searchString = line.substring(i);
    const matches = searchString.match(
      new RegExp(`^(${Object.keys(numberMap).join("|")})`, "gi"),
    );

    if (matches != null) {
      digits.push(numberMap[matches[0]]);
    }
  }

  return digits.join("");
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input
    .split("\n")
    .map((l) => {
      const numbers = findNumbers(l);

      return Number(`${numbers[0]}${numbers.at(-1)!}`);
    })
    .reduce((a, b) => a + b, 0);
};

run({
  part1: {
    tests: [
      {
        input: exampleInputFirstPart,
        expected: 142,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInputSecondPart,
        expected: 281,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
