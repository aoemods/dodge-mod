import { Round, RoundRunProps } from "../components/rounds"
import { pbgs } from "../constants"
import { PRng } from "../core/prng"
import { makeHorizontalLine, makeVerticalLine, randomInt } from "../core/util"
import { Vector2 } from "../core/vector2"
import { newEntityId } from "../ecs/entity"
import { RoundsSystemInputs } from "../systems/rounds"
import {
    directionCenters,
    directionNormalNx, directionNormalNy, directionNormalPx, directionNormalPy,
    directions, randomPositionAndDirection, randomPositionForDirection, RoundInputs, useRoundInputs
} from "./roundutil"

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

    const prng = PRng.new(77776)

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
    const { wait, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function spawnMangonels() {
        const prng = PRng.new(777711)
        for (iteration = 0; iteration < 10; iteration++) {
            const directionNumber = randomInt(prng, 0, 3)
            const targetPosition: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
            const position = randomPositionForDirection(prng, directionNumber)
            mangonel(position, targetPosition)

            await wait(randomInt(prng, 3, 8))
        }

        done = true
    }

    async function spawnSheep() {
        const prng = PRng.new(333311)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 3 !== 0) {
                sheep(randomPositionForDirection(prng, directionNumber), directions[directionNumber])
            }

            await wait(0.2 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([spawnMangonels(), spawnSheep()])
}

export async function round12(roundInputs: RoundInputs) {
    const { wait, horizontal, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function spawnMangonels() {
        const prng = PRng.new(777712)
        for (iteration = 0; iteration < 8; iteration++) {
            for (let i = 0; i < 3 + Math.floor(iteration / 5); i++) {
                const directionNumber = randomInt(prng, 0, 3)
                const targetPosition: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
                const position = randomPositionForDirection(prng, directionNumber)
                mangonel(position, targetPosition)
            }

            await wait(6)
        }

        done = true
    }

    async function spawnSheep() {
        const prng = PRng.new(333312)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 3 !== 0) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 5, sheep)
            }

            await wait(0.5 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([spawnMangonels(), spawnSheep()])
}

export async function round13(roundInputs: RoundInputs) {
    const { wait, horizontal, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function spawnMangonels() {
        const prng = PRng.new(777713)
        for (iteration = 0; iteration < 40; iteration++) {
            const directionNumber = randomInt(prng, 0, 3)
            const targetPosition: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
            const position = randomPositionForDirection(prng, directionNumber)
            mangonel(position, targetPosition)

            await wait(1)
        }

        done = true
    }

    async function spawnSheep() {
        const prng = PRng.new(333313)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 3 !== 0) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], randomInt(prng, 1, 7), sheep)
            }

            await wait(0.5 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([spawnMangonels(), spawnSheep()])
}

export async function round14(roundInputs: RoundInputs) {
    const { wait, horizontal, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function advanceIteration() {
        while (iteration < 8) {
            await wait(5)
            iteration++
        }
        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777714)
        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)

            const targetPositionCenter: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
            const position = randomPositionForDirection(prng, directionNumber)
            for (const targetPosition of makeHorizontalLine(targetPositionCenter, [2, 0], 5)) {
                mangonel(position, targetPosition)
            }

            await wait(4)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(333314)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 3 !== 0) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 1 + 2 * randomInt(prng, 1, 4), sheep)
            }

            if (previousIteration % 3 === 1) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 1, sheep)
            }

            await wait(0.5 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round15(roundInputs: RoundInputs) {
    const { wait, horizontal, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function advanceIteration() {
        while (iteration < 10) {
            await wait(5)
            iteration++
        }
        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777715)
        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)

            for (let i = 0; i < randomInt(prng, 1, 3 + Math.floor(iteration / 2)); i++) {
                const targetPositionCenter: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
                const position = randomPositionForDirection(prng, directionNumber)
                const lineFn = randomInt(prng, 0, 1) === 0 ? makeHorizontalLine : makeVerticalLine
                for (const targetPosition of lineFn(targetPositionCenter, [2, 0], randomInt(prng, 1, 5))) {
                    mangonel(position, targetPosition)
                }
            }

            await wait(6)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(333315)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 4 !== 0) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 1 + 2 * randomInt(prng, 1, 3), sheep)
            }

            if (previousIteration % 3 === 1) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 2, sheep)
            }

            await wait(0.3 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round16(roundInputs: RoundInputs) {
    const { wait, horizontal, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function advanceIteration() {
        while (iteration < 9) {
            await wait(5)
            iteration++
        }
        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777716)
        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)

            for (let i = 0; i < randomInt(prng, 1, 1 + Math.floor(iteration / 2)); i++) {
                const targetPositionCenter: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
                const position = randomPositionForDirection(prng, directionNumber)
                const lineFn = randomInt(prng, 0, 1) === 0 ? makeHorizontalLine : makeVerticalLine
                for (const targetPosition of lineFn(targetPositionCenter, [2, 0], 13)) {
                    mangonel(position, targetPosition)
                }
            }

            await wait(6)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(333316)
        let previousIteration = iteration

        let directionNumber = randomInt(prng, 0, 3)
        let directionNumber2 = randomInt(prng, 0, 3)

        while (!done) {
            if (previousIteration !== iteration) {
                directionNumber = randomInt(prng, 0, 3)
                directionNumber2 = randomInt(prng, 0, 3)
                previousIteration = iteration
            }

            if (previousIteration % 4 !== 0) {
                horizontal(randomPositionForDirection(prng, directionNumber), directions[directionNumber], 1 + 2 * randomInt(prng, 1, 3), sheep)
            }

            if (previousIteration % 4 === 1) {
                horizontal(randomPositionForDirection(prng, directionNumber2), directions[directionNumber2], randomInt(prng, 1, 3), sheep)
            }

            await wait(0.5 + 2 / (1 + 2 * iteration))
        }
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round17(roundInputs: RoundInputs) {
    const { wait, sheep, mangonel } = roundInputs

    let done = false
    let sheepDone = false
    let iteration = 0;

    async function advanceIteration() {
        while (iteration < 10) {
            await wait(5)
            iteration++
        }
        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777717)
        while (!sheepDone) {
            const directionNumber = randomInt(prng, 0, 3)

            for (let i = 0; i < 1 + Math.floor(iteration / 2); i++) {
                const targetPositionCenter: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
                const position = randomPositionForDirection(prng, directionNumber)
                mangonel(position, targetPositionCenter)
            }

            await wait(4)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(333317)

        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)
            const direction = directions[directionNumber]
            const lineCenter = directionCenters[directionNumber]

            const horizontalPositions = makeHorizontalLine(lineCenter, direction, 25)
            const holeIndex = randomInt(prng, 0, horizontalPositions.length - 1)
            for (let i = 0; i < horizontalPositions.length; i++) {
                if (Math.abs(i - holeIndex) > 2) {
                    sheep(horizontalPositions[i], direction)
                }
            }

            await wait(2)

            for (let i = 0; i < 6; i++) {
                const position = randomPositionForDirection(prng, directionNumber)
                sheep(position, direction)
                await wait(0.8)
            }
        }

        sheepDone = true
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round18(roundInputs: RoundInputs) {
    const { wait, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0;

    async function advanceIteration() {
        while (iteration < 9) {
            await wait(5)
            iteration++
        }
        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777718)
        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)

            const targetPositionCenter: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
            const position = randomPositionForDirection(prng, directionNumber)
            const lineFn = randomInt(prng, 0, 1) === 0 ? makeHorizontalLine : makeVerticalLine
            for (const targetPosition of lineFn(targetPositionCenter, [2, 0], 13)) {
                mangonel(position, targetPosition)
            }

            await wait(5)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(444418)

        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)
            const direction = directions[directionNumber]
            const lineCenter = directionCenters[directionNumber]

            const horizontalPositions = makeHorizontalLine(lineCenter, direction, 25)
            const holeIndex = randomInt(prng, 0, horizontalPositions.length - 1)
            for (let i = 0; i < horizontalPositions.length; i++) {
                if (Math.abs(i - holeIndex) > 2) {
                    sheep(horizontalPositions[i], direction)
                }
            }

            await wait(4)
        }
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round19(roundInputs: RoundInputs) {
    const { wait, sheep, mangonel } = roundInputs

    let done = false
    let iteration = 0

    async function advanceIteration() {
        for (let i = 0; i < 4; i++) {
            await wait(10)
            iteration++
        }

        await wait(5)

        done = true
    }

    async function spawnMangonels() {
        const prng = PRng.new(777719)
        while (!done) {
            const directionNumber = randomInt(prng, 0, 3)
            const targetPosition: Vector2 = [randomInt(prng, -12, 12), randomInt(prng, -12, 12)]
            const position = randomPositionForDirection(prng, directionNumber)
            mangonel(position, targetPosition)

            await wait(1)
        }
    }

    async function spawnSheep() {
        const prng = PRng.new(444419)

        while (!done) {
            const direction = directions[0]
            const lineCenter = directionCenters[0]

            const horizontalPositions = makeHorizontalLine(lineCenter, direction, 25)
            const holeIndex = randomInt(prng, 0, horizontalPositions.length - 1)
            for (let i = 0; i < horizontalPositions.length; i++) {
                if (Math.abs(i - holeIndex) > 2) {
                    sheep(horizontalPositions[i], direction)
                }
            }

            await wait(3 - 0.2 * iteration)
        }
    }

    await Promise.all([advanceIteration(), spawnMangonels(), spawnSheep()])
}

export async function round21(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(21)

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

export async function round22(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(22)

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

export async function round23(roundInputs: RoundInputs) {
    const { wait, deer } = roundInputs

    const prng = PRng.new(23)

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

export async function round24(roundInputs: RoundInputs) {
    const { wait, sheep, deer } = roundInputs

    const prng = PRng.new(24)

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 5; j++) {
            sheep([25, randomInt(prng, -12, 12)], directionNormalNx)
            await wait(0.3)
        }

        deer([randomInt(prng, -12, 12), -25], directionNormalPy)
    }
}

export async function round25(roundInputs: RoundInputs) {
    const { wait, sheep, boar } = roundInputs

    let done = false
    let boarIteration = 0;

    async function spawnBoars() {
        const prng = PRng.new(777725)
        for (boarIteration = 0; boarIteration < 14; boarIteration++) {
            const [position, direction] = randomPositionAndDirection(prng)
            boar(position, direction)

            await wait(randomInt(prng, 3, 8))
        }

        done = true
    }

    async function spawnSheep() {
        const prng = PRng.new(333325)
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
        round15,
        round16,
        round17,
        round18,
        round19,

        //round20,
        round21,
        round22,
        round23,
        round24,
    ].map(round => async (props: RoundRunProps, components: RoundsSystemInputs) => {
        const roundInputs = useRoundInputs(props, components)
        await round(roundInputs)
        await roundInputs.wait(10)
    })
}