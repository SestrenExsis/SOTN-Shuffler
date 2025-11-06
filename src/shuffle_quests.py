# External libraries
import argparse
import copy
import random
import yaml

def populate_pool(quests, pools, initial_seed, step):
    rng = random.Random(initial_seed)
    pool_name = step['Name']
    if pool_name not in pools:
        pools[pool_name] = []
    if 'List' in step:
        for quest_target_name in step['List']:
            pools[pool_name].append(quest_target_name)
    elif 'Match' in step:
        for quest_target_name in list(sorted(quests.get('Targets', {}))):
            match_ind = True
            for rule_name in step.get('Match', {}):
                tags = set(quests['Targets'][quest_target_name].get('Tags', {}))
                rule_data = step['Match'][rule_name]
                if rule_name == 'Targets - Tags (All)':
                    if len(tags & set(rule_data)) == len(set(rule_data)):
                        pass
                    else:
                        match_ind = False
                        break
                elif rule_name == 'Targets - Tags (Any)':
                    if len(tags & set(rule_data)) > 0:
                        pass
                    else:
                        match_ind = False
                        break
                elif rule_name == 'Targets - Tags (None)':
                    if len(tags & set(rule_data)) < 1:
                        pass
                    else:
                        match_ind = False
                        break
                elif rule_name == 'Targets - Names':
                    if quest_target_name in set(rule_data):
                        pass
                    else:
                        match_ind = False
                        break
                else:
                    raise Exception(f'Invalid rule: {rule_name}')
            if match_ind:
                pools[pool_name].append(quest_target_name)

def remap_quest_rewards(quests, pools, initial_seed, step):
    rng = random.Random(initial_seed)
    pool_name = step['Selection']['Pool']
    method = step['Selection']['Method']
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        source_tags = set(quests['Sources'].get(quest_source_name, {}).get('Tags', {}))
        quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
        match_ind = True
        for rule_name in step.get('Match', {}):
            target_tags = set(quests['Targets'].get(quest_target_name, {}).get('Tags', {}))
            rule_data = step['Match'][rule_name]
            if rule_name == 'Sources - Tags (All)':
                if len(source_tags & set(rule_data)) == len(set(rule_data)):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Tags (Any)':
                if len(source_tags & set(rule_data)) > 0:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Tags (None)':
                if len(source_tags & set(rule_data)) < 1:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Names':
                if quest_source_name in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Target Reward':
                if quests['Sources'][quest_source_name]['Target Reward'] in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (All)':
                if len(target_tags & set(rule_data)) == len(set(rule_data)):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (Any)':
                if len(target_tags & set(rule_data)) > 0:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (None)':
                if len(target_tags & set(rule_data)) < 1:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Names':
                if quest_target_name in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            else:
                raise Exception(f'Invalid rule: {rule_name}')
        if not match_ind:
            continue
        # NOTE(sestren): Pools are automatically shuffled after they are modified during a 'Populate Pool' step
        if method == 'Random With Repetition':
            quest_target_name = pools[pool_name][-1]
        elif method == 'Random With Replacement':
            quest_target_name = rng.choice(pools[pool_name])
        elif method == 'Random Without Replacement':
            quest_target_name = pools[pool_name].pop()
        else:
            raise Exception(f'Invalid method: {method}')
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target_name

def shuffle_quest_rewards(quests, initial_seed, step):
    rng = random.Random(initial_seed)
    quest_source_names = []
    quest_target_names = []
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        source_tags = set(quests['Sources'].get(quest_source_name, {}).get('Tags', {}))
        match_ind = True
        for rule_name in step.get('Match', {}):
            target_tags = set(quests['Sources'][quest_source_name].get('Tags', {}))
            rule_data = step['Match'][rule_name]
            if rule_name == 'Sources - Tags (All)':
                if len(source_tags & set(rule_data)) == len(set(rule_data)):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Tags (Any)':
                if len(source_tags & set(rule_data)) > 0:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Tags (None)':
                if len(source_tags & set(rule_data)) < 1:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Names':
                if quest_source_name in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Sources - Target Reward':
                if quests['Sources'][quest_source_name]['Target Reward'] in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (All)':
                if len(target_tags & set(rule_data)) == len(set(rule_data)):
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (Any)':
                if len(target_tags & set(rule_data)) > 0:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Tags (None)':
                if len(target_tags & set(rule_data)) < 1:
                    pass
                else:
                    match_ind = False
                    break
            elif rule_name == 'Targets - Names':
                if quest_target_name in set(rule_data):
                    pass
                else:
                    match_ind = False
                    break
            else:
                raise Exception(f'Invalid rule: {rule_name}')
        if not match_ind:
            continue
        quest_source_names.append(quest_source_name)
        quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
        quest_target_names.append(quest_target_name)
    # Validate that rewards are not shuffled into quests they are invalid for based on their type
    valid_ind = False
    while not valid_ind:
        valid_ind = True
        rng.shuffle(quest_target_names)
        for (index, quest_source_name) in enumerate(quest_source_names):
            quest_target_name = quest_target_names[index]
            quest_target_type = quest_target_name.split(' - ')[0]
            if quest_target_type not in quests['Sources'][quest_source_name].get('Tags', []):
                valid_ind = False
                break
    for (index, quest_source_name) in enumerate(quest_source_names):
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target_names[index]

def process_operations(initial_quests, initial_seed, operations):
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    quests = copy.deepcopy(initial_quests)
    quest_rewards = {}
    pools = {}
    rng = random.Random(initial_seed)
    seeds = []
    # NOTE(sestren): Generate a bunch of seeds at once for RNG-consistency
    for _ in range(256):
        seed = rng.randint(MIN_SEED, MAX_SEED)
        seeds.append(seed)
    for (operation_id, operation) in enumerate(operations):
        operation_seed = seeds[operation_id]
        operation_rng = random.Random(operation_seed)
        for step in operation['Steps']:
            step_seed = operation_rng.randint(MIN_SEED, MAX_SEED)
            if step['Action'] == 'Populate Pool':
                populate_pool(quests, pools, step_seed, step)
                pool_name = step['Name']
                operation_rng.shuffle(pools[pool_name])
            elif step['Action'] == 'Remap Quest Rewards':
                remap_quest_rewards(quests, pools, step_seed, step)
            elif step['Action'] == 'Shuffle Quest Rewards':
                shuffle_quest_rewards(quests, step_seed, step)
            else:
                raise Exception(f'Invalid step type: {step['Action']}')
    for (quest_source_name, quest_source) in quests['Sources'].items():
        quest_rewards[quest_source_name] = quest_source['Target Reward']
    result = quest_rewards
    return result

if __name__ == '__main__':
    '''
    Usage
    python shuffle_quests.py
    '''
    MIN_SEED = 0
    MAX_SEED = 2 ** 64 - 1
    parser = argparse.ArgumentParser()
    parser.add_argument('quests', help='Input a filepath to the quests YAML file', type=str)
    parser.add_argument('settings', help='Input a filepath to the settings YAML file', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    args = parser.parse_args()
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(MIN_SEED, MAX_SEED))
    with (
        open(args.quests) as quests_file,
        open(args.settings) as settings_file,
    ):
        quests = yaml.safe_load(quests_file)
        settings = yaml.safe_load(settings_file)
    process_operations(quests, initial_seed, settings['Quest reward shuffler'])
    reward_tracker = {}
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        quest_target_name = quests['Sources'][quest_source_name]['Target Reward']
        if quest_target_name not in reward_tracker:
            reward_tracker[quest_target_name] = []
        reward_tracker[quest_target_name].append(quest_source_name)
    for quest_target_name in sorted(reward_tracker):
        print((quest_target_name, ':', len(reward_tracker[quest_target_name])))