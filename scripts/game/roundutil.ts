import { RoundRunProps } from "../components/rounds"
import { pbgs } from "../constants"
import { PRng } from "../core/prng"
import { createTask } from "../core/tasks"
import { getSquadGroupEntity, makeHorizontalLine, makeVerticalLine, randomInt, showNotification, spawnEntity, spawnSquadGroup, vector2ToPosition } from "../core/util"
import { Vector2 } from "../core/vector2"
import { newEntityId } from "../ecs/entity"
import { RoundsSystemInputs } from "../systems/rounds"
import * as v2 from "../core/vector2"

export const directionNormalPx: Vector2 = [1, 0]
export const directionNormalNx: Vector2 = [-1, 0]
export const directionNormalPy: Vector2 = [0, 1]
export const directionNormalNy: Vector2 = [0, -1]

export const directions: Vector2[] = [
    directionNormalPy,
    directionNormalNy,
    directionNormalPx,
    directionNormalNx,
]

export const directionCenters: Vector2[] = [
    [0, -25],
    [0, 25],
    [-25, 0],
    [25, 0],
]

export function randomPositionAndDirection(prng: PRng): [Vector2, Vector2] {
    const directionNumber = randomInt(prng, 0, 3)
    const direction = directions[directionNumber]
    switch (directionNumber) {
        case 0:
            return [[randomInt(prng, -12, 12), -25], direction]
        case 1:
            return [[randomInt(prng, -12, 12), 25], direction]
        case 2:
            return [[-25, randomInt(prng, -12, 12)], direction]
        case 3:
            return [[25, randomInt(prng, -12, 12)], direction]
    }

    throw new Error(`randomPositionAndDirection ${directionNumber} unhandled`)
}

export function randomPositionForDirection(prng: PRng, directionNumber: number): Vector2 {
    switch (directionNumber) {
        case 0:
            return [randomInt(prng, -12, 12), -25]
        case 1:
            return [randomInt(prng, -12, 12), 25]
        case 2:
            return [-25, randomInt(prng, -12, 12)]
        case 3:
            return [25, randomInt(prng, -12, 12)]
    }

    throw new Error(`randomPositionForDirection ${directionNumber} unhandled`)
}

export enum ProjectileType {
    Sheep,
    Wolf,
    Boar,
    Deer,
}

export type ProjectileTypeData = {
    pbg: string
    speed: number
    radius: number
    fade?: boolean
}

export const projectileTypeData: Record<ProjectileType, ProjectileTypeData> = {
    [ProjectileType.Sheep]: { pbg: pbgs.sheep, speed: 4, radius: 0.6 },
    [ProjectileType.Deer]: { pbg: pbgs.deer, speed: 6, radius: 0.6 },
    [ProjectileType.Wolf]: { pbg: pbgs.wolf, speed: 4, radius: 0.8 },
    [ProjectileType.Boar]: { pbg: pbgs.boar, speed: 4, fade: true, radius: 0.8 },
}

export type SpawnProjectileFunction = (position: Vector2, direction: Vector2) => number

/**
 * @noSelf
 * Should be a type, but tstl seems to generate the wrong code.
*/
export interface RoundInputs {
    wait: (time: number) => Promise<void>
    vertical: (position: Vector2, direction: Vector2, count: number, fn: SpawnProjectileFunction) => number[]
    horizontal: (position: Vector2, direction: Vector2, count: number, fn: SpawnProjectileFunction) => number[]
    sheep: SpawnProjectileFunction
    wolf: SpawnProjectileFunction
    deer: SpawnProjectileFunction
    boar: SpawnProjectileFunction
    mangonel: (position: Vector2, targetPosition: Vector2) => number
    boss: (bossEntityId: number, pbg: string) => void
    components: RoundsSystemInputs
}

export function useRoundInputs(props: RoundRunProps, components: RoundsSystemInputs): RoundInputs {
    async function wait(time: number): Promise<void> {
        return new Promise((resolve, reject) => {
            createTask({
                callback: () => {
                    if (props.stopped) {
                        reject("Round stopped")
                    } else {
                        resolve()
                    }
                },
                interval: time,
            })
        })
    }

    function projectile(type: ProjectileType, position: Vector2, direction: Vector2) {
        const { pbg, speed, radius, fade } = projectileTypeData[type]
        const velocity = v2.scale(direction, speed)

        const playerEntityId = Object.keys(components.players)[0]
        const player = components.players[playerEntityId]

        const projectileEntityId = newEntityId()

        const projectileEntity = spawnEntity(
            player.aoePlayer,
            vector2ToPosition(position),
            pbg,
            {
                unselectable: true,
                targetingType: TargetingType.Targeting_None,
            }
        )

        components.aoeEntities[projectileEntityId] = {
            entityId: projectileEntity,
            syncMode: "master",
        }

        components.projectiles[projectileEntityId] = {
            velocity: velocity,
        }

        if (fade) {
            components.projectiles[projectileEntityId].fade = {
                period: 3,
                dutyCycle: 0.7
            }
        }

        components.playerOwneds[projectileEntityId] = {
            owningPlayerId: playerEntityId,
        }

        components.collisions[projectileEntityId] = {
            radius: radius,
        }

        components.lifetimes[projectileEntityId] = {
            remainingTime: 20
        }

        components.transforms[projectileEntityId] = {
            position: [...position],
            heading: [velocity[0], 0, velocity[1]],
        }

        components.collisionActions[projectileEntityId] = {
            actions: [{
                type: "killPlayer",
            }]
        }

        return projectileEntityId
    }

    function marker(position: Vector2) {
        const playerEntityId = Object.keys(components.players)[0]
        const player = components.players[playerEntityId]

        const entityId = newEntityId()

        const projectileEntity = spawnEntity(
            player.aoePlayer,
            vector2ToPosition(position),
            pbgs.wolf,
            {
                unselectable: true,
                targetingType: TargetingType.Targeting_None,
                invulnerable: false,
            }
        )

        Entity_SetHealth(projectileEntity, 0.01)

        components.aoeEntities[entityId] = {
            entityId: projectileEntity,
            syncMode: "master",
        }

        components.playerOwneds[entityId] = {
            owningPlayerId: playerEntityId,
        }

        components.lifetimes[entityId] = {
            remainingTime: 5
        }

        components.transforms[entityId] = {
            position: [...position],
            heading: [1, 0, 0],
        }

        return entityId
    }

    async function boss(bossEntityId: number, pbg: string) {
        const position: Vector2 = [25, 0]
        const playerEntityId = Object.keys(components.players)[0]
        const player = components.players[playerEntityId]

        const projectileEntity = spawnEntity(
            player.aoePlayer,
            vector2ToPosition(position),
            pbg,
            {
                unselectable: true,
                targetingType: TargetingType.Targeting_None,
            }
        )

        components.aoeEntities[bossEntityId] = {
            entityId: projectileEntity,
            syncMode: "master",
        }

        components.playerOwneds[bossEntityId] = {
            owningPlayerId: playerEntityId,
        }

        components.transforms[bossEntityId] = {
            position: [...position],
            heading: [-1, 0, 0],
        }

        components.healths[bossEntityId] = {
            current: 5,
        }

        showNotification("Boss spawned, run into wolves coming out of it to kill it!")

        while (bossEntityId in components.healths && components.healths[bossEntityId].current > 0) {
            print(`Boss hp: ${components.healths[bossEntityId].current}`)
            await wait(0.5)
        }

        print("Boss done")

        if (bossEntityId in components.healths) {
            components.lifetimes[bossEntityId] = {
                remainingTime: 0,
            }
        }
    }

    function sheep(position: Vector2, direction: Vector2): number {
        return projectile(ProjectileType.Sheep, position, direction)
    }

    function wolf(position: Vector2, direction: Vector2): number {
        const projEntityId = projectile(ProjectileType.Wolf, position, direction)

        components.collisionActions[projEntityId].actions = [{
            type: "damageBoss",
            amount: 1,
        }]

        return projEntityId
    }

    function deer(position: Vector2, direction: Vector2): number {
        return projectile(ProjectileType.Deer, position, direction)
    }

    function boar(position: Vector2, direction: Vector2): number {
        return projectile(ProjectileType.Boar, position, direction)
    }

    function mangonel(position: Vector2, targetPosition: Vector2) {
        const playerEntityId = Object.keys(components.players)[0]
        const player = components.players[playerEntityId]
        const entityId = newEntityId()

        const squadGroup = spawnSquadGroup(
            player.aoePlayer,
            vector2ToPosition(position),
            pbgs.mangonel.english,
            {
                unselectable: true,
                targetingType: TargetingType.Targeting_None,
            }
        )

        const entity = getSquadGroupEntity(squadGroup)

        components.aoeEntities[entityId] = {
            entityId: entity,
        }

        components.playerOwneds[entityId] = {
            owningPlayerId: playerEntityId,
        }

        components.transforms[entityId] = {
            position: [...position],
            heading: [-1, 0, 0],
        }

        components.lifetimes[entityId] = {
            remainingTime: 3,
        }

        const markerEntityId = marker(targetPosition)

        const g = globalThis as any
        const eventName = `entity_${markerEntityId}_killed`
        g[eventName] = (_: any) => {
            print(eventName)

            for (const [entityId, aoeEntity] of Object.entries(components.aoeEntities)) {
                if (aoeEntity.syncMode === "slave" &&
                    v2.distanceSquared(targetPosition, components.transforms[entityId].position) < 5) {
                    print("Killed by mangonel")
                    components.lifetimes[entityId] = {
                        remainingTime: 0
                    }
                }
            }

            if (markerEntityId in components.lifetimes) {
                components.lifetimes[markerEntityId].remainingTime = 0
            }
        }

        Rule_AddEntityEvent(g[eventName], components.aoeEntities[markerEntityId].entityId, GE_EntityKilled)

        Cmd_Attack(squadGroup, vector2ToPosition(targetPosition))

        return entityId
    }

    function vertical(position: Vector2, direction: Vector2, count: number, fn: (position: Vector2, direction: Vector2) => number): number[] {
        const entityIds: number[] = []
        for (const horizontalPosition of makeVerticalLine(position, direction, count)) {
            entityIds.push(fn(horizontalPosition, direction))
        }
        return entityIds
    }

    function horizontal(position: Vector2, direction: Vector2, count: number, fn: (position: Vector2, direction: Vector2) => number): number[] {
        const entityIds: number[] = []
        for (const horizontalPosition of makeHorizontalLine(position, direction, count)) {
            entityIds.push(fn(horizontalPosition, direction))
        }
        return entityIds
    }

    return {
        wait,
        vertical,
        horizontal,
        sheep,
        wolf,
        deer,
        boar,
        mangonel,
        boss,
        components,
    }
}