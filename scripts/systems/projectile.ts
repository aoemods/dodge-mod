import * as v2 from "../core/vector2"
import { GameStateComponent } from "../components/gamestate"
import { ProjectileComponent } from "../components/projectile"
import { TransformComponent } from "../components/transform"
import { EntityComponents, SingletonComponent } from "../ecs/components"
import { System } from "../ecs/systems"
import { AoeEntityComponent } from "../components/aoeentity"

export type ProjectileSystemInputs = {
    gameState: SingletonComponent<GameStateComponent>
    projectiles: EntityComponents<ProjectileComponent>
    transforms: EntityComponents<TransformComponent>
    aoeEntities: EntityComponents<AoeEntityComponent>
}

export const projectileSystem: System<ProjectileSystemInputs> = (components: ProjectileSystemInputs) => {
    const { gameState, projectiles, transforms, aoeEntities } = components

    for (const [entityId, projectile] of Object.entries(projectiles)) {
        const transformComponent = transforms[entityId]
        const aoeEntityComponent = aoeEntities[entityId]

        v2.addInline(transformComponent.position, v2.scale(projectile.velocity, gameState.deltaTime))

        if (projectile.fade) {
            Entity_VisHide(
                aoeEntityComponent.entityId,
                World_GetGameTime() % projectile.fade.period < projectile.fade.dutyCycle * projectile.fade.period
            )
        }
    }
}