import { Round, RoundRunProps } from "../components/rounds"
import { pbgs } from "../constants"
import { PRng } from "../core/prng"
import { createTask } from "../core/tasks"
import { randomInt, showNotification, spawnEntity, vector2ToPosition } from "../core/util"
import { Vector2 } from "../core/vector2"
import * as v2 from "../core/vector2"
import { newEntityId } from "../ecs/entity"
import { RoundsSystemInputs } from "../systems/rounds"

const directionNormalPx: Vector2 = [1, 0]
const directionNormalNx: Vector2 = [-1, 0]
const directionNormalPy: Vector2 = [0, 1]
const directionNormalNy: Vector2 = [0, -1]

const directions: Vector2[] = [
    directionNormalPy,
    directionNormalNy,
    directionNormalPx,
    directionNormalNx,
]

function randomPositionAndDirection(prng: PRng): [Vector2, Vector2] {
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

function randomPositionForDirection(prng: PRng, directionNumber: number): Vector2 {
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

export async function round1(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    sheep([25, 0], directionNormalNx)
    await wait(1.5)
    sheep([25, 0], directionNormalNx)
    await wait(1.5)
    sheep([25, 10], directionNormalNx)
    await wait(1.5)
    sheep([25, -10], directionNormalNx)
    await wait(1.5)
    sheep([25, -7], directionNormalNx)
    await wait(1.5)
    sheep([25, 7], directionNormalNx)
    await wait(1.5)
    sheep([25, 3], directionNormalNx)
    await wait(1.5)
    sheep([25, -3], directionNormalNx)
    await wait(1.5)
    sheep([25, 12], directionNormalNx)
    await wait(1.5)
    sheep([25, -11], directionNormalNx)
}

export async function round2(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const seq = [
        -10, 8, -8, 2, -4, 12, 15, 9, -3, -1,
        -5, 0, -6, 3, 1, 6, -15, -7, 5,
        11, -2, 10, 4, -9, 7, -12, -11,
    ]

    for (let i = 0; i < seq.length; i++) {
        sheep([-25, seq[i]], directionNormalPx)
        await wait(0.7)
    }

    await wait(5)

    for (let i = 0; i < seq.length; i++) {
        sheep([seq[i], 25], directionNormalNy)
        await wait(0.7)
    }
}

export async function round3(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const seq = [
        -2, 10, 2, 1, -4, -5, 4, -12, 12, 0,
        -10, 6, 8, -11, 9, -8, -6, -1, 5, 7,
        11, 3, -3, -9, -7
    ]

    for (let i = 0; i < seq.length; i++) {
        sheep([25, seq[i]], directionNormalNx)
        await wait(0.3)
    }

    await wait(4)

    for (let i = 0; i < seq.length; i++) {
        sheep([seq[i], -25], directionNormalPy)
        await wait(0.3)
    }
}

export async function round4(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(4)

    for (let i = 0; i < 20; i++) {
        sheep([randomInt(prng, -12, 12), -25], directionNormalPy)
        await wait(0.5)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 20; i++) {
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.5)
    }
}

export async function round5(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(5)

    for (let i = 0; i < 35; i++) {
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.8)
    }

    await wait(10)

    for (let i = 0; i < 35; i++) {
        sheep([randomInt(prng, -12, 12), -25], directionNormalPy)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.8)
    }
}

export async function round6(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(6)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -3; j <= 3; j++) {
            sheep([center + j, 25], directionNormalNy)
        }
        await wait(1.5)
    }

    await wait(10)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            sheep([center + j, 25], directionNormalNy)
        }
        await wait(2)
    }
}

export async function round7(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(7)

    for (let i = 0; i < 20; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            sheep([center + j, 25], directionNormalNy)
        }
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 20; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            sheep([25, center + j], directionNormalNx)
        }
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.5)
    }
}

export async function round8(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(8)

    for (let i = 0; i < 30; i++) {
        sheep([randomInt(prng, -12, 12), -25], directionNormalPy)
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        sheep([-25, randomInt(prng, -12, 12)], directionNormalPx)
        await wait(1.5)
    }
}

export async function round9(roundInputs: RoundInputs) {
    const { wait, sheep } = roundInputs

    const prng = PRng.new(9)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            sheep([center + j, 25], directionNormalNy)
        }

        for (let j = 0; j < 2; j++) {
            sheep([-25, randomInt(prng, -12, 12)], directionNormalPx)
        }

        await wait(2)
    }
}

export async function round10(roundInputs: RoundInputs) {
    const { wait, sheep, wolf, boss, components } = roundInputs

    let done = false

    const bossEntityId = newEntityId()

    async function spawnExtraSheep() {
        const prng = PRng.new(888810)
        let extraSheepCount = 1
        let spawnDelay = 1.8
        while (!done) {
            for (let i = 0; i < 12; i++) {
                for (let j = 0; j < extraSheepCount; j++) {
                    sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
                }
                await wait(spawnDelay)

                if (done) {
                    break
                }
            }

            extraSheepCount++
            spawnDelay = Math.max(spawnDelay - 0.1, 1)
        }
    }

    async function spawnBossSheep() {
        const prng = PRng.new(777710)
        let nextWolf = 3
        while (!done) {
            if (bossEntityId in components.transforms) {
                const bossPosition = components.transforms[bossEntityId].position
                if (nextWolf <= 0) {
                    wolf(bossPosition, directionNormalNx)
                    nextWolf = randomInt(prng, 4, 8)
                } else {
                    sheep(bossPosition, directionNormalNx)
                    nextWolf--
                }
            }

            await wait(3)
        }
    }

    spawnBossSheep()
    spawnExtraSheep()
    await boss(bossEntityId, pbgs.manAtArms.english)
    done = true
}

export async function round11(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(11)

    for (let i = 0; i < 16; i++) {
        deer([randomInt(prng, -12, 12), -25], directionNormalPy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 16; i++) {
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], directionNormalNx)
        sheep([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
    }
}

export async function round12(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(12)

    for (let i = 0; i < 12; i++) {
        deer([randomInt(prng, -12, 12), -25], directionNormalPy)
        deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
        deer([25, randomInt(prng, -12, 12)], directionNormalNx)
        sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 12; i++) {
        deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
        deer([-25, randomInt(prng, -12, 12)], directionNormalPx)
        deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        await wait(0.5)
    }

    await wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        }
        await wait(3)
    }
}

export async function round13(roundInputs: RoundInputs) {
    const { wait, deer } = roundInputs

    const prng = PRng.new(13)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), 25], directionNormalNy)
        }
        await wait(3)
    }

    await wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            deer([randomInt(prng, -12, 12), -25], directionNormalPy)
        }
        await wait(2)
    }
}

export async function round14(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(14)

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 5; j++) {
            sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
            await wait(0.3)
        }

        deer([randomInt(prng, -12, 12), -25], directionNormalPy)
    }
}

export async function round21(roundInputs: RoundInputs) {
    const { wait, sheep, boar } = roundInputs

    let done = false
    let boarIteration = 0;

    async function spawnBoars() {
        const prng = PRng.new(777721)
        for (boarIteration = 0; boarIteration < 14; boarIteration++) {
            const [position, direction] = randomPositionAndDirection(prng)
            boar(position, direction)

            await wait(randomInt(prng, 3, 8))
        }

        done = true
    }

    async function spawnSheep() {
        const prng = PRng.new(333321)
        let previousBoarIteration = boarIteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousBoarIteration !== boarIteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousBoarIteration = boarIteration
            }

            if (previousBoarIteration % 3 !== 0) {
                sheep(randomPositionForDirection(prng, directionNumber), directions[directionNumber])
            }

            await wait(0.1 + 2 / (1 + 2 * boarIteration))
        }
    }

    await Promise.all([spawnBoars(), spawnSheep()])
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
        round10,
        round11,
        round12,
        round13,
        round14,
        round21,
    ].map(round => async (props: RoundRunProps, components: RoundsSystemInputs) => {
        const roundInputs = useRoundInputs(props, components)
        await round(roundInputs)
        await roundInputs.wait(10)
    })
}