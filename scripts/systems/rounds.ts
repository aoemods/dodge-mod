import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent } from "../components/aoeentity"
import { spawnEntity, vector2ToPosition } from "../core/util"
import { RoundsComponent } from "../components/rounds"
import { createTask, stopTask } from "../core/tasks"
import { newEntityId } from "../ecs/entity"
import { LifetimeComponent } from "../components/lifetime"
import { PlayerOwnedComponent } from "../components/playerowned"
import { CollisionComponent, CollisionResultsComponent } from "../components/collision"
import { PlayerComponent } from "../components/player"
import { RigidBodyComponent } from "../components/rigidbody"

export type RoundsSystemInputs = {
    rounds: SingletonComponent<RoundsComponent>
    collisionResults: SingletonComponent<CollisionResultsComponent>
    transforms: EntityComponents<TransformComponent>
    lifetimes: EntityComponents<LifetimeComponent>
    playerOwneds: EntityComponents<PlayerOwnedComponent>
    collisions: EntityComponents<CollisionComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    rigidBodies: EntityComponents<RigidBodyComponent>
    players: EntityComponents<PlayerComponent>
}

function startProcessSteps(components: RoundsSystemInputs) {
    function processNextStep() {
        components.rounds.currentTask = undefined
        if (components.rounds.remainingSteps.length === 0) {
            components.rounds.state = "finished"
            Sound_Play2D("Conquest_enemy_eliminated")
            UI_CreateEventCue(LOC(`Completed round ${components.rounds.currentRound + 1}`), undefined, "", "", "sfx_ui_event_queue_high_priority_play")
            return
        }

        const step = components.rounds.remainingSteps.splice(0, 1)[0]

        switch (step.type) {
            case "wait":
                print(`-- Step wait ${step.time}`)
                components.rounds.currentTask = createTask({
                    interval: step.time,
                    callback: () => processNextStep(),
                })
                break
            case "spawnProjectile":
                print("-- Step spawn projectile")
                const playerEntityId = Object.keys(components.players)[0]
                const player = components.players[playerEntityId]

                const projectileEntityId = newEntityId()

                const projectileEntity = spawnEntity(
                    player.aoePlayer,
                    vector2ToPosition(step.position),
                    "gaia_herdable_sheep",
                    {
                        unselectable: true,
                    }
                )

                components.aoeEntities[projectileEntityId] = {
                    entityId: projectileEntity,
                    syncMode: "master",
                }

                components.rigidBodies[projectileEntityId] = {
                    velocity: step.velocity,
                    force: [0, 0],
                }

                components.playerOwneds[projectileEntityId] = {
                    owningPlayerId: playerEntityId,
                }

                components.collisions[projectileEntityId] = {
                    radius: 0.6,
                }

                components.lifetimes[projectileEntityId] = {
                    remainingTime: 10
                }

                components.transforms[projectileEntityId] = {
                    position: [...step.position],
                    heading: [step.velocity[0], 0, step.velocity[1]],
                }

                processNextStep()
                break
            default:
                print(`Unknown step type ${type}`)
        }
    }

    processNextStep()
}

const civHeroBlueprints: Record<string, string> = {
    "english": "unit_spearman_4_eng",
    "chinese": "unit_spearman_4_chi",
    "french": "unit_spearman_4_fre",
    "hre": "unit_spearman_4_hre",
    "mongol": "unit_spearman_4_mon",
    "rus": "unit_spearman_4_rus",
    "sultanate": "unit_spearman_4_sul",
    "abbasid": "unit_spearman_4_abb",
}

function playerHeroExists(playerEntityId: string, components: RoundsSystemInputs) {
    return Object.entries(components.aoeEntities).some(([entId, aoeEnt]) =>
        aoeEnt.syncMode === "slave" &&
        entId in components.playerOwneds &&
        components.playerOwneds[entId].owningPlayerId === playerEntityId
    )
}

function createHeroes(components: RoundsSystemInputs) {
    for (const [playerEntityId, player] of Object.entries(components.players)) {
        // Check if player hero already exists
        if (playerHeroExists(playerEntityId, components)) {
            continue
        }

        const playerCiv = Player_GetRaceName(player.aoePlayer.id)

        const heroEntity = spawnEntity(
            player.aoePlayer,
            World_Pos(0, World_GetHeightAt(0, 0), 0),
            civHeroBlueprints[playerCiv]
        )

        Entity_SetInvulnerable(heroEntity, true, 0)

        const entityId = newEntityId()
        components.aoeEntities[entityId] = {
            entityId: heroEntity,
            syncMode: "slave",
        }
        components.collisions[entityId] = {
            radius: 0.6,
        }
        components.playerOwneds[entityId] = {
            owningPlayerId: playerEntityId,
        }
        components.transforms[entityId] = {
            position: [0, 0],
            heading: [1, 0, 0],
        }
    }
}

export const roundsSystem: System<RoundsSystemInputs> = (components: RoundsSystemInputs) => {
    const { rounds } = components

    // Kill heroes that are out of bounds
    for (const [entityId, aoeEntity] of Object.entries(components.aoeEntities)) {
        const [x, y] = components.transforms[entityId].position
        if (aoeEntity.syncMode === "slave") {
            if (x < rounds.bounds.min[0] || x > rounds.bounds.max[0] ||
                y < rounds.bounds.min[1] || y > rounds.bounds.max[1]) {
                print("Killed because out of bounds")
                components.lifetimes[entityId] = {
                    remainingTime: 0
                }
            }
        }
    }

    if (rounds.state === "waiting") {
        return
    }

    if (rounds.state === "finished") {
        rounds.state = "waiting"

        print(`Waiting ${rounds.timeBetweenRounds} seconds for next round`)

        createHeroes(components)

        rounds.currentTask = createTask({
            callback: () => {
                rounds.state = "inProgress"
                rounds.currentRound++
                print(`Starting round ${rounds.currentRound}`)

                print("Respawning heroes")

                if (rounds.currentRound < rounds.rounds.length) {
                    rounds.remainingSteps = [...rounds.rounds[rounds.currentRound].steps]
                    startProcessSteps(components)
                } else {
                    print("Game over!")
                    UI_CreateEventCue(LOC(`Completed all rounds, the game is over`), undefined, "", "", "sfx_ui_event_queue_high_priority_play")
                }
            },
            interval: rounds.timeBetweenRounds,
        })
    } else if (rounds.state === "init") {
        createHeroes(components)
        rounds.state = "finished"
    }

    // Kill heroes that collide with projectiles
    for (const collEntities of components.collisionResults.collisionPairs) {
        print(`Coll ${collEntities[0]} ${collEntities[1]}`)
        for (let i = 0; i < 2; i++) {
            const collEntity = collEntities[i]
            const collOtherEntity = collEntities[1 - i]
            if (collEntity in components.aoeEntities && components.aoeEntities[collEntity].syncMode === "slave" && (!(collOtherEntity in components.aoeEntities) || components.aoeEntities[collOtherEntity].syncMode !== "slave")) {
                print("Killed because collided")
                components.lifetimes[collEntity] = {
                    remainingTime: 0
                }
            }
        }
    }

    // Restart game if no heroes alive
    if (Object.values(components.aoeEntities).filter(aoeEntity => aoeEntity.syncMode === "slave").length === 0) {
        print("All heroes are dead, restarting...")

        Sound_Play2D("mus_stinger_landmark_objective_complete_fail")
        UI_CreateEventCue(LOC(`Failed on round ${components.rounds.currentRound + 1}, restarting from round 1...`), undefined, "", "", "sfx_ui_event_queue_high_priority_play")

        for (const entityId in components.aoeEntities) {
            components.lifetimes[entityId] = {
                remainingTime: 0
            }
        }

        if (rounds.currentTask) {
            stopTask(rounds.currentTask)
        }

        rounds.state = "waiting"

        rounds.currentTask = createTask({
            callback: () => {
                print("Put back into init")
                rounds.currentTask = undefined
                rounds.currentRound = -1
                rounds.state = "init"
            },
            interval: rounds.timeBetweenRounds,
        })
    }
}
