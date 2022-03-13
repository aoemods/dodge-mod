import { TransformComponent } from "../components/transform"
import { EntityComponents } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent } from "../components/aoeentity"
import { vectorToPosition } from "../core/util"

export type EntitySyncSystemInputs = {
    aoeEntities: EntityComponents<AoeEntityComponent>
    transforms: EntityComponents<TransformComponent>
}

export const entitySyncSystem: System<EntitySyncSystemInputs> = (components: EntitySyncSystemInputs) => {
    const { aoeEntities, transforms } = components

    for (const [entityId, aoeEntity] of Object.entries(aoeEntities)) {
        const transformComponent = transforms[entityId]

        switch (aoeEntity.syncMode) {
            case "master":
                Entity_SetPosition(aoeEntity.entityId, vectorToPosition(transformComponent.position, aoeEntity.height))
                break
            case "slave":
                const entityPosition = Entity_GetPosition(aoeEntity.entityId)
                transformComponent.position[0] = entityPosition.x
                transformComponent.position[1] = entityPosition.z
                break
        }
    }
}
