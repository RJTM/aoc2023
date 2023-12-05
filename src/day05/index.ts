import run from "aocrunner";

const exampleInput = `seeds: 79 14 55 13

seed-to-soil map:
50 98 2
52 50 48

soil-to-fertilizer map:
0 15 37
37 52 2
39 0 15

fertilizer-to-water map:
49 53 8
0 11 42
42 0 7
57 7 4

water-to-light map:
88 18 7
18 25 70

light-to-temperature map:
45 77 23
81 45 19
68 64 13

temperature-to-humidity map:
0 69 1
1 0 69

humidity-to-location map:
60 56 37
56 93 4`;

type Transformation = {
  source: number;
  destination: number;
  range: number;
};

const parseInput = (rawInput: string) => {
  const lines = rawInput.split("\n");

  const seeds = lines.shift()!.split(": ")[1].split(" ").map(Number);

  let currentGroup: string[] = [];
  const transformationGroups: string[][] = [];
  for (const line of lines) {
    if (line.trim().length === 0) continue;
    if (/^\d/.test(line)) {
      currentGroup.push(line);
      continue;
    }

    if (currentGroup.length != 0) {
      transformationGroups.push(currentGroup);
      currentGroup = [];
    }
  }

  transformationGroups.push(currentGroup);

  return {
    seeds,
    transformations: transformationGroups.map((group) =>
      group.map((line) => {
        const [destination, source, range] = line
          .split(" ")
          .map((n) => parseInt(n));
        return { destination, source, range } satisfies Transformation;
      }),
    ),
  };
};

const part1 = (rawInput: string) => {
  const { seeds, transformations } = parseInput(rawInput);

  transformations.forEach((transformationGroup) => {
    const mapped = new Array(seeds.length).fill(false);
    transformationGroup.forEach((transformation) => {
      seeds.forEach((seed, seedIndex) => {
        if (
          !mapped[seedIndex] &&
          seed >= transformation.source &&
          seed < transformation.source + transformation.range
        ) {
          // console.log(
          //   `seed ${seed} changed with transformation ${
          //     transformation.destination
          //   } ${transformation.source} ${transformation.range} to ${
          //     transformation.destination + seed - transformation.source
          //   }`,
          // );
          mapped[seedIndex] = true;
          seeds[seedIndex] =
            transformation.destination + seed - transformation.source;
        }
      });
    });
  });

  return Math.min(...seeds);
};

function arrayChunk<T>(array: T[], chunkSize: number): T[][] {
  const chunks = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    chunks.push(array.slice(i, i + chunkSize));
  }
  return chunks;
}

const part2 = (rawInput: string) => {
  const { seeds: initialSeeds, transformations } = parseInput(rawInput);

  const seeds = arrayChunk(initialSeeds, 2).flatMap((pair) =>
    new Array(pair[1]).fill(undefined).map((_, i) => pair[0] + i),
  );

  transformations.forEach((transformationGroup) => {
    const mapped = new Array(seeds.length).fill(false);
    transformationGroup.forEach((transformation) => {
      seeds.forEach((seed, seedIndex) => {
        if (
          !mapped[seedIndex] &&
          seed >= transformation.source &&
          seed < transformation.source + transformation.range
        ) {
          // console.log(
          //   `seed ${seed} changed with transformation ${
          //     transformation.destination
          //   } ${transformation.source} ${transformation.range} to ${
          //     transformation.destination + seed - transformation.source
          //   }`,
          // );
          mapped[seedIndex] = true;
          seeds[seedIndex] =
            transformation.destination + seed - transformation.source;
        }
      });
    });
  });

  return Math.min(...seeds);
};

run({
  part1: {
    tests: [
      {
        input: exampleInput,
        expected: 35,
      },
    ],
    solution: part1,
  },
  part2: {
    tests: [
      {
        input: exampleInput,
        expected: 46,
      },
    ],
    solution: part2,
  },
  trimTestInputs: true,
  // onlyTests: true,
});
