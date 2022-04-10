import * as v2 from "../core/vector2"
import { GameStateComponent } from "../components/gamestate"
import { PingPongComponent } from "../components/pingpong"
import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"

export type PingPongSystemInputs = {
    gameState: SingletonComponent<GameStateComponent>
    pingPongs: EntityComponents<PingPongComponent>
    transforms: EntityComponents<TransformComponent>
}

export const pingPongSystem: System<PingPongSystemInputs> = (components: PingPongSystemInputs) => {
    const { gameState, pingPongs, transforms } = components

    for (const [entityId, pingPongComponent] of Object.entries(pingPongs)) {
        const transformComponent = transforms[entityId]

        const targetPosition = pingPongComponent.goingTo === "a" ?
            pingPongComponent.positionA :
            pingPongComponent.positionB

        const offset = v2.sub(targetPosition, transformComponent.position)

        const distance = v2.length(offset)
        const addedOffset = v2.getNormalizedSafe(offset)
        const frameSpeed = pingPongComponent.speed * gameState.deltaTime
        if (distance < frameSpeed) {
            pingPongComponent.goingTo = pingPongComponent.goingTo === "a" ? "b" : "a"
            v2.scaleInline(addedOffset, distance)
        } else {
            v2.scaleInline(addedOffset, frameSpeed)
        }

        v2.addInline(transformComponent.position, addedOffset)
    }
}