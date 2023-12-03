import run from "aocrunner";

const exampleInput = `Game 1: 3 blue, 4 red; 1 red, 2 green, 6 blue; 2 green
Game 2: 1 blue, 2 green; 3 green, 4 blue, 1 red; 1 green, 1 blue
Game 3: 8 green, 6 blue, 20 red; 5 blue, 4 red, 13 green; 5 green, 1 red
Game 4: 1 green, 3 red, 6 blue; 3 green, 6 red; 3 green, 15 blue, 14 red
Game 5: 6 red, 1 blue, 3 green; 2 blue, 1 red, 2 green`;

type Pair = {
  number: number;
  colour: "red" | "blue" | "green";
};

type Round = Pair[];
type Game = Round[];

const parseInput = (rawInput: string) =>
  rawInput.split("\n").map((game) =>
    game
      .split(":")[1]
      .trim()
      .split(";")
      .map((round) => {
        return round
          .trim()
          .split(",")
          .map((set) => {
            const [number, colour] = set.trim().split(" ");
            return { number: parseInt(number), colour } as Pair;
          });
      }),
  );

const MAX_NUMBERS = {
  red: 12,
  green: 13,
  blue: 14,
};

function isPossible(game: Game) {
  return game.every((round) =>
    round.every((pair) => pair.number <= MAX_NUMBERS[pair.colour]),
  );
}

const part1 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce(
    (prev, current, gameId) => prev + (isPossible(current) ? gameId + 1 : 0),
    0,
  );
};

function getPower(game: Game): number {
  return ["red", "green", "blue"].reduce((prev, colour) => {
    return (
      Math.max(
        ...game.map(
          (round) => round.find((pair) => pair.colour === colour)?.number ?? 0,
        ),
      ) * prev
    );
  }, 1);
}

const part2 = (rawInput: string) => {
  const input = parseInput(rawInput);

  return input.reduce((prev, current, gameId) => prev + getPower(current), 0);
};

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 8,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 2286,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
