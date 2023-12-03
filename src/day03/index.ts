import run from "aocrunner";

const exampleInput = `467..114..
...*......
..35..633.
......#...
617*......
.....+.58.
..592.....
......755.
...$.*....
.664.598..`;

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((l) => l.split(""));

type Point = {
  x: number;
  y: number;
};

type NumberDescription = {
  number: number;
  position: Point;
  length: number;
};

function findNumbers(matrix: string[][]): NumberDescription[] {
  return matrix.reduce((numbers, line, y) => {
    return [
      ...numbers,
      ...[...line.join("").matchAll(/\d+/g)].map(
        (match) =>
          ({
            length: match[0].length,
            number: parseInt(match[0]),
            position: {
              x: match.index!,
              y,
            },
          } satisfies NumberDescription),
      ),
    ];
  }, [] as NumberDescription[]);
}

const ADJACENT: Point[] = [
  { x: 0, y: -1 },
  { x: 1, y: -1 },
  { x: 1, y: 0 },
  { x: 1, y: 1 },
  { x: 0, y: 1 },
  { x: -1, y: 1 },
  { x: -1, y: 0 },
  { x: -1, y: -1 },
];

function addPoints(a: Point, b: Point): Point {
  return {
    x: a.x + b.x,
    y: a.y + b.y,
  };
}

const NUMBERS = ["0", "1", "2", "3", "4", "5", "6", "7", "8", "9"];

const NON_PARTS = [undefined, ".", ...NUMBERS];

function isPartNumber(number: NumberDescription, matrix: string[][]): boolean {
  const points = new Array<Point>(number.length)
    .fill(number.position)
    .map((point, index) => ({ ...point, x: point.x + index }));

  return points.some((point) =>
    ADJACENT.map((delta) => addPoints(point, delta)).some((adjacentPoint) => {
      const character = (matrix[adjacentPoint.y] ?? [])[adjacentPoint.x];

      return !NON_PARTS.includes(character);
    }),
  );
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return findNumbers(input)
    .filter((number) => isPartNumber(number, input))
    .reduce((a, b) => a + b.number, 0);
};

function findGears(matrix: string[][]): Point[] {
  return matrix.reduce((gears, line, y) => {
    return [
      ...gears,
      ...[...line.join("").matchAll(/\*/g)].map(
        (match) =>
          ({
            x: match.index!,
            y,
          } satisfies Point),
      ),
    ];
  }, [] as Point[]);
}

function getGearRatio(
  gear: Point,
  numbers: NumberDescription[],
  matrix: string[][],
): number {
  const allAdjacent = new Set(
    ADJACENT.map((delta) => addPoints(gear, delta))
      .map((adjacentPoint) => {
        const character = (matrix[adjacentPoint.y] ?? [])[adjacentPoint.x];

        if (!NUMBERS.includes(character)) return null;

        return (
          numbers.find(
            (n) =>
              adjacentPoint.x >= n.position.x &&
              adjacentPoint.x <= n.position.x + n.length &&
              adjacentPoint.y === n.position.y,
          )?.number ?? null
        );
      })
      .filter((n): n is number => n != null),
  );

  if (allAdjacent.size !== 2) return 0;
  return [...allAdjacent].reduce((a, b) => a * b, 1);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  const numbers = findNumbers(input);

  const gears = findGears(input);

  return gears.reduce(
    (prev, gear) => prev + getGearRatio(gear, numbers, input),
    0,
  );
};

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 4361,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 467835,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
