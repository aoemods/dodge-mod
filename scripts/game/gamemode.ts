import { AoeEntityComponent } from "../components/aoeentity"
import { CollisionComponent, CollisionResultsComponent } from "../components/collision"
import { GameStateComponent } from "../components/gamestate"
import { LifetimeComponent } from "../components/lifetime"
import { PlayerOwnedComponent } from "../components/playerowned"
import { RigidBodyComponent } from "../components/rigidbody"
import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { collisionSystem } from "../systems/collision"
import { entitySyncSystemPre, entitySyncSystemPost } from "../systems/entitysync"
import { lifetimeSystem } from "../systems/lifetime"
import { physicsSystem } from "../systems/physics"
import { createTask } from "../core/tasks"
import { PlayerComponent } from "../components/player"
import { newEntityId } from "../ecs/entity"
import { RoundsComponent } from "../components/rounds"
import { roundsSystem } from "../systems/rounds"
import { getRounds } from "./rounds"

export interface GameMode {
    onInit(): void
}

type GameComponent = {
    collisionResults: SingletonComponent<CollisionResultsComponent>
    gameState: SingletonComponent<GameStateComponent>
    rounds: SingletonComponent<RoundsComponent>
    rigidBodies: EntityComponents<RigidBodyComponent>
    transforms: EntityComponents<TransformComponent>
    lifetimes: EntityComponents<LifetimeComponent>
    playerOwneds: EntityComponents<PlayerOwnedComponent>
    collisions: EntityComponents<CollisionComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    players: EntityComponents<PlayerComponent>
}

type GameSystemInputs = GameComponent

const gameSystem: System<GameSystemInputs> = (components: GameSystemInputs) => {
    entitySyncSystemPre(components)
    physicsSystem(components)
    collisionSystem(components)
    lifetimeSystem(components)
    roundsSystem(components)
    entitySyncSystemPost(components)
}

export class GameModeRounds implements GameMode {
    updateInterval = 0.125
    components: GameComponent = {
        gameState: {
            deltaTime: this.updateInterval,
        },
        collisionResults: {
            collisionPairs: [],
        },
        rounds: {
            currentRound: -1,
            state: "init",
            timeBetweenRounds: 5,
            remainingSteps: [],
            rounds: getRounds(),
            bounds: { min: [-12, -12], max: [12, 12] },
        },
        collisions: {},
        lifetimes: {},
        playerOwneds: {},
        rigidBodies: {},
        transforms: {},
        aoeEntities: {},
        players: {},
    }

    constructor(players: Player[]) {
        for (const player of players) {
            print(`Creating player ${player} with id ${player.id}`)
            Player_SetCurrentAge(player.id, 4)
            this.components.players[newEntityId()] = {
                aoePlayer: player
            }
        }

        FOW_RevealAll()
    }

    onInit() {
        createTask({
            periodic: true,
            interval: this.updateInterval,
            callback: () => this.update(),
        })
    }

    private update() {
        gameSystem(this.components)
    }
}
