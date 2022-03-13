import * as v2 from "../core/vector2"
import { GameStateComponent } from "../components/gamestate"
import { RigidBodyComponent } from "../components/rigidbody"
import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"

export type PhysicsSystemInputs = {
    gameState: SingletonComponent<GameStateComponent>
    rigidBodies: EntityComponents<RigidBodyComponent>
    transforms: EntityComponents<TransformComponent>
}

export const physicsSystem: System<PhysicsSystemInputs> = (components: PhysicsSystemInputs) => {
    const { gameState, rigidBodies, transforms } = components

    for (const [entityId, rbComponent] of Object.entries(rigidBodies)) {
        const transformComponent = transforms[entityId]

        v2.addInline(rbComponent.velocity, v2.scale(rbComponent.force, gameState.deltaTime))
        v2.addInline(transformComponent.position, v2.scale(rbComponent.velocity, gameState.deltaTime))

        rbComponent.force[0] = 0
        rbComponent.force[1] = 0
    }
}