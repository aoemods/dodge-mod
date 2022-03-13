import * as v2 from "../core/vector2"
import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { CollisionComponent, CollisionResultsComponent } from "../components/collision"

export type CollisionSystemInputs = {
    transforms: EntityComponents<TransformComponent>
    collisions: EntityComponents<CollisionComponent>
    collisionResults: SingletonComponent<CollisionResultsComponent>
}

export const collisionSystem: System<CollisionSystemInputs> = (components: CollisionSystemInputs) => {
    const { transforms, collisions, collisionResults } = components

    const entityIds = Object.keys(collisions)

    collisionResults.collisionPairs = []

    for (let i = 0; i < entityIds.length; i++) {
        const entityA = entityIds[i]
        const collA = collisions[entityA]
        const transformA = transforms[entityA]
        for (let j = i + 1; j < entityIds.length; j++) {
            const entityB = entityIds[j]
            const collB = collisions[entityB]
            const transformB = transforms[entityB]

            const dstSq = v2.distanceSquared(transformA.position, transformB.position)
            const collDist = collA.radius + collB.radius

            if (dstSq < collDist * collDist) {
                collisionResults.collisionPairs.push([entityA, entityB])
            }
        }
    }
}