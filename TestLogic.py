import heapq
import json

class Game:
    def __init__(self,
        logic,
        starting_location: str='Name Entry Screen',
        starting_section: str='Primary'
    ):
        self.logic = logic
        self.starting_location = starting_location
        self.starting_section = starting_section
        self.player = {
            'Location': self.starting_location,
            'Section': self.starting_section,
        }
        self.commands = []
    
    def validate(self, requirements):
        result = False
        for requirement in requirements.values():
            # All checks within a requirement list must pass
            valid_ind = True
            for key, value in requirement.items():
                target_value = None
                if key not in self.player:
                    if type(value) == str:
                        target_value = 'NONE'
                    elif type(value) == bool:
                        target_value = False
                    elif type(value) in (int, dict):
                        target_value = 0
                else:
                    target_value = self.player[key]
                if type(value) == dict:
                    if 'Minimum' in value:
                        if target_value < value['Minimum']:
                            valid_ind = False
                            break
                    if 'Maximum' in value:
                        if target_value > value['Maximum']:
                            valid_ind = False
                            break
                elif target_value != value:
                    valid_ind = False
                    break
            # Satisfying even one requirement list is sufficient
            if valid_ind:
                result = True
                break
        return result

    def process_outcomes(self, outcomes):
        for key, value in outcomes.items():
            if type(value) in (str, bool):
                if key not in self.player or self.player[key] != value:
                    print('  +', key, ': ', value)
                self.player[key] = value
            elif type(value) in (int, float):
                if key not in self.player:
                    self.player[key] = 0
                print('  +', key, ': ', value)
                self.player[key] += value

    def process_position_update(self):
        room_data = self.logic[self.player['Location']]
        if self.player['Section'] not in room_data['Node Sections']:
            return
        node = room_data['Node Sections'][self.player['Section']]
        matching_left = room_data['Left'] + node['Column']
        matching_top = room_data['Top'] + node['Row']
        matching_edge = None
        if node['Edge'] == 'Left':
            matching_left -= 1
            matching_edge = 'Right'
        elif node['Edge'] == 'Right':
            matching_left += 1
            matching_edge = 'Left'
        elif node['Edge'] == 'Top':
            matching_top -= 1
            matching_edge = 'Bottom'
        elif node['Edge'] == 'Bottom':
            matching_top += 1
            matching_edge = 'Top'
        possible_locations = []
        for (location_name, location_data) in self.logic.items():
            if location_name == self.player['Location']:
                continue
            if location_data['Node Sections'] is None:
                continue
            for (node_name, node_data) in location_data['Node Sections'].items():
                node_left = location_data['Left'] + node_data['Column']
                node_top = location_data['Top'] + node_data['Row']
                if (
                    node_left == matching_left and
                    node_top == matching_top and
                    node_data['Edge'] == matching_edge
                ):
                    location = (location_data['Index'], location_name, node_name)
                    heapq.heappush(possible_locations, location)
        (_, location_name, node_name) = heapq.heappop(possible_locations)
        self.player['Location'] = location_name
        self.player['Section'] = node_name

    def play(self):
        print('@', self.player['Location'], '-', self.player['Section'])
        valid_command_names = set()
        # Add choices for valid commands the player can issue
        room_data = self.logic[self.player['Location']]
        triggers = {}
        if 'Triggers' in room_data:
            triggers = room_data['Triggers']
        for command_key, command_info in triggers.items():
            if self.validate(command_info['Requirements']):
                valid_command_names.add(command_key)
        valid_command_names = list(reversed(sorted(valid_command_names)))
        command_map = {}
        codes = '1234567890abcdefghijklmnopqrstuvwxyz'
        for i, command_name in enumerate(valid_command_names):
            command_key = codes[i]
            command_map[command_key] = command_name
            print(command_key + ':', command_name)
        # Ask player for next command
        command_input = input('> ').strip()
        if command_input in command_map.keys():
            command = command_map[command_input]
            self.process_outcomes(triggers[command]['Outcomes'])
        elif command_input in command_map.values():
            command = command_input
            self.process_outcomes(triggers[command]['Outcomes'])
        else:
            print('command not valid:', command_input)
            raise Exception()
        # Process nodes, if any
        self.process_position_update()
        print('')

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open('build/logic.json') as open_file:
        logic = json.load(open_file)
        game = Game(logic, 'Alchemy Laboratory, Entryway', 'Primary')
        game.player['Knowledge - How to Break the Floor in Tall Zig Zag Room'] = True
        game.player['Knowledge - How to Break the Wall in Tall Zig Zag Room'] = True
        # game.player['Knowledge - How to Perform Neutron Bomb Death Skip'] = True
        while True:
            game.play()