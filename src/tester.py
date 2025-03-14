
# External libraries
import json
import os

# Local libraries
import mapper
import solver

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open(os.path.join('build', 'shuffler', 'current-seed.json')) as current_seed_json:
        current_seed = json.load(current_seed_json)
        mapper_data = current_seed['Data Core']
        changes = current_seed['Changes']
        logic_core = mapper.LogicCore(mapper_data, changes).get_core()
        game = solver.Game(logic_core)
        # game.cheat_command('Outer Wall, Elevator Shaft Room', 'Action - Collect Soul of Wolf Relic')
        # game.cheat_location('Marble Gallery, Clock Room', 'Main')
        while True:
            game.play()