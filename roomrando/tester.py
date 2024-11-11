import json
import os
import solver

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open(os.path.join('build', 'sandbox', 'current-seed.json')) as current_seed_json:
        current_seed = json.load(current_seed_json)
        logic_core = current_seed['Logic Core']
        game = solver.Game(logic_core['State'], logic_core['Commands'], logic_core['Goals'])
        game.cheat_command('Outer Wall, Elevator Shaft Room', 'Action - Collect Soul of Wolf Relic')
        game.cheat_location('Marble Gallery, Clock Room', 'Main')
        while True:
            game.play()