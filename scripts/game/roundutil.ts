import { RoundRunProps } from "../components/rounds"
import { pbgs } from "../constants"
import { PRng } from "../core/prng"
import { createTask } from "../core/tasks"
import { randomInt, showNotification, spawnEntity, vector2ToPosition } from "../core/util"
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
    [ProjectileType.Wolf]: { pbg: pbgs.wolf, speed: 4, radius: 0.6 },
    [ProjectileType.Boar]: { pbg: pbgs.boar, speed: 4, fade: true, radius: 0.8 },
}

/**
 * @noSelf
 * Should be a type, but tstl seems to generate the wrong code.
*/
export interface RoundInputs {
    wait: (time: number) => Promise<void>
    sheep: (position: Vector2, direction: Vector2) => number
    wolf: (position: Vector2, direction: Vector2) => number
    deer: (position: Vector2, direction: Vector2) => number
    boar: (position: Vector2, direction: Vector2) => number
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

        components.pingPongs[bossEntityId] = {
            speed: 2,
            goingTo: "a",
            positionA: [25, -12],
            positionB: [25, 12],
        }

        components.playerOwneds[bossEntityId] = {
            owningPlayerId: playerEntityId,
        }

        components.collisions[bossEntityId] = {
            radius: 0.6,
        }

        components.transforms[bossEntityId] = {
            position: [...position],
            heading: [-1, 0, 0],
        }

        components.healths[bossEntityId] = {
            current: 5,
        }

        showNotification("Boss spawned, run into wolves to kill it!")

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

    return {
        wait,
        sheep,
        wolf,
        deer,
        boar,
        boss,
        components,
    }
}