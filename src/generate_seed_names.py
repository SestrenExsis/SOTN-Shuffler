# External libraries
import argparse
import random
import yaml

if __name__ == '__main__':
    '''
    Usage
    python shuffle_quests.py
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    parser = argparse.ArgumentParser()
    parser.add_argument('words', help='Input a filepath to the words YAML file', type=str)
    parser.add_argument('count', help='Input how many seeds to generate', type=int)
    parser.add_argument('preset', help='Input a preset name', type=str)
    parser.add_argument('skillset', help='Input a skillset name', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    parser.add_argument('--output', help='Input a filepath to the output TXT file', type=str)
    args = parser.parse_args()
    seed_count = 1 if args.count is None else args.count
    preset = 'Standard' if args.preset is None else args.preset
    skillset = 'Casual' if args.skillset is None else args.skillset
    with open(args.words) as words_file:
        words = yaml.safe_load(words_file)
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    rng = random.Random(initial_seed)
    seeds = []
    adjectives = words.get('Adjectives', ['Adjective'])
    nouns = words.get('Nouns', ['Noun'])
    for _ in range(seed_count):
        seed_name = rng.choice(adjectives) + rng.choice(nouns)
        N = len(seed_name)
        digits = []
        max_digits = rng.randint(3, 10)
        while len(digits) < max_digits and N < 28:
            digits.append(rng.randint(0, 9))
            N += 2
        seeds.append(' '.join((preset, skillset, seed_name + ''.join(map(str, digits)))))
    if args.output is None:
        for seed in seeds:
            print(seed)
    else:
        with open(args.output, 'w') as output_file:
            output_file.write('\n'.join(seeds))