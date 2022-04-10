import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { LifetimeComponent } from "../components/lifetime"
import { GameStateComponent } from "../components/gamestate"
import { RigidBodyComponent } from "../components/rigidbody"
import { TransformComponent } from "../components/transform"
import { PlayerOwnedComponent } from "../components/playerowned"
import { CollisionComponent } from "../components/collision"
import { AoeEntityComponent } from "../components/aoeentity"
import { HealthComponent } from "../components/health"
import { CollisionActionComponent } from "../components/collisionaction"
import { PingPongComponent } from "../components/pingpong"

export type LifetimeSystemInputs = {
    rigidBodies: EntityComponents<RigidBodyComponent>
    transforms: EntityComponents<TransformComponent>
    lifetimes: EntityComponents<LifetimeComponent>
    playerOwneds: EntityComponents<PlayerOwnedComponent>
    collisions: EntityComponents<CollisionComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    healths: EntityComponents<HealthComponent>
    collisionActions: EntityComponents<CollisionActionComponent>
    pingPongs: EntityComponents<PingPongComponent>
    gameState: SingletonComponent<GameStateComponent>
}

export const lifetimeSystem: System<LifetimeSystemInputs> = (components: LifetimeSystemInputs) => {
    const { gameState, lifetimes } = components

    const allComponents = [
        components.collisions,
        components.lifetimes,
        components.playerOwneds,
        components.rigidBodies,
        components.transforms,
        components.aoeEntities,
        components.healths,
        components.collisionActions,
        components.pingPongs,
    ]

    for (const entityId of Object.keys(components.lifetimes)) {
        const lifetimeComp = lifetimes[entityId]

        if (lifetimeComp.remainingTime !== undefined) {
            if (lifetimeComp.remainingTime <= 0) {
                if (entityId in components.aoeEntities) {
                    Entity_Kill(components.aoeEntities[entityId].entityId)
                }

                for (const comps of allComponents) {
                    if (entityId in comps) {
                        delete comps[entityId]
                    }
                }
            } else {
                lifetimeComp.remainingTime -= gameState.deltaTime
            }
        }
    }
}