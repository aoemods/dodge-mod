import { Round, RoundRunProps } from "../components/rounds"
import { pbgs } from "../constants"
import { PRng } from "../core/prng"
import { createTask } from "../core/tasks"
import { randomInt, spawnEntity, vector2ToPosition } from "../core/util"
import { Vector2 } from "../core/vector2"
import * as v2 from "../core/vector2"
import { newEntityId } from "../ecs/entity"
import { RoundsSystemInputs } from "../systems/rounds"

const velocityNormalPx: Vector2 = [1, 0]
const velocityNormalNx: Vector2 = [-1, 0]
const velocityNormalPy: Vector2 = [0, 1]
const velocityNormalNy: Vector2 = [0, -1]

export enum ProjectileType {
    Sheep,
    Wolf,
    Boar,
    Deer,
}

export type ProjectileTypeData = {
    pbg: string
    speed: number
}

export const projectileTypeData: Record<ProjectileType, ProjectileTypeData> = {
    [ProjectileType.Sheep]: { pbg: pbgs.sheep, speed: 4 },
    [ProjectileType.Deer]: { pbg: pbgs.deer, speed: 6 },
    [ProjectileType.Wolf]: { pbg: pbgs.wolf, speed: 4 },
    [ProjectileType.Boar]: { pbg: pbgs.boar, speed: 2 },
}

/**
 * @noSelf
 * Should be a type, but tstl seems to generate the wrong code.
*/
export interface RoundFunctions {
    wait: (time: number) => Promise<void>
    sheep: (position: Vector2, direction: Vector2) => void
    wolf: (position: Vector2, direction: Vector2) => void
    deer: (position: Vector2, direction: Vector2) => void
    boar: (position: Vector2, direction: Vector2) => void
}

export function useRoundFunctions(props: RoundRunProps, components: RoundsSystemInputs): RoundFunctions {
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

    function spawnProjectile(position: Vector2, velocity: Vector2, pbg: string) {
        const playerEntityId = Object.keys(components.players)[0]
        const player = components.players[playerEntityId]

        const projectileEntityId = newEntityId()

        const projectileEntity = spawnEntity(
            player.aoePlayer,
            vector2ToPosition(position),
            pbg,
            {
                unselectable: true,
            }
        )

        components.aoeEntities[projectileEntityId] = {
            entityId: projectileEntity,
            syncMode: "master",
        }

        components.rigidBodies[projectileEntityId] = {
            velocity: velocity,
            force: [0, 0],
        }

        components.playerOwneds[projectileEntityId] = {
            owningPlayerId: playerEntityId,
        }

        components.collisions[projectileEntityId] = {
            radius: 0.6,
        }

        components.lifetimes[projectileEntityId] = {
            remainingTime: 20
        }

        components.transforms[projectileEntityId] = {
            position: [...position],
            heading: [velocity[0], 0, velocity[1]],
        }
    }

    function projectile(type: ProjectileType, position: Vector2, direction: Vector2) {
        const { pbg, speed } = projectileTypeData[type]
        const velocity = v2.scale(direction, speed)
        spawnProjectile(position, velocity, pbg)
    }

    function sheep(position: Vector2, direction: Vector2) {
        projectile(ProjectileType.Sheep, position, direction)
    }

    function wolf(position: Vector2, direction: Vector2) {
        projectile(ProjectileType.Wolf, position, direction)
    }

    function deer(position: Vector2, direction: Vector2) {
        projectile(ProjectileType.Deer, position, direction)
    }

    function boar(position: Vector2, direction: Vector2) {
        projectile(ProjectileType.Boar, position, direction)
    }

    return {
        wait,
        sheep,
        wolf,
        deer,
        boar,
    }
}

export async function round1(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    sheep([25, 0], velocityNormalNx)
    await wait(1.5)
    sheep([25, 0], velocityNormalNx)
    await wait(1.5)
    sheep([25, 10], velocityNormalNx)
    await wait(1.5)
    sheep([25, -10], velocityNormalNx)
    await wait(1.5)
    sheep([25, -7], velocityNormalNx)
    await wait(1.5)
    sheep([25, 7], velocityNormalNx)
    await wait(1.5)
    sheep([25, 3], velocityNormalNx)
    await wait(1.5)
    sheep([25, -3], velocityNormalNx)
    await wait(1.5)
    sheep([25, 12], velocityNormalNx)
    await wait(1.5)
    sheep([25, -11], velocityNormalNx)
}

export async function round2(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const seq = [
        -10, 8, -8, 2, -4, 12, 15, 9, -3, -1,
        -5, 0, -6, 3, 1, 6, -15, -7, 5,
        11, -2, 10, 4, -9, 7, -12, -11,
    ]

    for (let i = 0; i < seq.length; i++) {
        sheep([-25, seq[i]], velocityNormalPx)
        await wait(0.7)
    }

    await wait(5)

    for (let i = 0; i < seq.length; i++) {
        sheep([seq[i], 25], velocityNormalNy)
        await wait(0.7)
    }
}

export async function round3(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const seq = [
        -2, 10, 2, 1, -4, -5, 4, -12, 12, 0,
        -10, 6, 8, -11, 9, -8, -6, -1, 5, 7,
        11, 3, -3, -9, -7
    ]

    for (let i = 0; i < seq.length; i++) {
        sheep([25, seq[i]], velocityNormalNx)
        await wait(0.3)
    }

    await wait(4)

    for (let i = 0; i < seq.length; i++) {
        sheep([seq[i], -25], velocityNormalPy)
        await wait(0.3)
    }
}

export async function round4(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(4)

    for (let i = 0; i < 20; i++) {
        sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        await wait(0.5)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 20; i++) {
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.5)
    }
}

export async function round5(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(5)

    for (let i = 0; i < 35; i++) {
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.8)
    }

    await wait(10)

    for (let i = 0; i < 35; i++) {
        sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.8)
    }
}

export async function round6(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(6)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -3; j <= 3; j++) {
            sheep([center + j, 25], velocityNormalNy)
        }
        await wait(1.5)
    }

    await wait(10)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            sheep([center + j, 25], velocityNormalNy)
        }
        await wait(2)
    }
}

export async function round7(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(7)

    for (let i = 0; i < 20; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            sheep([center + j, 25], velocityNormalNy)
        }
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 20; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            sheep([25, center + j], velocityNormalNx)
        }
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.5)
    }
}

export async function round8(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(8)

    for (let i = 0; i < 30; i++) {
        sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        sheep([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        await wait(1.2)
    }
}

export async function round9(roundFunctions: RoundFunctions) {
    const { wait, sheep } = roundFunctions

    const prng = PRng.new(9)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            sheep([center + j, 25], velocityNormalNy)
        }

        for (let j = 0; j < 2; j++) {
            sheep([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        }

        await wait(2)
    }
}

// TODO: round10... bossround

export async function round11(roundFunctions: RoundFunctions) {
    const { wait, sheep, deer } = roundFunctions

    const prng = PRng.new(11)

    for (let i = 0; i < 16; i++) {
        deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 16; i++) {
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
    }
}

export async function round12(roundFunctions: RoundFunctions) {
    const { wait, sheep, deer } = roundFunctions

    const prng = PRng.new(12)

    for (let i = 0; i < 12; i++) {
        deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 12; i++) {
        deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
        deer([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        }
        await wait(3)
    }
}

export async function round13(roundFunctions: RoundFunctions) {
    const { wait, deer } = roundFunctions

    const prng = PRng.new(13)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        }
        await wait(3)
    }

    await wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        }
        await wait(2)
    }
}

export async function round14(roundFunctions: RoundFunctions) {
    const { wait, sheep, deer } = roundFunctions

    const prng = PRng.new(14)

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 5; j++) {
            sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
            await wait(0.3)
        }

        deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
    }
}

export function getRounds(): Round[] {
    return [
        round1,
        round2,
        round3,
        round4,
        round5,
        round6,
        round7,
        round8,
        round9,
        round11,
        round12,
        round13,
        round14,
    ].map(round => async (props: RoundRunProps, components: RoundsSystemInputs) => {
        const roundFunctions = useRoundFunctions(props, components)
        await round(roundFunctions)
        await roundFunctions.wait(10)
    })
}