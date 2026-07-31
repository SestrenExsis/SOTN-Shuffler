import { inspect } from 'node:util'
import {
    LOCATIONS,
    NODES,
    REWARDS,
    ROOM_PRIORITY,
    ROOMS_INFO,
    TELEPORTERS,
} from './constants.js'

function isValidRequirement(state, requirement) {
    const result = Object.entries(requirement)
    .every(([propertyKey, propertyInfo]) => {
        let stateValue
        switch (typeof propertyInfo) {
            case 'boolean':
                if ((state[propertyKey] ?? false) !== propertyInfo) {
                    return false
                }
                break
            case 'string':
                if ((state[propertyKey] ?? 'NONE') !== propertyInfo) {
                    return false
                }
                break
            case 'object':
                stateValue = state[propertyKey] ?? 0
                if ('minimum' in propertyInfo) {
                    if (stateValue < propertyInfo.minimum) {
                        return false
                    }
                }
                if ('maximum' in propertyInfo) {
                    if (stateValue > propertyInfo.maximum) {
                        return false
                    }
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                break
        }
        return true
    })
    return result
}

function combineRequirements(requirementA, requirementB, includeTimeAndLocation=true) {
    const result = Object.assign({}, requirementA)
    let validInd = true
    Object.entries(requirementB)
    .filter(([propertyKey, propertyInfo]) => {
        return (
            includeTimeAndLocation ||
            !(['stage', 'room', 'section', 'time', 'positionX', 'positionY', 'requirements'].includes(propertyKey))
        )
    })
    .forEach(([propertyKey, propertyInfo]) => {
        let value
        // If the combined requirements contradict one another, mark as invalid
        switch (typeof propertyInfo) {
            case 'boolean':
            case 'string':
                if (propertyKey in result && result[propertyKey] !== propertyInfo) {
                    // validInd = false
                    // NOTE(sestren): This might be the wrong approach?
                }
                result[propertyKey] = propertyInfo
                break
            case 'object':
                if (!(propertyKey in result)) {
                    result[propertyKey] = {}
                }
                if ('minimum' in propertyInfo) {
                    value = result[propertyKey].minimum ?? propertyInfo.minimum
                    result[propertyKey].minimum = Math.max(value, propertyInfo.minimum)
                }
                if ('maximum' in propertyInfo) {
                    value = result[propertyKey].maximum ?? propertyInfo.maximum
                    result[propertyKey].maximum = Math.min(value, propertyInfo.maximum)
                }
                if (
                    ('minimum' in propertyInfo) &&
                    ('maximum' in propertyInfo) &&
                    propertyInfo.minimum > propertyInfo.maximum
                ) {
                    validInd = false
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                break
        }
    })
    if (!validInd) {
        return null
    }
    return result
}

function simplify(state) {
    Object.entries(state)
    .filter(([propertyKey, propertyInfo]) => {
        return !(['stage', 'room', 'section', 'time', 'positionX', 'positionY', 'debugEnableElsewhere'].includes(propertyKey))
    })
    .forEach(([propertyKey, propertyInfo]) => {
        switch (typeof propertyInfo) {
            case 'boolean':
                if (state[propertyKey] === false) {
                    delete state[propertyKey]
                }
                break
            case 'number':
                if (state[propertyKey] === 0) {
                    delete state[propertyKey]
                }
                break
            case 'string':
                if (state[propertyKey] === 'NONE') {
                    delete state[propertyKey]
                }
                break
        }
    })
}

function updateStateWithOutcome(state, outcome, simplifyState=true) {
    Object.entries(outcome)
    .forEach(([propertyKey, propertyInfo]) => {
        switch (typeof propertyInfo) {
            case 'boolean':
            case 'number':
            case 'string':
                state[propertyKey] = propertyInfo
                break
            case 'object':
                // Objects are assumed to modify numbers
                switch (propertyInfo.operation) {
                    case 'replace':
                        state[propertyKey] = propertyInfo.value
                        break
                    case 'add':
                        if (!(propertyKey in state)) {
                            state[propertyKey] = 0
                        }
                        state[propertyKey] += propertyInfo.value
                        break
                    default:
                        console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                        break
                }
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(propertyKey) + ', ' + JSON.stringify(propertyInfo))
                break
        }
    })
    if (simplifyState) {
        simplify(state)
    }
}

function getRoomDimensions(roomPositions) {
    const result = {}
    Object.entries(ROOMS_INFO)
    .forEach(([stageName, stageInfo]) => {
        if (!(stageName in result)) {
            result[stageName] = {}
        }
        Object.entries(stageInfo)
        .forEach(([roomName, roomInfo]) => {
            if (!(roomName in result[stageName])) {
                result[stageName][roomName] = {
                    width: roomInfo.roomInfo.width,
                    height: roomInfo.roomInfo.height,
                }
            }
        })
    })
    roomPositions
    .filter((roomPosition) => {
        const validInd = (
            roomPosition.stage in result && 
            roomPosition.room in result[roomPosition.stage]
        )
        return validInd
    })
    .forEach((roomPosition) => {
        const roomInfo = result[roomPosition.stage][roomPosition.room]
        roomInfo.left = 256 * roomPosition.column
        roomInfo.top = 256 * roomPosition.row
        roomInfo.right = roomInfo.left + roomInfo.width
        roomInfo.bottom = roomInfo.top + roomInfo.height
    })
    return result
}

function updateLocation(location, settings, simplifyState=true) {
    // console.log(location)
    // Determine which room the player is in
    if (
        location.positionX >= 0 &&
        location.positionX < ROOMS_INFO[location.stage][location.room].roomInfo.width &&
        location.positionY >= 0 &&
        location.positionY < ROOMS_INFO[location.stage][location.room].roomInfo.height &&
        !(location.staleLocation ?? false)
    ) {
        // Player is inside the bounds of the current room, so current room stays the same
        // TODO(sestren): This assumption might not work for the secret staircase in Castle Keep
    }
    else {
        // Calculate global position
        const globalPosition = {
            x: 0,
            y: 0,
        }
        settings.roomPositions
        .find((roomPosition) => {
            if (
                roomPosition.stage === location.stage &&
                roomPosition.room === location.room
            ) {
                globalPosition.x = 256 * roomPosition.column + location.positionX
                globalPosition.y = 256 * roomPosition.row + location.positionY
                return true
            }
            return false
        })
        const roomDimensions = getRoomDimensions(settings.roomPositions)
        // Find first room in the priority list that overlaps the global position
        ROOM_PRIORITY[location.stage]
        .find((roomName) => {
            const roomDimension = roomDimensions[location.stage][roomName]
            if (
                globalPosition.x >= roomDimension.left &&
                globalPosition.x < roomDimension.right &&
                globalPosition.y >= roomDimension.top &&
                globalPosition.y < roomDimension.bottom &&
                // Stale location processing must result in a different room
                !(
                    (location.staleLocation ?? false) &&
                    (roomName === location.room)
                )
            ) {
                location.room = roomName
                location.positionX = globalPosition.x - roomDimension.left
                location.positionY = globalPosition.y - roomDimension.top
                location.staleLocation = false
                return true
            }
            return false
        })
    }
    // Find first section that satisfies requirements for the room-relative position
    ROOMS_INFO[location.stage][location.room].regions
    .find((regionInfo) => {
        location.section = 'NONE'
        let validRegion = false
        regionInfo.requirements
        .find((requirementInfo) => {
            const validRequirement = isValidRequirement(location, requirementInfo)
            if (validRequirement) {
                updateStateWithOutcome(location, regionInfo.outcome, simplifyState)
                validRegion = true
            }
            return validRequirement
        })
        return validRegion
    })
}

function getLocationRewardCommands(settings) {
    const result = []
    Object.entries(LOCATIONS ?? {})
    .forEach(([locationName, locationInfo]) => {
        // Process every location requirement (Only certain stages for now)
        locationInfo.requirements
        .filter((locationRequirementInfo) => {
            return locationRequirementInfo.stage in ROOM_PRIORITY
        })
        .forEach((locationRequirementInfo) => {
            const stageName = locationRequirementInfo.stage
            const roomName = locationRequirementInfo.room
            const location = {
                stage: stageName,
                room: roomName,
                section: 'NONE',
                positionX: locationInfo.outcome.positionX,
                positionY: locationInfo.outcome.positionY,
            }
            updateLocation(location, settings)
            // Process every reward requirement
            const command = {
                outcome: Object.assign({}, locationInfo.outcome),
                requirement: Object.assign({}, locationRequirementInfo),
            }
            command.requirement.section = location.section
            result.push(command)
            if (locationName in settings.locationRewards) {
                const rewardName = settings.locationRewards[locationName]
                REWARDS[rewardName].requirements
                .forEach((rewardRequirementInfo) => {
                    const command = {
                        outcome: {},
                        requirement: {},
                    }
                    Object.assign(command.outcome, locationInfo.outcome)
                    Object.assign(command.outcome, REWARDS[rewardName].outcome)
                    Object.assign(command.requirement, locationRequirementInfo)
                    Object.entries(rewardRequirementInfo)
                    .forEach(([propertyKey, propertyInfo]) => {
                        if (propertyKey == 'costs') {
                            Object.entries(propertyInfo)
                            .forEach(([costKey, costValue]) => {
                                switch (typeof costValue) {
                                    case 'number':
                                        command.requirement[costKey] = {
                                            minimum: costValue,
                                        }
                                        command.outcome[costKey] = {
                                            operation: 'add',
                                            value: -1 * costValue,
                                        }
                                        break
                                    default:
                                        command.outcome[costKey] = costValue
                                        break
                                }
                            })
                        }
                        else {
                            command.requirement[propertyKey] = propertyInfo
                        }
                    })
                    command.requirement.section = location.section
                    result.push(command)
                })
            }
        })
    })
    return result
}

function getLogic(settings, enableElsewhere=false) {
    const result = {}
    const roomPositions = settings.roomPositions ?? []
    // Process every location-reward combination
    roomPositions
    .forEach((roomPosition) => {
        if (!(roomPosition.stage in result)) {
            result[roomPosition.stage] = {}
        }
        if (!(roomPosition.room in result[roomPosition.stage])) {
            result[roomPosition.stage][roomPosition.room] = []
        }
        if (
            !(roomPosition.stage in ROOMS_INFO) ||
            !(roomPosition.room in ROOMS_INFO[roomPosition.stage]) ||
            !('commands' in ROOMS_INFO[roomPosition.stage][roomPosition.room])
        ) {
            // console.log('***', roomPosition.stage, roomPosition.room)
            return
        }
        Object.entries(ROOMS_INFO[roomPosition.stage][roomPosition.room].commands)
        .forEach(([commandName, commandInfo]) => {
            commandInfo.requirements
            .forEach((requirementInfo) => {
                const command = {
                    outcome: JSON.parse(JSON.stringify(commandInfo.outcome)),
                    requirement: {},
                }
                Object.entries(requirementInfo)
                .forEach(([propertyKey, propertyInfo]) => {
                    if (propertyKey == 'costs') {
                        Object.entries(propertyInfo)
                        .forEach(([costKey, costValue]) => {
                            switch (typeof costValue) {
                                case 'number':
                                    command.requirement[costKey] = {
                                        minimum: costValue,
                                    }
                                    command.outcome[costKey] = {
                                        operation: 'add',
                                        value: -1 * costValue,
                                    }
                                    break
                                default:
                                    command.outcome[costKey] = costValue
                                    break
                            }
                        })
                    }
                    else {
                        command.requirement[propertyKey] = propertyInfo
                    }
                })
                // NOTE(sestren): Location is the only "weird" set of properties
                if (
                    'stage' in command.outcome ||
                    'room' in command.outcome ||
                    'section' in command.outcome ||
                    'positionX' in command.outcome ||
                    'positionY' in command.outcome ||
                    'staleLocation' in command.outcome
                ) {
                    const location = {
                        stage: roomPosition.stage,
                        room: roomPosition.room,
                        section: command.outcome.section ?? command.requirement.section ?? 'NONE',
                        positionX: command.outcome.positionX ?? 0,
                        positionY: command.outcome.positionY ?? 0,
                        staleLocation: command.outcome.staleLocation ?? false,
                    }
                    updateLocation(location, settings, false)
                    Object.entries(location)
                    .forEach(([propertyKey, propertyValue]) => {
                        command.outcome[propertyKey] = propertyValue
                    })
                }
                result[roomPosition.stage][roomPosition.room].push(command)
            })
        })
    })
    // Process every location-reward combination
    if ('locationRewards' in settings) {
        getLocationRewardCommands(settings)
        .forEach((command) => {
            const reducedCommand = Object.assign({}, command)
            const stageName = reducedCommand.requirement.stage
            const roomName = reducedCommand.requirement.room
            delete reducedCommand.requirement.stage
            delete reducedCommand.requirement.room
            if (!(stageName in result)) {
                result[stageName] = {}
            }
            if (!(roomName in result[stageName])) {
                result[stageName][roomName] = []
            }
            result[stageName][roomName].push(reducedCommand)
        })
    }
    // Process every stage link
    Object.entries(settings.stageLinks ?? {})
    .filter(([sourceTeleporterName, targetTeleporterName]) => {
        return (
            (
                sourceTeleporterName.startsWith('fromAbandonedMine') ||
                sourceTeleporterName.startsWith('fromAlchemyLaboratory') ||
                sourceTeleporterName.startsWith('fromCastleEntrance') ||
                sourceTeleporterName.startsWith('fromCastleKeep') ||
                sourceTeleporterName.startsWith('fromCatacombs') ||
                sourceTeleporterName.startsWith('fromClockTower') ||
                sourceTeleporterName.startsWith('fromColosseum') ||
                sourceTeleporterName.startsWith('fromLongLibrary') ||
                sourceTeleporterName.startsWith('fromMarbleGallery') ||
                sourceTeleporterName.startsWith('fromOlroxsQuarters') ||
                sourceTeleporterName.startsWith('fromOuterWall') ||
                sourceTeleporterName.startsWith('fromRoyalChapel') ||
                sourceTeleporterName.startsWith('fromUndergroundCaverns') ||
                sourceTeleporterName.startsWith('fromWarpRooms')
            ) && (
                targetTeleporterName.startsWith('fromAbandonedMine') ||
                targetTeleporterName.startsWith('fromAlchemyLaboratory') ||
                targetTeleporterName.startsWith('fromCastleEntrance') ||
                targetTeleporterName.startsWith('fromCastleKeep') ||
                targetTeleporterName.startsWith('fromCatacombs') ||
                targetTeleporterName.startsWith('fromClockTower') ||
                targetTeleporterName.startsWith('fromColosseum') ||
                targetTeleporterName.startsWith('fromLongLibrary') ||
                targetTeleporterName.startsWith('fromMarbleGallery') ||
                targetTeleporterName.startsWith('fromOlroxsQuarters') ||
                targetTeleporterName.startsWith('fromOuterWall') ||
                targetTeleporterName.startsWith('fromRoyalChapel') ||
                targetTeleporterName.startsWith('fromUndergroundCaverns') ||
                targetTeleporterName.startsWith('fromWarpRooms')
            )
        )
    })
    .forEach(([sourceTeleporterName, targetTeleporterName]) => {
        const location = {
            stage: TELEPORTERS[targetTeleporterName].sourceStage,
            room: TELEPORTERS[targetTeleporterName].room,
            section: 'NONE',
            positionX: TELEPORTERS[targetTeleporterName].positionX,
            positionY: TELEPORTERS[targetTeleporterName].positionY,
        }
        updateLocation(location, settings)
        const command = {
            outcome: location,
            requirement: {},
        }
        const sourceStageName = TELEPORTERS[sourceTeleporterName].sourceStage
        const otherStageName = TELEPORTERS[sourceTeleporterName].targetStage
        const sourceRoomName = 'triggerTeleporterTo' + otherStageName.at(0).toUpperCase() + otherStageName.slice(1)
        result[sourceStageName][sourceRoomName].push(command)
    })
    // Link any unlinked stages to a universal hub for testing purposes
    if (enableElsewhere) {
        result.elsewhere = {
            hub: [],
        }
        Object.entries(ROOM_PRIORITY)
        .filter(([stageName, roomNames]) => {
            return stageName in result
        })
        .forEach(([stageName, roomNames]) => {
            roomNames
            .filter((roomName) => {
                return roomName.startsWith('loadingRoomTo') && roomName in result[stageName]
            })
            .filter((roomName) => {
                let linkCount = -1
                result[stageName][roomName]
                .find((command) => {
                    if (command.outcome.room.startsWith('triggerTeleporterTo')) {
                        linkCount = result[stageName][command.outcome.room].length
                        // console.log(command.outcome.room, ':', result[stageName][command.outcome.room])
                    }
                })
                return linkCount === 0
            })
            .forEach((roomName) => {
                // console.log(`Add link to universal hub for (${stageName}.${roomName})`)
                result.elsewhere.hub.push({
                    outcome: {
                        stage: stageName,
                        room: roomName,
                        section: 'main',
                    },
                    requirement: {
                        stage: 'elsewhere',
                        room: 'hub',
                        debugEnableElsewhere: true,
                    },
                })
                result[stageName][roomName].push({
                    outcome: {
                        stage: 'elsewhere',
                        room: 'hub',
                        section: 'main',
                    },
                    requirement: {
                        stage: stageName,
                        room: roomName,
                        section: 'main',
                        debugEnableElsewhere: true,
                    },
                })
            })
        })
    }
    return result
}

function hashedState(state, simple=false) {
    // Example: abandonedMine.bend.main.b8e6fb7c
    const elements = []
    elements.push(state.stage ?? 'NONE')
    elements.push(state.room ?? 'NONE')
    elements.push(state.section ?? 'NONE')
    if (!simple) {
        elements.push(hashedObject(state, ['stage', 'room', 'section', 'time', 'positionX', 'positionY']))
    }
    const result = elements.join('.')
    return result
}

function hashedObject(object, ignoredProperties) {
    const elements = []
    Object.keys(object)
    .filter((key) => {
        return !(ignoredProperties.includes(key))
    })
    .sort()
    .forEach((key) => {
        switch (typeof object[key]) {
            case 'boolean':
            case 'number':
            case 'string':
                elements.push([key, object[key]].join('='))
                break
            case 'object':
                elements.push([key, hashedObject(object[key])].join('='))
                break
            default:
                console.log('Unhandled key-value pair: ' + JSON.stringify(key) + ', ' + JSON.stringify(object[key]))
                break
        }
    })
    const result = hashedText(elements.join('|'))
    return result
}

// Javascript implementation of DJBX33A as defined at https://stackoverflow.com/questions/10696223/reason-for-the-number-5381-in-the-djb-hash-function
function hashedText(text) {
    const MOD = Math.pow(2, 32)
    let value = 5381
    for (let i = 0; i < text.length; i++) {
        value = ((33 * value) + text.charCodeAt(i)) % MOD
    }
    let result = ''
    for (let i = 0; i < 8; i++) {
        result += '0123456789abcdef'.at(value % 16)
        value = Math.floor(value / 16)
    }
    return result
}

export function findGoal(logic, startingState, goalState, sameStage=false) {
    // console.log('findGoal')
    let result = null
    const map = new Map()
    const subWork = [
        Object.assign({}, startingState),
    ]
    // map.set(hashedState(startingState), startingState)
    while (subWork.length > 0) {
        // console.log('subWork.length:', subWork.length, 'map.size:', map.size)
        const currentState = subWork.pop()
        if (sameStage && (currentState.stage !== startingState.stage)) {
            continue
        }
        // console.log('currentState:', currentState)
        logic[currentState.stage][currentState.room]
        .find((command) => {
            if (isValidRequirement(currentState, command.requirement)) {
                const nextState = Object.assign({}, currentState)
                updateStateWithOutcome(nextState, command.outcome)
                if (nextState.section === 'NONE') {
                    // console.log('currentState:', currentState)
                    // console.log('nextState:', nextState)
                    throw Error('')
                }
                const nextStateHash = hashedState(nextState)
                if (
                    !map.has(nextStateHash) ||
                    map.get(nextStateHash).time < nextState.time
                ) {
                    map.set(nextStateHash, nextState)
                    if (isValidRequirement(nextState, goalState)) {
                        result = nextState
                        return true
                    } else {
                        subWork.push(nextState)
                    }
                }
                return false
            }
            return false
        })
        if (result !== null) {
            break
        }
    }
    return result
}

export function validate(settings, validation) {
    const logic = getLogic(settings, true)
    if (validation.debug ?? false) {
        console.log('logic:', JSON.stringify(logic, null, 4))
    }
    let goalFound = findGoal(logic, validation.startingState, validation.goalState)
    let result = true
    switch (validation.goalType) {
        case 'required':
            result = (goalFound !== null)
            break
        case 'forbidden':
            result = (goalFound === null)
            break
    }
    return result
}

function getEdges(logic, startingState) {
    // NOTE(sestren): Starting state is assumed to be in Castle Entrance for now, and will probably not work for other stages yet
    const TIME_BUDGET = startingState.time
    // Calculate edges between nodes that are traversable from the starting node
    const visits = new Map()
    const work = [
        {
            stageName: 'castleEntrance',
            nodeName: 'locationCubeOfZoe',
            state: findGoal(logic, startingState, NODES.castleEntrance.locationCubeOfZoe.requirement, true),
        },
    ]
    visits.set([work.at(-1).stageName, work.at(-1).nodeName].join('.'), work.at(-1))
    const result = {
        'castleEntrance.start': {
            'castleEntrance.locationCubeOfZoe': TIME_BUDGET - work.at(-1).state.time,
        },
    }
    while (work.length > 0) {
        const prevVisitInfo = work.pop()
        const prevVisitId = [prevVisitInfo.stageName, prevVisitInfo.nodeName].join('.')
        // traverse from previous node to every other node (current) in the stage
        Object.entries(NODES[prevVisitInfo.stageName])
        .filter(([currentNodeName, currentNode]) => {
            return (prevVisitInfo.nodeName !== currentNodeName)
        })
        .forEach(([currentNodeName, currentNode]) => {
            const currentVisitId = [prevVisitInfo.stageName, currentNodeName].join('.')
            prevVisitInfo.state.time = TIME_BUDGET
            const currentState = findGoal(logic, prevVisitInfo.state, currentNode.requirement, true)
            if (currentState !== null) {
                const currentVisitInfo = {
                    stageName: currentState.stage,
                    nodeName: currentNodeName,
                    state: currentState,
                }
                if (!(visits.has(currentVisitId))) {
                    work.push(currentVisitInfo)
                    visits.set(currentVisitId, currentVisitInfo)
                }
                if (!(prevVisitId in result)) {
                    result[prevVisitId] = {}
                }
                result[prevVisitId][currentVisitId] = TIME_BUDGET - currentState.time
            }
        })
        // if previous node is an exit, push the node paired with it to the work stack
        const prevNode = NODES[prevVisitInfo.stageName][prevVisitInfo.nodeName]
        if (prevNode.nodeType === 'exit') {
            const prevState = prevVisitInfo.state
            const currentState = Object.assign({}, prevState)
            currentState.time = TIME_BUDGET
            logic[prevState.stage][prevState.room]
            .filter((command) => {
                return (
                    command.outcome.room.startsWith('triggerTeleporterTo') &&
                    isValidRequirement(prevState, command.requirement)
                )
            })
            .find((command) => {
                // Exit the loading room toward the paired room
                updateStateWithOutcome(currentState, command.outcome)
                // Trigger the teleporter
                const triggerCommand = logic[currentState.stage][currentState.room].at(0)
                updateStateWithOutcome(currentState, triggerCommand.outcome)
                return true
            })
            const nextState = Object.assign({}, currentState)
            logic[currentState.stage][currentState.room]
            .filter((command) => {
                return (
                    'room' in command.outcome &&
                    command.outcome.room.startsWith('loadingRoomTo') &&
                    isValidRequirement(currentState, command.requirement)
                )
            })
            .find((command) => {
                // Exit the paired room toward the loading room
                updateStateWithOutcome(nextState, command.outcome)
                return true
            })
            const nextVisitInfo = {
                stageName: nextState.stage,
                nodeName: nextState.room,
                state: nextState,
            }
            const nextVisitId = [nextVisitInfo.stageName, nextVisitInfo.nodeName].join('.')
            if (!(visits.has(nextVisitId))) {
                work.push(nextVisitInfo)
                visits.set(nextVisitId, nextVisitInfo)
            }
            if (!(prevVisitId in result)) {
                result[prevVisitId] = {}
            }
            result[prevVisitId][nextVisitId] = TIME_BUDGET - nextState.time
        }
    }
    return result
}

export function analyzeLogic(settings, scenario) {
    const result = {
        solved: false,
        solvedState: null,
    }
    scenario.startingNodes
    .forEach((nodeId) => {
        switch (NODES[nodeId.stageName][nodeId.nodeName].nodeType) {
            case 'action':
                updateStateWithOutcome(scenario.startingState, NODES[nodeId.stageName][nodeId.nodeName].requirement)
                break
            case 'check':
                const rewardName = settings.locationRewards[nodeId.nodeName]
                const locationOutcome = {}
                locationOutcome[nodeId.nodeName] = true
                updateStateWithOutcome(scenario.startingState, locationOutcome)
                updateStateWithOutcome(scenario.startingState, REWARDS[rewardName].outcome)
                break
            default:
                break
        }
    })
    const goalState = {}
    scenario.goalNodes
    .forEach((nodeId) => {
        switch (NODES[nodeId.stageName][nodeId.nodeName].nodeType) {
            case 'action':
                updateStateWithOutcome(goalState, NODES[nodeId.stageName][nodeId.nodeName].requirement)
                break
            case 'check':
                const locationOutcome = {}
                locationOutcome[nodeId.nodeName] = true
                updateStateWithOutcome(goalState, locationOutcome)
                break
            default:
                break
        }
    })
    // REPEAT until all action/check nodes found or no more can be found:
    //   - Calculate edges between nodes that are reachable from the starting state
    //   - For each action node or check node that can reach the start:
    //       - add its outcome to starting state
    const logic = getLogic(settings)
    const nodesFound = new Map()
    let newNodeFound = true
    while (newNodeFound) {
        newNodeFound = false
        const edges = getEdges(logic, scenario.startingState)
        Object.entries(edges)
        .filter(([currentNodeName, nextNodeNames]) => {
            return currentNodeName !== 'castleEntrance.start'
        })
        .forEach(([currentNodeName, nextNodeNames]) => {
            if (nodesFound.has(currentNodeName)) {
                return
            }
            const parts = currentNodeName.split('.')
            const stageName = parts.at(0)
            const nodeName = parts.at(1)
            if (['action', 'check'].includes(NODES[stageName][nodeName].nodeType)) {
                const visits = new Map()
                const work = [
                    currentNodeName,
                ]
                visits.set(currentNodeName, true)
                while (work.length > 0) {
                    const currentNode = work.pop()
                    if (currentNode === 'castleEntrance.locationCubeOfZoe') {
                        nodesFound.set(currentNodeName, true)
                        newNodeFound = true
                        switch (NODES[stageName][nodeName].nodeType) {
                            case 'action':
                                updateStateWithOutcome(scenario.startingState, NODES[stageName][nodeName].requirement)
                                break
                            case 'check':
                                const rewardName = settings.locationRewards[nodeName]
                                const locationOutcome = {}
                                locationOutcome[nodeName] = true
                                updateStateWithOutcome(scenario.startingState, locationOutcome)
                                updateStateWithOutcome(scenario.startingState, REWARDS[rewardName].outcome)
                                break
                        }
                        break
                    }
                    if (currentNode in edges) {
                        Object.entries(edges[currentNode])
                        .forEach(([nextNode, time]) => {
                            if (visits.has(nextNode)) {
                                return
                            }
                            else {
                                work.push(nextNode)
                                visits.set(nextNode, true)
                            }
                        })
                    }
                }
            }
        })
        if (!newNodeFound) {
            if (isValidRequirement(scenario.startingState, goalState)) {
                result.solved = true
                result.solvedState = scenario.startingState
            }
            else {
                result.solved = false
                result.solvedState = null
            }
            break
        }
    }
    // console.log('startingState:', inspect(scenario.startingState, { depth: 4 }))
    // console.log('result:', inspect(result, { depth: 4 }))
    return result
}