import { TransformComponent } from "../components/transform"
import { EntityComponents } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent, EntitySyncProperty } from "../components/aoeentity"
import { vector3ToPosition, vector2ToPosition } from "../core/util"

export type EntitySyncSystemInputs = {
    aoeEntities: EntityComponents<AoeEntityComponent>
    transforms: EntityComponents<TransformComponent>
}

export const entitySyncSystem: System<EntitySyncSystemInputs> = (components: EntitySyncSystemInputs) => {
    const { aoeEntities, transforms } = components

    for (const [entityId, aoeEntity] of Object.entries(aoeEntities)) {
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
            case "slave":
                if (syncPosition) {
                    const entityPosition = Entity_GetPosition(aoeEntity.entityId)
                    transformComponent.position[0] = entityPosition.x
                    transformComponent.position[1] = entityPosition.z
                }

                if (syncHeading) {
                    const entityHeading = Entity_GetHeading(aoeEntity.entityId)
                    transformComponent.heading[0] = entityHeading.x
                    transformComponent.heading[1] = entityHeading.y
                    transformComponent.heading[2] = entityHeading.z
                }
                break
        }
    }
}
