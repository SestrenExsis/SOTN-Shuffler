# External libraries
import argparse
import random
import yaml

def shuffle_relics_and_required_items(quests, seed, relic_pool: str='Vanilla'):
    rng = random.Random(seed)
    quest_targets = []
    while True:
        duplicate_relics = []
        for quest_source_name in list(sorted(quests['Sources'].keys())):
            if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') != 'Required':
                continue
            quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
            if not quest_target_name.startswith('Relic'):
                continue
            if 'Low Priority - Racing' in quests['Targets'][quest_target_name].get('Tags', {}):
                continue
            duplicate_relics.append(quest_target_name)
        rng.shuffle(duplicate_relics)
        quest_targets = []
        for quest_source_name in list(sorted(quests.get('Sources', {}))):
            if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') != 'Required':
                continue
            quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
            # If Racing Relic pool is enabled, replace low priority relics with a random duplicate of a better one
            if relic_pool == 'Racing' and 'Low Priority - Racing' in quests['Targets'][quest_target_name].get('Tags', {}):
                quest_target_name = duplicate_relics.pop()
            quest_targets.append(quest_target_name)
        rng.shuffle(quest_targets)
        valid_ind = True
        index = 0
        for quest_source_name in list(sorted(quests['Sources'].keys())):
            if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') != 'Required':
                continue
            quest_target_type = quest_targets[-index - 1].split(' - ')[0]
            if quest_target_type not in quests['Sources'][quest_source_name].get('Tags', []):
                valid_ind = False
                break
            index += 1
        if valid_ind:
            break
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') != 'Required':
            continue
        quest_target_name = quest_targets.pop()
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target_name

def shuffle_items(quests, seed, item_pool: str='Vanilla'):
    rng = random.Random(seed)
    quest_targets = []
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        if 'Item' not in quests['Sources'][quest_source_name].get('Tags', {}):
            continue
        if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') == 'Required':
            continue
        quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
        quest_targets.append(quest_target_name)
    if item_pool == 'Racing':
        rng.shuffle(quest_targets)
        item_bin_counts = {
            'Bomb': 2,
            'Thrown': 2,
            'Food': 2,
            'Buff': 2,
            'Healing': 1,
        }
        # Assign each placeholder an arbitrary item from the item bin
        placeholders = {}
        for item_bin_name in sorted(item_bin_counts.keys()):
            for bin_id in range(1, item_bin_counts[item_bin_name] + 1):
                placeholder_name = 'Placeholder - ' + item_bin_name + ' ' + str(bin_id)
                placeholders[placeholder_name] = (item_bin_name, None)
        chosen_items = set()
        for placeholder_name in sorted(placeholders.keys()):
            (item_bin_name, chosen_item) = placeholders[placeholder_name]
            if chosen_item is not None:
                continue
            for i in range(len(quest_targets)):
                quest_target_name = quest_targets[i]
                if 'Low Priority - Racing' in quests['Targets'][quest_target_name].get('Tags', {}):
                    continue
                if item_bin_name not in quests['Targets'][quest_target_name].get('Tags', {}):
                    continue
                if quest_targets[i] in chosen_items:
                    continue
                placeholders[placeholder_name] = (item_bin_name, quest_targets[i])
                chosen_items.add(quest_targets[i])
                break
        for i in range(len(quest_targets)):
            quest_target_name = quest_targets[i]
            # Chance of replacing a Low Priority - Racing item with something else
            if 'Low Priority - Racing' in quests['Targets'][quest_target_name].get('Tags', {}):
                chance = rng.random()
                if chance < 0.025:
                    quest_targets[i] = 'Item - Library Card'
                elif chance < 0.05:
                    quest_targets[i] = 'Item - Manna Prism'
                elif chance < 0.80:
                    (item_bin_name, assigned_quest_target) = rng.choice(list(sorted(placeholders.values())))
                    quest_targets[i] = assigned_quest_target
            else:
                # Override items found in a placeholder bin to the binned item
                for (item_bin_name, assigned_quest_target) in placeholders.values():
                    if item_bin_name in quests['Targets'][quest_target_name].get('Tags', {}):
                        quest_targets[i] = assigned_quest_target
                        break
    else:
        rng.shuffle(quest_targets)
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        if 'Item' not in quests['Sources'][quest_source_name].get('Tags', {}):
            continue
        if quests['Sources'][quest_source_name].get('Logic Level', 'Optional') == 'Required':
            continue
        quest_target = quest_targets.pop()
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target

def shuffle_enemy_drops(quests, seed):
    rng = random.Random(seed)
    quest_targets = []
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        if 'Enemy Drop' not in quests['Sources'][quest_source_name].get('Tags', {}):
            continue
        quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
        quest_targets.append(quest_target_name)
    rng.shuffle(quest_targets)
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        if 'Enemy Drop' not in quests['Sources'][quest_source_name].get('Tags', {}):
            continue
        quest_target = quest_targets.pop()
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target

def replace_special_items(quests, seed):
    rng = random.Random(seed)
    pools = {}
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        source_tags = set(quests['Sources'][quest_source_name].get('Tags', {}))
        if 'Special' not in source_tags:
            continue
        pool_name = quests['Sources'][quest_source_name].get('Pool', 'Global')
        if pool_name not in pools:
            pools[pool_name] = set()
        for quest_target_name in list(sorted(quests.get('Targets', {}))):
            target_tags = set(quests['Targets'][quest_target_name].get('Tags', {}))
            if 'Required' in target_tags:
                continue
            if len(source_tags.intersection(target_tags)) > 0:
                if quest_target_name in pools[pool_name]:
                    continue
                pools[pool_name].add(quest_target_name)
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        source_tags = set(quests['Sources'][quest_source_name].get('Tags', {}))
        if 'Special' not in source_tags:
            continue
        pool_name = quests['Sources'][quest_source_name].get('Pool', 'Global')
        quest_target_name = rng.choice(list(sorted(pools[pool_name])))
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target_name
        pools[pool_name].remove(quest_target_name)

def main(quests, initial_seed, quest_settings):
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    rng = {
        'Local': random.Random(initial_seed)
    }
    seeds = []
    # NOTE(sestren): Generate a bunch of seeds at once for RNG-consistency
    for _ in range(256):
        seed = rng['Local'].randint(MIN_SEED, MAX_SEED)
        seeds.append(seed)
    rng['Relics'] = seeds[0]
    rng['Found Items'] = seeds[1]
    rng['Enemy Drops'] = seeds[2]
    rng['Special Items'] = seeds[3]
    # Shuffle quest rewards (such as Relics)
    quest_rewards = None
    quest_reward_ind = False
    if quest_settings.get('Shuffle relics', False):
        relic_pool = quest_settings.get('Relic pool', 'Vanilla')
        shuffle_relics_and_required_items(quests, rng['Relics'], relic_pool)
        quest_reward_ind = True
    if quest_settings.get('Shuffle items', False):
        item_pool = quest_settings.get('Item pool', 'Vanilla')
        shuffle_items(quests, rng['Found Items'], item_pool)
        quest_reward_ind = True
    if quest_settings.get('Shuffle enemy drops', False):
        enemy_drop_pool = quest_settings.get('Enemy drop pool', 'Vanilla')
        shuffle_enemy_drops(quests, rng['Enemy Drops'], enemy_drop_pool)
        quest_reward_ind = True
    if quest_settings.get('Shuffle special items', False):
        special_item_pool = quest_settings.get('Special item pool', 'Vanilla')
        replace_special_items(quests, rng['Special Items'], special_item_pool)
        quest_reward_ind = True
    if quest_reward_ind:
        quest_rewards = {}
        for (quest_name, quest) in quests['Sources'].items():
            quest_rewards[quest_name] = quest['Target Reward']
    result = quest_rewards
    return result

if __name__ == '__main__':
    '''
    Usage
    python shuffle_quests.py
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    quest_settings = {
        'Enemy drop pool': 'Vanilla',
        'Item pool': 'Vanilla',
        'Special item pool': 'Vanilla',
        'Relic pool': 'Skill Expression',
        'Shuffle enemy drops': False,
        'Shuffle items': False,
        'Shuffle special items': False,
        'Shuffle relics': True,
    }
    parser = argparse.ArgumentParser()
    parser.add_argument('quests', help='Input a filepath to the quests YAML file', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    args = parser.parse_args()
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    global_rng = random.Random(initial_seed)
    seed = global_rng.randint(MIN_SEED, MAX_SEED)
    with (
        open(args.quests) as quests_file,
    ):
        quests = yaml.safe_load(quests_file)
    shuffled_quests = main(quests, initial_seed, quest_settings)