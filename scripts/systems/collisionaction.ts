import { CollisionActionComponent, CollisionAction } from "../components/collisionaction"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { CollisionResultsComponent } from "../components/collision"
import { HealthComponent } from "../components/health"
import { LifetimeComponent } from "../components/lifetime"
import { AoeEntityComponent } from "../components/aoeentity"

export type CollisionActionSystemInputs = {
    collisionResults: SingletonComponent<CollisionResultsComponent>
    collisionActions: EntityComponents<CollisionActionComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
    lifetimes: EntityComponents<LifetimeComponent>
    healths: EntityComponents<HealthComponent>
}

export const collisionActionSystem: System<CollisionActionSystemInputs> = (components: CollisionActionSystemInputs) => {
    const { collisionResults, collisionActions, healths, lifetimes, aoeEntities } = components

    function handleCollisionAction(sourceEntityId: string, targetEntityId: string, actions: CollisionAction[]) {
        const isPlayerTarget = targetEntityId in aoeEntities && aoeEntities[targetEntityId].syncMode === "slave"
        if (!isPlayerTarget) {
            return
        }

        for (const action of actions) {
            switch (action.type) {
                case "damageBoss":
                    if (isPlayerTarget && (
                        !(sourceEntityId in lifetimes) ||
                        lifetimes[sourceEntityId].remainingTime === undefined ||
                        lifetimes[sourceEntityId].remainingTime! > 0
                    )) {
                        for (const healthComponent of Object.values(healths)) {
                            healthComponent.current -= action.amount
                            UI_CreateEventCue(LOC(`Boss health: ${healthComponent.current}`), undefined, "", "", "sfx_ui_event_queue_high_priority_play")
                        }

                        lifetimes[sourceEntityId] = {
                            remainingTime: 0
                        }
                    }
                    break
                case "killPlayer":
                    if (isPlayerTarget) {
                        lifetimes[targetEntityId] = {
                            remainingTime: 0
                        }
                    }
                    break
            }
        }
    }

    for (const [a, b] of collisionResults.collisionPairs) {
        if (a in collisionActions) {
            handleCollisionAction(a, b, collisionActions[a].actions)
        }

        if (b in collisionActions) {
            handleCollisionAction(b, a, collisionActions[b].actions)
        }
    }
}
