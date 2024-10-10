# SOTN-Randomizer

This project is still actively in the prototyping phase of development. It almost definitely has bugs, will cause softlocks, and may even corrupt the game BIN in its current state. Use at your own risk.

## Logic

A representation of all of the rules of the game, including rules, goals (i.e., win conditions), skills, map layout, object locations, etc.

Some rules assume certain skills to be solvable, so not all combinations of skills and rules will yield solvable games.

### Rules

Rules include starting conditions and actions which are permitted during a playthrough. (e.g., Alucard Any%, Alucard Glitchless, Alucard Pacifist, Alucard Reverse Boss Order).

### Goals

What constitutes a solved playthrough (e.g., Defeat Richter, Defeat Lord Dracula, Defeat All Bosses)

### Skills

Skills are movement options, techniques, and/or glitches the player is expected to know how to perform when available (e.g., Casual, Standard, Advanced, Beyond).

### Map Layout

How rooms are connected to one another within each stage and how each stage is connected to one another in the castle (e.g., Vanilla, Randomized Rooms and Stages)

### Object Locations

Where Relics and other objects are placed within the castle (e.g., Vanilla, Randomized Relics, etc.)

## State

The current state of the game, including player location, progression made, items collected, etc.

## Examples of creating solvable games

### Vanilla Alucard Glitchless, Casual Playthrough

logic = Logic()
logic.skillset('Casual')
logic.ruleset('Alucard Glitchless')
logic.win_condition('Defeat Lord Dracula')
result = logic.solve()
return result

### Vanilla Alucard Any%

logic = Logic()
logic.skillset('Advanced')
logic.ruleset('Alucard Any%')
logic.win_condition('Defeat Lord Dracula')
result = logic.solve()
return result

### Randomized Alucard Glitchless

logic = Logic()
logic.skillset('Standard')
logic.ruleset('Alucard Glitchless')
logic.win_condition('Defeat Lord Dracula')
while True:
    for stage in logic.stages:
        logic.randomize_rooms(stage)
    logic.randomize_stages()
    logic.assign_teleporters()
    logic.randomize_relics()
    if logic.solve():
        break

### Randomized Alucard Pacifist

logic = Logic()
logic.skillset('Advanced')
logic.ruleset('Alucard Pacifist')
logic.win_condition('Defeat Lord Dracula')
while True:
    for stage in logic.stages:
        logic.randomize_rooms(stage)
    logic.randomize_stages()
    logic.assign_teleporters()
    logic.randomize_relics()
    if logic.solve():
        break

### Randomized Richter Any%

logic = Logic()
logic.skillset('Advanced')
logic.ruleset('Richter Any%')
logic.win_condition('Defeat Lord Dracula')
while True:
    for stage in logic.stages:
        logic.randomize_rooms(stage)
    logic.randomize_stages()
    logic.assign_teleporters()
    logic.randomize_relics()
    if logic.solve():
        break