
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
        logic_core = mapper.LogicCore(
            current_seed['Data Core'],
            current_seed['Changes'],
        ).get_core()
        game = solver.Game(logic_core)
        # game.current_state['Progression - Summon Demon Familiar'] = False
        # game.cheat_location('Abandoned Mine, Crumbling Stairwells With Demon Switch', 'Block Area')
        # game.current_state['Status - Warp Room to Abandoned Mine Unlocked'] = True
        # game.current_state['Status - Warp Room to Castle Entrance Unlocked'] = True
        # game.current_state['Status - Warp Room to Castle Keep Unlocked'] = True
        # game.current_state["Status - Warp Room to Olrox's Quarters Unlocked"] = True
        # game.current_state['Status - Warp Room to Outer Wall Unlocked'] = True
        while True:
            game.play()