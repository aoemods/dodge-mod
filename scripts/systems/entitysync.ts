import { TransformComponent } from "../components/transform"
import { EntityComponents } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent, EntitySyncProperty } from "../components/aoeentity"
import { vector3ToPosition, vector2ToPosition, copyPositionToVector3, copyPositionToVector2, isEntityValidAndAlive } from "../core/util"
import { LifetimeComponent } from "../components/lifetime"

export type EntitySyncSystemInputs = {
    aoeEntities: EntityComponents<AoeEntityComponent>
    transforms: EntityComponents<TransformComponent>
    lifetimes: EntityComponents<LifetimeComponent>
}

function expireIfNotAlive(entityId: string, components: EntitySyncSystemInputs) {
    const aoeEntity = components.aoeEntities[entityId]

    if (!isEntityValidAndAlive(aoeEntity.entityId)) {
        components.lifetimes[entityId] = {
            remainingTime: 0
        }

        return true
    }

    return false
}

export const entitySyncSystemPre: System<EntitySyncSystemInputs> = (components: EntitySyncSystemInputs) => {
    const { aoeEntities, transforms } = components

    for (const [entityId, aoeEntity] of Object.entries(aoeEntities)) {
        if (expireIfNotAlive(entityId, components)) {
            continue
        }

        const transformComponent = transforms[entityId]

        const syncPosition = !aoeEntity.syncProperties || (aoeEntity.syncProperties & EntitySyncProperty.Position) === EntitySyncProperty.Position
        const syncHeading = !aoeEntity.syncProperties || (aoeEntity.syncProperties & EntitySyncProperty.Heading) === EntitySyncProperty.Heading

        switch (aoeEntity.syncMode) {
            case "slave":
                if (syncPosition) {
                    const entityPosition = Entity_GetPosition(aoeEntity.entityId)
                    copyPositionToVector2(transformComponent.position, entityPosition)
                }

                if (syncHeading) {
                    const entityHeading = Entity_GetHeading(aoeEntity.entityId)
                    copyPositionToVector3(transformComponent.heading, entityHeading)
                }
                break
        }
    }
}

export const entitySyncSystemPost: System<EntitySyncSystemInputs> = (components: EntitySyncSystemInputs) => {
    const { aoeEntities, transforms } = components

    for (const [entityId, aoeEntity] of Object.entries(aoeEntities)) {
        if (expireIfNotAlive(entityId, components)) {
            continue
        }

        const transformComponent = transforms[entityId]

        const syncPosition = !aoeEntity.syncProperties || (aoeEntity.syncProperties & EntitySyncProperty.Position) === EntitySyncProperty.Position
        const syncHeading = !aoeEntity.syncProperties || (aoeEntity.syncProperties & EntitySyncProperty.Heading) === EntitySyncProperty.Heading

        switch (aoeEntity.syncMode) {
            case "master":
                if (syncPosition) {
                    Entity_SetPosition(aoeEntity.entityId, vector2ToPosition(transformComponent.position, aoeEntity.height))
                }

                if (syncHeading) {
                    Entity_SetHeading(aoeEntity.entityId, vector3ToPosition(transformComponent.heading), true)
                }
                break
        }
    }
}
