import json
import os
import solver

# TODO(sestren): Support different categories like Any%, RBO, Pacifist, etc?

if __name__ == '__main__':
    with open(os.path.join('build', 'sandbox', 'logic-core.json')) as logic_core_json:
        logic_core = json.load(logic_core_json)
        game = solver.Game(logic_core['State'], logic_core['Commands'], logic_core['Goals'])
        game.cheat_command('Outer Wall, Elevator Shaft Room', 'Action - Collect Soul of Wolf Relic')
        game.cheat_location('Marble Gallery, Clock Room', 'Main')
        while True:
            game.play()