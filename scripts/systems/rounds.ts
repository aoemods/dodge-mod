import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent } from "../components/aoeentity"
import { showNotification, spawnEntity } from "../core/util"
import { RoundsComponent } from "../components/rounds"
import { createTask, stopTask } from "../core/tasks"
import { newEntityId } from "../ecs/entity"
import { LifetimeComponent } from "../components/lifetime"
import { PlayerOwnedComponent } from "../components/playerowned"
import { CollisionComponent, CollisionResultsComponent } from "../components/collision"
import { PlayerComponent } from "../components/player"
import { ProjectileComponent } from "../components/projectile"
import { PingPongComponent } from "../components/pingpong"
import { HealthComponent } from "../components/health"
import { CollisionActionComponent } from "../components/collisionaction"
import { pbgs, sfxs } from "../constants"

export type RoundsSystemInputs = {
    rounds: SingletonComponent<RoundsComponent>
    collisionResults: SingletonComponent<CollisionResultsComponent>
    transforms: EntityComponents<TransformComponent>
    lifetimes: EntityComponents<LifetimeComponent>
    playerOwneds: EntityComponents<PlayerOwnedComponent>
    collisions: EntityComponents<CollisionComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    projectiles: EntityComponents<ProjectileComponent>
    pingPongs: EntityComponents<PingPongComponent>
    healths: EntityComponents<HealthComponent>
    players: EntityComponents<PlayerComponent>
    collisionActions: EntityComponents<CollisionActionComponent>
}

async function startRound(components: RoundsSystemInputs) {
    const { currentRoundRunProps, currentRound } = components.rounds
    if (!currentRoundRunProps) {
        throw new Error("Round run props was undefined in startRound()")
    }

    const round = components.rounds.rounds[currentRound]
    await round(currentRoundRunProps, components)
}

const civHeroBlueprints: Record<string, string> = pbgs.spearman

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
            civHeroBlueprints[playerCiv],
            {
                targetingType: TargetingType.Targeting_None,
            }
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

function prepareNextRound(components: RoundsSystemInputs) {
    const { rounds } = components

    rounds.state = "waiting"

    print(`Waiting ${rounds.timeBetweenRounds} seconds for next round`)

    print("Respawning heroes")
    createHeroes(components)

    rounds.currentTask = createTask({
        callback: () => {
            rounds.state = "inProgress"
            rounds.currentRound++
            print(`Starting round ${rounds.currentRound}`)

            if (rounds.currentRound < rounds.rounds.length) {
                rounds.currentRoundRunProps = { stopped: false }
                startRound(components)
                    .then(() => {
                        rounds.state = "finished"
                        Sound_Play2D(sfxs.roundVictory)
                        showNotification(`Completed round ${rounds.currentRound + 1}`)
                    })
                    .catch(reason => print(`Round stopped, reason: ${reason}`))
            } else {
                print("Game over!")
                showNotification("Completed all rounds, the game is over")
            }
        },
        interval: rounds.timeBetweenRounds,
    })
}

function restartGame(components: RoundsSystemInputs) {
    const { rounds, aoeEntities, lifetimes } = components

    print("All heroes are dead, restarting...")

    Sound_Play2D(sfxs.roundFailure)
    showNotification(`Failed on round ${rounds.currentRound + 1}, restarting from round 1...`)

    for (const entityId in aoeEntities) {
        lifetimes[entityId] = {
            remainingTime: 0
        }
    }

    if (rounds.currentTask) {
        stopTask(rounds.currentTask)
    }

    if (rounds.currentRoundRunProps) {
        rounds.currentRoundRunProps.stopped = true
        rounds.currentRoundRunProps = undefined
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

function killOutOfBoundsHeroes(components: RoundsSystemInputs) {
    const { rounds } = components

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
}

export const roundsSystem: System<RoundsSystemInputs> = (components: RoundsSystemInputs) => {
    const { rounds, aoeEntities } = components

    killOutOfBoundsHeroes(components)

    if (rounds.state === "waiting") {
        return
    }

    if (rounds.state === "finished") {
        prepareNextRound(components)
    } else if (rounds.state === "init") {
        createHeroes(components)
        rounds.state = "finished"
    }

    // Restart game if no heroes alive
    const anyHeroesAlive = Object.values(aoeEntities).filter(aoeEntity => aoeEntity.syncMode === "slave").length === 0
    if (anyHeroesAlive) {
        restartGame(components)
    }
}
