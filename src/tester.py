
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
        # game.cheat_location('Warp Rooms, Warp Room to Castle Keep', 'Special')
        # game.current_state['Status - Warp Room to Abandoned Mine Unlocked'] = True
        # game.current_state['Status - Warp Room to Castle Entrance Unlocked'] = True
        # game.current_state['Status - Warp Room to Castle Keep Unlocked'] = True
        # game.current_state["Status - Warp Room to Olrox's Quarters Unlocked"] = True
        # game.current_state['Status - Warp Room to Outer Wall Unlocked'] = True
        while True:
            game.play()