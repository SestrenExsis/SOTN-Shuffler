# External libraries
import argparse
import datetime
import hashlib
import json
import os
import random
import yaml

# Local libraries
import mapper
import normalizer
import shuffle_spike_room
import validator

def get_room_drawing(mapper_core, room_name) -> list[str]:
    room = mapper_core['Rooms'][room_name]
    char = '1'
    if room_name.startswith('Warp Room '):
        char = '5'
    elif 'Save Room' in room_name:
        char = '4'
    elif 'Loading Room' in room_name:
        char = 'd'
    elif 'FAKE ROOM WITH TELEPORTER' in room_name.upper():
        char = ' '
    grid = [[' ' for col in range(1 + 4 * room['Columns'])] for row in range(1 + 4 * room['Rows'])]
    for row in range(room['Rows']):
        row_span = 4 if row < (room['Rows'] - 1) else 3
        for col in range(room['Columns']):
            if (row, col) in room['Empty Cells']:
                continue
            col_span = 4 if col < (room['Columns'] - 1) else 3
            for r in range(row_span):
                for c in range(col_span):
                    grid[1 + 4 * row + r][1 + 4 * col + c] = char
    for node in room['Nodes'].values():
        row = 2 + 4 * node['Row']
        col = 2 + 4 * node['Column']
        if node['Edge'] == 'Top':
            row -= 2
        elif node['Edge'] == 'Left':
            col -= 2
        elif node['Edge'] == 'Bottom':
            row += 2
        elif node['Edge'] == 'Right':
            col += 2
        grid[row][col] = '1'
    result = []
    for row in range(len(grid)):
        result.append(''.join(grid[row]))
    return result

rules = {}

skills = {
    "Technique - Pixel-Perfect Diagonal Gravity Jump Through Narrow Gap": True,
}

# NOTE(sestren): There is only one boss teleporter in the game data for the following bosses,
# NOTE(sestren): despite there being multiple entrances, so not all entrances will be covered:
# NOTE(sestren): Granfaloon, Akmodan II, Olrox, Galamoth
# Ideally, there would need to be 4 addtional boss teleporter entries added to the list to cover all entrances
# Since each boss teleporter takes up 20 bytes, that is a total of 80 bytes that would have to be found or taken from somewhere else
boss_teleporters = {
    '0': ('Marble Gallery', 'Marble Gallery, Clock Room', 0, 0), # Cutscene - Meeting Maria in Clock Room
    # 1 -> Nightmare
    # 2 -> Nightmare
    '3': ('Olrox\'s Quarters', 'Olrox\'s Quarters, Olrox\'s Room', 0, 1), # Boss - Olrox
    '4': ('Catacombs', 'Catacombs, Granfaloon\'s Lair', 0, 1), # Boss - Granfaloon
    '5': ('Colosseum', 'Colosseum, Arena', 0, 0), # Boss - Minotaur and Werewolf
    '6': ('Colosseum', 'Colosseum, Arena', 0, 1), # Boss - Minotaur and Werewolf
    '7': ('Underground Caverns', 'Underground Caverns, Scylla Wyrm Room', 0, 0), # Boss - Scylla
    '8': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 0), # Boss - Doppelganger 10
    '9': ('Outer Wall', 'Outer Wall, Doppelganger Room', 0, 1), # Boss - Doppelganger 10
    '10': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 0), # Boss - Hippogryph
    '11': ('Royal Chapel', 'Royal Chapel, Hippogryph Room', 0, 1), # Boss - Hippogryph
    '12': ('Castle Keep', 'Castle Keep, Keep Area', 3, 3), # Boss - Richter
    '13': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 0), # Boss - Cerberus
    '14': ('Abandoned Mine', 'Abandoned Mine, Cerberus Room', 0, 1), # Boss - Cerberus
    '15': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 0), # Boss - Trio
    '16': ('Reverse Colosseum', 'Reverse Colosseum, Arena', 0, 1), # Boss - Trio
    '17': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 0, 0), # Boss - Beelzebub
    '18': ('Necromancy Laboratory', 'Necromancy Laboratory, Slogra and Gaibon Room', 1, 3), # Boss - Beelzebub
    '19': ('Cave', 'Cave, Cerberus Room', 0, 1), # Boss - Death
    '20': ('Cave', 'Cave, Cerberus Room', 0, 0), # Boss - Death
    '21': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 1), # Boss - Medusa
    '22': ('Anti-Chapel', 'Anti-Chapel, Hippogryph Room', 0, 0), # Boss - Medusa
    '23': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 1), # Boss - Creature
    '24': ('Reverse Outer Wall', 'Reverse Outer Wall, Doppelganger Room', 0, 0), # Boss - Creature
    '25': ('Reverse Caverns', 'Reverse Caverns, Scylla Wyrm Room', 0, 0), # Boss - Doppelganger 40
    '26': ('Death Wing\'s Lair', 'Death Wing\'s Lair, Olrox\'s Room', 1, 0), # Boss - Akmodan II
    '27': ('Floating Catacombs', 'Floating Catacombs, Granfaloon\'s Lair', 1, 0), # Boss - Galamoth
}

# Shuffle connections between stages
def shuffle_teleporters(teleporters, seed: int) -> dict:
    rng = random.Random(seed)
    # print('Shuffle teleporters')
    MAX_LAYER = 5
    exclusions = (
        'Castle Center, Fake Room with Teleporter to Marble Gallery',
        'Castle Entrance Revisited, Fake Room with Teleporter to Alchemy Laboratory',
        'Castle Entrance Revisited, Fake Room with Teleporter to Marble Gallery',
        'Castle Entrance Revisited, Fake Room with Teleporter to Warp Rooms',
        'Castle Entrance Revisited, Fake Room with Teleporter to Underground Caverns',
        'Marble Gallery, Fake Room with Teleporter to Castle Center',
        'Special, Succubus Defeated',
        'Underground Caverns, Fake Room with Teleporter to Boss - Succubus',
    )
    layers = {
        'Alchemy Laboratory': 0,
        'Castle Entrance': 0,
        'Castle Keep': 0,
        'Colosseum': 0,
        'Long Library': 0,
        'Outer Wall': 0,
        'Warp Rooms': 0,
        'Abandoned Mine': 1,
        'Marble Gallery': 1,
        'Royal Chapel': 1,
        'Underground Caverns': 1,
        'Catacombs': 2,
        'Clock Tower': 2,
        'Olrox\'s Quarters': 2,
    }
    connections = set()
    while True:
        sources = {}
        targets = {}
        for (source_key, source) in teleporters['Sources'].items():
            if source_key in exclusions:
                continue
            source_stage = source['Stage']
            target_key = source['Target']
            target_stage = teleporters['Targets'][target_key]['Stage']
            source_direction = 'Right'
            target_direction = 'Left'
            if 'Right Red Door' in target_key:
                source_direction = 'Left'
                target_direction = 'Right'
            sources[source_key] = {
                'Stage': source_stage,
                'Direction': source_direction,
            }
            targets[target_key] = {
                'Stage': target_stage,
                'Direction': target_direction,
            }
        current_layer = 0
        stages = {}
        connections = set()
        work = set()
        work.add('Castle Entrance, Fake Room with Teleporter to Alchemy Laboratory')
        while len(work) > 0:
            possible_choices = set(work)
            for choice in work:
                choice_stage = choice.split(', ')[0]
                if layers[choice_stage] > current_layer:
                    possible_choices.remove(choice)
            if len(possible_choices) < 1:
                current_layer += 1
                if current_layer > MAX_LAYER:
                    break
                else:
                    pass
                continue
            source_a_key = rng.choice(list(sorted(possible_choices)))
            work.remove(source_a_key)
            source_a = sources[source_a_key]
            if source_a['Stage'] not in stages:
                stages[source_a['Stage']] = set()
            source_b_candidates = set()
            for (candidate_source_b_key, candidate_source_b) in sources.items():
                if source_a_key == 'Castle Entrance, Fake Room with Teleporter to Alchemy Laboratory':
                    if candidate_source_b_key == 'Warp Rooms, Fake Room with Teleporter to Castle Entrance':
                        # First stage connection in the game is not allowed to connect to the root Warp Room
                        continue
                if candidate_source_b['Stage'] == source_a['Stage']:
                    # A stage may not connect to itself
                    continue
                if candidate_source_b['Direction'] == source_a['Direction']:
                    # A Left Passage must connect to a Right Passage, and vice versa
                    continue
                if candidate_source_b['Stage'] in stages[source_a['Stage']]:
                    # A stage may not connect to the same stage more than once
                    continue
                candidate_stage = candidate_source_b_key.split(', ')[0]
                if layers[candidate_stage] > current_layer:
                    # A stage may not connect to a stage beyond the current layer
                    continue
                source_b_candidates.add(candidate_source_b_key)
            if len(source_b_candidates) < 1:
                current_layer += 1
                if current_layer > MAX_LAYER:
                    break
                continue
            source_b_key = rng.choice(list(sorted(source_b_candidates)))
            source_b = sources[source_b_key]
            if source_b['Stage'] not in stages:
                stages[source_b['Stage']] = set()
            stages[source_a['Stage']].add(source_b['Stage'])
            stages[source_b['Stage']].add(source_a['Stage'])
            sources.pop(source_a_key)
            sources.pop(source_b_key)
            if source_b_key in work:
                work.remove(source_b_key)
            connections.add((source_a_key, source_b_key))
            connections.add((source_b_key, source_a_key))
            for (next_source_key, next_source) in sources.items():
                if next_source['Stage'] in source_b['Stage']:
                    work.add(next_source_key)
        if len(sources) < 1:
            break
    for (source_a_key, source_b_key) in connections:
        teleporters['Sources'][source_a_key]['Target'] = teleporters['Sources'][source_b_key]['Return']
        teleporters['Sources'][source_b_key]['Target'] = teleporters['Sources'][source_a_key]['Return']
        if source_a_key.startswith('Castle Entrance, '):
            alt_source_key = 'Castle Entrance Revisited' + source_a_key[len('Castle Entrance'):]
            teleporters['Sources'][alt_source_key]['Target'] = teleporters['Sources'][source_b_key]['Return']
        if source_b_key.startswith('Castle Entrance, '):
            alt_source_key = 'Castle Entrance Revisited' + source_b_key[len('Castle Entrance'):]
            teleporters['Sources'][alt_source_key]['Target'] = teleporters['Sources'][source_a_key]['Return']

def shuffle_quests(quests, seed):
    rng = random.Random(seed)
    quest_targets = []
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        quest_target = quests['Sources'][quest_source_name]['Target Reward']
        quest_targets.append(quest_target)
    rng.shuffle(quest_targets)
    for quest_source_name in list(sorted(quests.get('Sources', {}))):
        quest_target = quest_targets.pop()
        quests['Sources'][quest_source_name]['Target Reward'] = quest_target

def draw_labels_on_castle_map(castle_map, instructions):
    # CDHIJKLNOSTUVXYZ147+-|#
    labels = {
        'C': ('###', '#  ', '###'),
        'D': ('## ', '# #', '## '),
        'H': ('# #', '###', '# #'),
        'I': ('###', ' # ', '###'),
        'J': ('###', ' # ', '## '),
        'K': ('# #', '## ', '# #'),
        'L': ('#  ', '#  ', '###'),
        'N': ('###', '# #', '# #'),
        'O': ('###', '# #', '###'),
        'S': (' ##', ' # ', '## '),
        'T': ('###', ' # ', ' # '),
        'U': ('# #', '# #', '###'),
        'V': ('# #', '# #', ' # '),
        'X': ('# #', ' # ', '# #'),
        'Y': ('# #', ' # ', ' # '),
        'Z': ('## ', ' # ', ' ##'),
        '1': (' # ', ' # ', ' # '),
        '4': ('# #', '###', '  #'),
        '7': ('###', '  #', '  #'),
        '+': (' # ', '###', ' # '),
        '-': ('   ', '###', '   '),
        '|': (' # ', ' # ', ' # '),
        '#': ('###', '###', '###'),
    }
    for (label, map_row, map_col, label_color, bg_color) in instructions:
        top = 4 * map_row + 1
        left = 4 * map_col + 1
        for (row, row_data) in enumerate(labels[label]):
            for (col, char) in enumerate(row_data):
                color = label_color
                if char == ' ':
                    color = bg_color
                castle_map[top + row][left + col] = str(color)

def get_loading_room_labels_by_connection(mapper_core, stages, stage_names):
    instructions = []
    links = {}
    for (index, stage_name) in enumerate(stage_names):
        if stage_name.startswith('Warp Rooms, '):
            continue
        stage = stages[stage_name]
        stage_changes = stage['Mapper'].stage.get_changes()
        for room_name in list(sorted(stage_changes['Rooms'])):
            if 'Loading Room' not in room_name:
                continue
            fake_room_name = stage_name + ', Fake Room with Teleporter to ' + room_name[room_name.find('Loading Room to ') + len('Loading Room to '):]
            return_name = mapper_core['Teleporters']['Sources'][fake_room_name]['Return']
            for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                if source_room['Target'] != return_name:
                    continue
                source_room_stage = source_room['Stage']
                if source_room_stage == 'Warp Rooms':
                    continue
                # if source_room_name in changes['Stages'][source_room_stage]['Rooms']:
                #     source_room = changes['Stages'][source_room_stage]['Rooms'][source_room_name]
                # TODO(sestren): Figure out why this throws KeyErrors on 'Castle Entrance Revisited, Fake Room with Teleporter to Underground Caverns'
                source_loading_room = source_room_name.replace('Fake Room with Teleporter', 'Loading Room').replace('Castle Entrance Revisited', 'Castle Entrance')
                code = 'CDHIJKLNOSTUVXYZ147+-|###'[len(links)]
                rooms = tuple(sorted((room_name, source_loading_room)))
                if rooms in links:
                    continue
                room_a = changes['Stages'][stage_name]['Rooms'][room_name]
                room_b = changes['Stages'][source_room_stage]['Rooms'][source_loading_room]
                for room_pos in (
                    room_a,
                    room_b,
                ):
                    instructions.append((code, room_pos['Top'], room_pos['Left'], 'C', 'E'))
                links[rooms] = code
                break
    result = instructions
    return result

def get_loading_room_labels_by_stage(mapper_core, stages, stage_names):
    stage_codes = {
        'Abandoned Mine': 'D',
        'Alchemy Laboratory': 'Y',
        'Castle Center': '+',
        'Castle Entrance': 'N',
        'Castle Entrance Revisited': 'N',
        'Castle Keep': 'K',
        'Catacombs': 'C',
        'Clock Tower': 'T',
        'Colosseum': 'S',
        'Long Library': 'L',
        'Marble Gallery': 'V',
        "Olrox's Quarters": 'X',
        'Outer Wall': 'O',
        'Royal Chapel': 'H',
        'Underground Caverns': 'U',
    }
    instructions = []
    for (index, stage_name) in enumerate(stage_names):
        if stage_name.startswith('Warp Rooms, '):
            continue
        stage = stages[stage_name]
        stage_changes = stage['Mapper'].stage.get_changes()
        for room_name in list(sorted(stage_changes['Rooms'])):
            if 'Loading Room' not in room_name:
                continue
            fake_room_name = stage_name + ', Fake Room with Teleporter to ' + room_name[room_name.find('Loading Room to ') + len('Loading Room to '):]
            return_name = mapper_core['Teleporters']['Sources'][fake_room_name]['Return']
            for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                if source_room['Target'] != return_name:
                    continue
                source_room_stage = source_room['Stage']
                if source_room_stage in ('Castle Center', 'Warp Rooms') or stage_name in ('Castle Center', 'Warp Rooms'):
                    continue
                source_loading_room = source_room_name.replace('Fake Room with Teleporter', 'Loading Room').replace('Castle Entrance Revisited', 'Castle Entrance')
                room_pos = changes['Stages'][source_room_stage]['Rooms'][source_loading_room]
                code = stage_codes.get(stage_name, '#')
                instructions.append((code, room_pos['Top'], room_pos['Left'], 'C', 'E'))
                break
    result = instructions
    return result

if __name__ == '__main__':
    '''
    Usage
    python shuffler.py SETTINGS STAGE_VALIDATIONS --seed SEED
    '''
    parser = argparse.ArgumentParser()
    parser.add_argument('settings', help='Input a filepath to the shuffler settings YAML file', type=str)
    parser.add_argument('stage_validations', help='Input a filepath to the stage validations YAML file', type=str)
    parser.add_argument('--seed', help='Input an optional starting seed', type=str)
    parser.add_argument('--output', help='Input an optional filename for the output JSON', type=str)
    parser.add_argument('--no-metadata', help='Remove all metadata from the output JSON', dest='metadata', action='store_false')
    settings = {}
    stage_validations = {}
    validation_results = {}
    validation_results_filepath = os.path.join('build', 'shuffler', 'validation_results.json')
    args = parser.parse_args()
    with (
        open(args.settings) as settings_file,
        open(args.stage_validations) as stage_validations_file,
        open(validation_results_filepath) as validation_results_json,
    ):
        settings = yaml.safe_load(settings_file)
        stage_validations = yaml.safe_load(stage_validations_file)
        validation_results = json.load(validation_results_json)
    MIN_MAP_ROW = 5
    MAX_MAP_ROW = 55
    MIN_MAP_COL = 0
    MAX_MAP_COL = 63
    initial_seed = args.seed
    if initial_seed is None:
        initial_seed = str(random.randint(0, 2 ** 64))
    # Keep randomizing until a solution is found
    global_rng = random.Random(initial_seed)
    shuffler = {
        'Initial Seed': initial_seed,
        'Settings': settings,
        'Start Time': datetime.datetime.now(datetime.timezone.utc),
        'Stages': {},
    }
    # Some settings are Shuffler-specific, while the rest get passed down to the Patcher as options
    options = {}
    for (option_key, option_value) in settings['Options'].items():
        if option_key in (
            'Assign Power of Wolf relic a unique ID',
            'Clock hands show minutes and seconds instead of hours and minutes',
            'Disable clipping on screen edge of Demon Switch Wall',
            'Enable debug mode',
            'Shuffle Pitch Black Spike Maze',
            'Skip Maria cutscene in Alchemy Laboratory',
        ):
            options[option_key] = option_value
    invalid_stage_files = set()
    while True:
        print('...')
        shuffler['Stages'] = {}
        # Randomize
        stages = {
            'Abandoned Mine': {},
            'Alchemy Laboratory': {},
            'Castle Center': {},
            'Castle Keep': {},
            'Castle Entrance': {},
            'Catacombs': {},
            'Clock Tower': {},
            'Colosseum': {},
            'Long Library': {},
            'Marble Gallery': {},
            'Olrox\'s Quarters': {},
            'Outer Wall': {},
            'Royal Chapel': {},
            'Underground Caverns': {},
            'Warp Rooms': {},
        }
        mapper_core = mapper.MapperData().get_core()
        # Calculate teleporter changes
        teleporters = {}
        # Generate the seed regardless, so RNG can be independent of the setting
        stage_randomizer_seed = global_rng.randint(0, 2 ** 64)
        if settings.get('Stage shuffler', {}).get('Shuffle connections between stages', False):
            shuffle_teleporters(mapper_core['Teleporters'], stage_randomizer_seed)
            for (source_name, source) in mapper_core['Teleporters']['Sources'].items():
                if source_name in (
                    'Castle Center, Fake Room with Teleporter to Marble Gallery',
                    'Marble Gallery, Fake Room with Teleporter to Castle Center',
                    'Special, Succubus Defeated',
                    'Underground Caverns, Fake Room with Teleporter to Boss - Succubus',
                ):
                    continue
                target_name = source['Target']
                target = mapper_core['Teleporters']['Targets'][target_name]
                teleporters[source['Index']] = {
                    'Player X': target['Player X'],
                    'Player Y': target['Player Y'],
                    'Room': target['Stage'] + ', ' + target['Room'],
                    'Stage': target['Stage'],
                }
        # Shuffle quest rewards (such as Relics)
        quest_randomizer_seed = global_rng.randint(0, 2 ** 64)
        object_layouts = None
        if settings.get('Quest shuffler', {}).get('Shuffle quest rewards', False):
            shuffle_quests(mapper_core['Quests'], quest_randomizer_seed)
            object_layouts = {}
            for (quest_name, quest) in mapper_core['Quests']['Sources'].items():
                target_name = quest['Target Reward']
                object_layouts[quest_name] = quest['Target Reward']
        # print('Set starting seeds for each stage')
        for stage_name in sorted(stages.keys()):
            next_seed = global_rng.randint(0, 2 ** 64)
            stages[stage_name]['Initial Seed'] = next_seed
            stages[stage_name]['RNG'] = random.Random(stages[stage_name]['Initial Seed'])
            # print('', stage_name, stages[stage_name]['Initial Seed'])
        # print('Randomize stages with starting seeds')
        for stage_name in sorted(stages.keys()):
            directory_listing = os.listdir(os.path.join('build', 'shuffler', stage_name))
            file_listing = list(
                name for name in directory_listing if
                name.endswith('.json') and
                (stage_name, name[:-len('.json')]) not in invalid_stage_files
            )
            # print('', stage_name, len(file_listing), stages[stage_name]['Initial Seed'])
            assert len(file_listing) > 0
            # Keep randomly choosing a shuffled stage until one that passes all its validation checks is found
            # TODO(sestren): Allow validation of secondary stages like Castle Entrance Revisited or Reverse Keep
            max_unique_pass_count = 0
            while True:
                all_valid_ind = True
                chosen_file_name = stages[stage_name]['RNG'].choice(list(sorted(file_listing)))
                with open(os.path.join('build', 'shuffler', stage_name, chosen_file_name)) as mapper_data_json:
                    mapper_data = json.load(mapper_data_json)
                    mapper_data_json.close()
                stages[stage_name]['Mapper'] = mapper.Mapper(mapper_core, stage_name, mapper_data['Seed'])
                stages[stage_name]['Mapper'].generate()
                stages[stage_name]['Mapper'].stage.normalize()
                stage_changes = stages[stage_name]['Mapper'].stage.get_changes()
                assert stages[stage_name]['Mapper'].validate()
                hash_of_rooms = hashlib.sha256(json.dumps(stage_changes['Rooms'], sort_keys=True).encode()).hexdigest()
                assert hash_of_rooms == mapper_data['Hash of Rooms']
                # print(' ', 'hash:', hash_of_rooms, stage_name, len(file_listing), len(list(b for (a, b) in invalid_stage_files if a == stage_name)), max_unique_pass_count)
                changes = {
                    'Options': options,
                    'Stages': {
                        stage_name: stage_changes,
                    },
                }
                unique_passes = set()
                for (validation_name, validation) in stage_validations[stage_name].items():
                    if validation_name.startswith('SKIP '):
                        continue
                    logic_core = mapper.LogicCore(mapper_core, changes).get_core()
                    for (state_key, state_value) in validation['State'].items():
                        logic_core['State'][state_key] = state_value
                    logic_core['Goals'] = validation['Goals']
                    # Validate
                    cached_ind = True
                    if stage_name not in validation_results:
                        validation_results[stage_name] = {}
                        cached_ind = False
                    if hash_of_rooms not in validation_results[stage_name]:
                        validation_results[stage_name][hash_of_rooms] = {}
                        cached_ind = False
                    hash_of_validation = hashlib.sha256(
                        json.dumps(validation, sort_keys=True).encode()
                    ).hexdigest()
                    if hash_of_validation not in validation_results[stage_name][hash_of_rooms]:
                        cached_ind = False
                    validation_result = True
                    if not cached_ind:
                        validation_results[stage_name][hash_of_rooms][hash_of_validation] = validator.validate_stage(
                            mapper_core,
                            mapper_data,
                            stage_name,
                            validation
                        )
                    validation_result = validation_results[stage_name][hash_of_rooms][hash_of_validation]
                    if validation_result:
                        # print('   ', '✅ ...', validation_name)
                        unique_passes.add(validation_name)
                        max_unique_pass_count = max(max_unique_pass_count, len(unique_passes))
                    else:
                        # print('   ', '❌ ...', validation_name)
                        all_valid_ind = False
                        break
                if all_valid_ind:
                    break
                else:
                    invalid_stage_files.add((stage_name, chosen_file_name[:-len('.json')]))
            shuffler['Stages'][stage_name] = {
                'Note': 'Prebaked',
                'Attempts': stages[stage_name]['Mapper'].attempts,
                'Generation Start Date': stages[stage_name]['Mapper'].start_time.isoformat(),
                'Generation End Date': stages[stage_name]['Mapper'].end_time.isoformat(),
                # 'Generation Version': GENERATION_VERSION,
                'Hash of Rooms': hashlib.sha256(json.dumps(stage_changes['Rooms'], sort_keys=True).encode()).hexdigest(),
                'Seed': stages[stage_name]['Mapper'].current_seed,
                'Stage': stage_name,
            }
        # Randomly place down stages one at a time
        stage_names = list(sorted(stages.keys() - {'Warp Rooms', 'Castle Center'}))
        global_rng.shuffle(stage_names)
        stage_names.insert(stage_names.index('Marble Gallery') + 1, 'Castle Center')
        valid_ind = False
        for (index, stage_name) in enumerate(stage_names):
            current_stage = stages[stage_name]['Mapper'].stage
            prev_cells = set()
            for prev_stage_name in stage_names[:index]:
                cells = stages[prev_stage_name]['Mapper'].stage.get_cells(
                    stages[prev_stage_name]['Stage Top'],
                    stages[prev_stage_name]['Stage Left'],
                    True
                )
                prev_cells = prev_cells.union(cells)
            (top, left, bottom, right) = current_stage.get_bounds()
            best_area = float('inf')
            best_stage_offsets = []
            (min_map_row, max_map_row) = (MIN_MAP_ROW, MAX_MAP_ROW - bottom)
            (min_map_col, max_map_col) = (MIN_MAP_COL, MAX_MAP_COL - right)
            if stage_name == 'Castle Entrance':
                # Castle Entrance is being restricted by where 'Unknown Room 20' and 'After Drawbridge' can be
                min_map_row = 38 - current_stage.rooms['Castle Entrance, After Drawbridge'].top
                max_map_row = min_map_row + 1
                min_map_col = max(min_map_col, 1 - current_stage.rooms['Castle Entrance, Unknown Room 20'].left)
            elif stage_name == 'Castle Center':
                # Castle Center is being forced to join with Marble Gallery via the Elevator Room
                min_map_row = stages['Marble Gallery']['Stage Top'] + stages['Marble Gallery']['Mapper'].stage.rooms['Marble Gallery, Elevator Room'].top
                max_map_row = min_map_row + 1
                min_map_col = stages['Marble Gallery']['Stage Left'] + stages['Marble Gallery']['Mapper'].stage.rooms['Marble Gallery, Elevator Room'].left - 1
                max_map_col = min_map_col + 1
            for stage_top in range(min_map_row, max_map_row):
                for stage_left in range(min_map_col, max_map_col):
                    # Reject if it overlaps another stage
                    current_cells = current_stage.get_cells(stage_top, stage_left, True)
                    if len(current_cells.intersection(prev_cells)) > 0:
                        continue
                    all_cells = current_cells.union(prev_cells)
                    min_row = min((row for (row, col) in all_cells))
                    max_row = max((row for (row, col) in all_cells))
                    min_col = min((col for (row, col) in all_cells))
                    max_col = max((col for (row, col) in all_cells))
                    area = (1 + max_row - min_row) * (1 + max_col - min_col)
                    # Keep track of whichever offset minimizes the overall area
                    if area < best_area:
                        best_stage_offsets = []
                        best_area = area
                    if area == best_area:
                        best_stage_offsets.append((stage_top, stage_left))
            if best_area >= float('inf'):
                # print('Could not find a suitable spot on the map for', stage_name)
                break
            (stage_top, stage_left) = global_rng.choice(list(sorted(best_stage_offsets)))
            # cells = current_stage.get_cells(stage_top, stage_left)
            # prev_cells.union(cells)
            (top, left, bottom, right) = current_stage.get_bounds()
            if not (
                MIN_MAP_ROW <= stage_top + top < MAX_MAP_ROW and
                MIN_MAP_ROW <= stage_top + bottom < MAX_MAP_ROW and
                MIN_MAP_COL <= stage_left + left < MAX_MAP_COL and
                MIN_MAP_COL <= stage_left + right < MAX_MAP_COL
            ):
                # print(stage_name, 'could not be placed within the bounds of the map')
                break
            current_cells = current_stage.get_cells(stage_top, stage_left, True)
            if len(current_cells.intersection(prev_cells)) > 0:
                # print(stage_name, 'could not be placed without overlapping with another stage')
                break
            stages[stage_name]['Stage Top'] = stage_top
            stages[stage_name]['Stage Left'] = stage_left
            # print('>>>', stage_name, (stage_top, stage_left))
        else:
            valid_ind = True
        if not valid_ind:
            # print('Gave up trying to find a valid arrangement of the stages; starting over from scratch')
            continue
        changes = {
            'Boss Teleporters': {},
            'Castle Map': [],
            'Options': options,
            'Stages': {},
            'Teleporters': teleporters,
        }
        if object_layouts is not None:
            changes['Object Layouts'] = object_layouts
        stages['Warp Rooms']['Stage Top'] = 0
        stages['Warp Rooms']['Stage Left'] = 0
        # Initialize the castle map drawing grid
        castle_map = [['0' for col in range(256)] for row in range(256)]
        # Process each stage, with Warp Rooms being processed last
        stage_names = list(sorted(stages.keys() - {'Warp Rooms'}))
        stage_names += ['Warp Rooms']
        overrides = {}
        for (index, stage_name) in enumerate(stage_names):
            stage = stages[stage_name]
            (stage_top, stage_left) = (stage['Stage Top'], stage['Stage Left'])
            changes['Stages'][stage_name] = {
                'Rooms': {},
            }
            stage_changes = stage['Mapper'].stage.get_changes()
            if stage_name == 'Castle Entrance':
                # NOTE(sestren): These rooms are being placed out of the way to provide more room on the map
                changes['Stages'][stage_name]['Rooms']['Castle Entrance, Forest Cutscene'] = {
                    'Top': 63,
                    'Left': 0,
                }
                changes['Stages'][stage_name]['Rooms']['Castle Entrance, Unknown Room 19'] = {
                    'Top': 63,
                    'Left': 18,
                }
                # Make a space for cloning Castle Entrance later
                changes['Stages']['Castle Entrance Revisited'] = {
                    'Rooms': {},
                }
            elif stage_name == 'Warp Rooms':
                for warp_room_name in (
                    'Castle Keep',
                    'Olrox\'s Quarters',
                    'Abandoned Mine',
                ):
                    warp__fake_room_name = 'Warp Rooms, Fake Room with Teleporter to ' + warp_room_name
                    return_name = mapper_core['Teleporters']['Sources'][warp__fake_room_name]['Return']
                    for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                        if source_room['Target'] == return_name:
                            source_room = changes['Stages'][source_room['Stage']]['Rooms'][source_room_name]
                            overrides[warp__fake_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] - 2,
                            }
                            overrides['Warp Rooms, Loading Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] - 1,
                            }
                            overrides['Warp Rooms, Warp Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'],
                            }
                            break
                for warp_room_name in (
                    'Outer Wall',
                    'Castle Entrance',
                ):
                    warp__fake_room_name = 'Warp Rooms, Fake Room with Teleporter to ' + warp_room_name
                    return_name = mapper_core['Teleporters']['Sources'][warp__fake_room_name]['Return']
                    for (source_room_name, source_room) in mapper_core['Teleporters']['Sources'].items():
                        if source_room['Target'] == return_name:
                            source_room = changes['Stages'][source_room['Stage']]['Rooms'][source_room_name]
                            overrides['Warp Rooms, Warp Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'],
                            }
                            overrides['Warp Rooms, Loading Room to ' + warp_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] + 1,
                            }
                            overrides[warp__fake_room_name] = {
                                'Top': source_room['Top'],
                                'Left': source_room['Left'] + 2,
                            }
                            break
            for room_name in stage_changes['Rooms']:
                room_top = stage_top + stage_changes['Rooms'][room_name]['Top']
                room_left = stage_left + stage_changes['Rooms'][room_name]['Left']
                if room_name in overrides:
                    room_top = overrides[room_name]['Top']
                    room_left = overrides[room_name]['Left']
                changes['Stages'][stage_name]['Rooms'][room_name] = {
                    'Top': room_top,
                    'Left': room_left,
                }
                # Draw room on castle map drawing grid
                room_drawing = None
                use_alt_map = False
                if use_alt_map and 'Alternate Map' in mapper_core['Rooms'][room_name]:
                    room_drawing = mapper_core['Rooms'][room_name]['Alternate Map']
                elif 'Map' in mapper_core['Rooms'][room_name]:
                    room_drawing = mapper_core['Rooms'][room_name]['Map']
                else:
                    room_drawing = get_room_drawing(mapper_core, room_name)
                for (room_row, row_data) in enumerate(room_drawing):
                    row = 4 * room_top + room_row
                    for (room_col, char) in enumerate(row_data):
                        col = 4 * room_left + room_col
                        if char == ' ':
                            continue
                        if (0 <= row < 256) and (0 <= col < 256):
                            castle_map[row][col] = char
                        else:
                            # print('Tried to draw pixel out of bounds of map:', room_name, (room_top, room_left), (row, col))
                            pass
        # Draw connection labels onto the loading rooms of the map
        if settings.get('Stage shuffler', {}).get('Loading room labels', 'None') != 'None':
            instructions = []
            label_method = settings['Stage shuffler']['Loading room labels']
            if label_method == 'Connection':
                instructions = get_loading_room_labels_by_connection(mapper_core, stages, stage_names)
            elif label_method == 'Stage':
                instructions = get_loading_room_labels_by_stage(mapper_core, stages, stage_names)
            draw_labels_on_castle_map(castle_map, instructions)
        spike_room_seed = global_rng.randint(0, 2 ** 64)
        if settings.get('Options', {}).get('Shuffle Pitch Black Spike Maze', False):
            changes['Stages']['Catacombs']['Rooms']['Catacombs, Pitch Black Spike Maze']['Tilemap'] = shuffle_spike_room.main(spike_room_seed)
        if settings.get('Room shuffler', {}).get('Normalize room connections', False):
            for stage_name in normalizer.stages:
                for room_name in normalizer.stages[stage_name]:
                    changes['Stages'][stage_name]['Rooms'][room_name]['Tilemap'] = normalizer.normalize(room_name)
        # Apply castle map drawing grid to changes
        changes['Castle Map'] = []
        for row in range(len(castle_map)):
            row_data = ''.join(castle_map[row])
            changes['Castle Map'].append(row_data)
        # Calculate which cells on the map buying the Castle Map in the Shop will reveal
        cells_to_reveal = set()
        for (row, row_data) in enumerate(castle_map):
            for (col, char) in enumerate(row_data):
                if char == '0':
                    continue
                cell_row = row // 4
                cell_col = col // 4
                cells_to_reveal.add((cell_row, cell_col))
        castle_map_reveal_top = min(row for (row, col) in cells_to_reveal)
        castle_map_reveal_grid = []
        for row in range(38):
            row_data = []
            for col in range(64):
                char = ' '
                if (castle_map_reveal_top + row, col) in cells_to_reveal:
                    char = '#'
                row_data.append(char)
            castle_map_reveal_grid.append(''.join(row_data))
        changes['Castle Map Reveals'] = [
            {
                'Bytes Per Row': 8,
                'Grid': castle_map_reveal_grid,
                'Left': 0,
                'Rows': 38,
                'Top': castle_map_reveal_top,
            },
        ]
        # Apply Castle Entrance room positions to Castle Entrance Revisited
        changes['Stages']['Castle Entrance Revisited'] = {
            'Rooms': {},
        }
        for room_name in changes['Stages']['Castle Entrance']['Rooms']:
            if room_name in (
                'Castle Entrance, Forest Cutscene',
                'Castle Entrance, Unknown Room 19',
                'Castle Entrance, Unknown Room 20',
            ):
                continue
            source_top = changes['Stages']['Castle Entrance']['Rooms'][room_name]['Top']
            source_left = changes['Stages']['Castle Entrance']['Rooms'][room_name]['Left']
            revisited_room_name = 'Castle Entrance Revisited, ' + room_name[len('Castle Entrance, '):]
            changes['Stages']['Castle Entrance Revisited']['Rooms'][revisited_room_name] = {
                'Top': source_top,
                'Left': source_left,
            }
        # print('*********')
        # Validate First Castle to ensure it is solvable
        if validator.validate_logic(mapper_core, changes):
            pass
        else:
            continue
        # print('*********')
        # Flip normal castle changes and apply them to inverted castle
        reversible_stages = {
            'Abandoned Mine': 'Cave',
            'Alchemy Laboratory': 'Necromancy Laboratory',
            'Castle Center': 'Reverse Castle Center',
            'Castle Entrance': 'Reverse Entrance',
            'Castle Keep': 'Reverse Keep',
            'Catacombs': 'Floating Catacombs',
            'Clock Tower': 'Reverse Clock Tower',
            'Colosseum': 'Reverse Colosseum',
            'Long Library': 'Forbidden Library',
            'Marble Gallery': 'Black Marble Gallery',
            'Olrox\'s Quarters': 'Death Wing\'s Lair',
            'Outer Wall': 'Reverse Outer Wall',
            'Royal Chapel': 'Anti-Chapel',
            'Underground Caverns': 'Reverse Caverns',
            'Warp Rooms': 'Reverse Warp Rooms',
        }
        for (stage_name, reversed_stage_name) in reversible_stages.items():
            changes['Stages'][reversed_stage_name] = {
                'Rooms': {},
            }
            for room_name in changes['Stages'][stage_name]['Rooms']:
                reversed_room_name = reversed_stage_name + ', ' + room_name[(len(stage_name + ', ')):]
                source_top = changes['Stages'][stage_name]['Rooms'][room_name]['Top']
                source_left = changes['Stages'][stage_name]['Rooms'][room_name]['Left']
                source_rows = 1
                source_cols = 1
                if room_name in mapper_core['Rooms']:
                    source_rows = mapper_core['Rooms'][room_name]['Rows']
                    source_cols = mapper_core['Rooms'][room_name]['Columns']
                else:
                    # print('room_name not found:', room_name)
                    pass
                changes['Stages'][reversed_stage_name]['Rooms'][reversed_room_name] = {
                    'Top': 63 - source_top - (source_rows - 1),
                    'Left': 63 - source_left - (source_cols - 1),
                }
        # Assign boss teleporter locations to their counterparts in the castle
        for (boss_teleporter_id, (stage_name, room_name, offset_top, offset_left)) in boss_teleporters.items():
            source_room = changes['Stages'][stage_name]['Rooms'][room_name]
            changes['Boss Teleporters'][boss_teleporter_id] = {
                'Room Y': source_room['Top'] + offset_top,
                'Room X': source_room['Left'] + offset_left,
            }
        # Show softlock warning and build number on file select screen
        changes['Strings'] = {
            '10': 'Press L2 if softlocked.     ',
            '11': 'Alpha Build 74      ',
        }
        # ...
        shuffler['End Time'] = datetime.datetime.now(datetime.timezone.utc)
        current_seed = {
            'Changes': changes,
        }
        if args.metadata:
            current_seed['Data Core'] = mapper_core
            current_seed['Shuffler'] = shuffler
            logic_core = mapper.LogicCore(mapper_core, changes).get_core()
            current_seed['Logic Core'] = logic_core
            # current_seed['Solver'] = solution
        filepath = None
        if args.output is not None:
            filepath = os.path.normpath(args.output)
        else:
            filename = ' '.join((
                shuffler['End Time'].strftime('%Y-%m-%d %H-%M-%S'),
                'SOTN Shuffler',
                changes['Strings']['11'].strip(),
                '(' + str(shuffler['Initial Seed']) + ')',
            ))
            filepath = os.path.join('build', 'shuffler', filename + '.json')
        with open(filepath, 'w') as current_seed_json:
            json.dump(current_seed, current_seed_json, indent='    ', sort_keys=True, default=str)
        # while True:
        #     winning_game.play()
        break
    with (
        open(validation_results_filepath, 'w') as validation_results_json,
    ):
        json.dump(validation_results, validation_results_json, indent='    ', sort_keys=True, default=str)
