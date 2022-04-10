import { Round, RoundBuilder } from "../components/rounds"
import { PRng } from "../core/prng"
import { randomInt } from "../core/util"
import { Vector2 } from "../core/vector2"

const velocityNormalPx: Vector2 = [1, 0]
const velocityNormalNx: Vector2 = [-1, 0]
const velocityNormalPy: Vector2 = [0, 1]
const velocityNormalNy: Vector2 = [0, -1]

function addSharedPostRound(builder: RoundBuilder) {
    builder.wait(10)
}

export function round1(): Round {
    const builder = new RoundBuilder()

    builder.sheep([25, 0], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, 0], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, 10], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, -10], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, -7], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, 7], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, 3], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, -3], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, 12], velocityNormalNx)
    builder.wait(1.5)
    builder.sheep([25, -11], velocityNormalNx)

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round2(): Round {
    const builder = new RoundBuilder()

    const seq = [
        -10, 8, -8, 2, -4, 12, 15, 9, -3, -1,
        -5, 0, -6, 3, 1, 6, -15, -7, 5,
        11, -2, 10, 4, -9, 7, -12, -11,
    ]

    for (let i = 0; i < seq.length; i++) {
        builder.sheep([-25, seq[i]], velocityNormalPx)
        builder.wait(0.7)
    }

    builder.wait(5)

    for (let i = 0; i < seq.length; i++) {
        builder.sheep([seq[i], 25], velocityNormalNy)
        builder.wait(0.7)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round3(): Round {
    const builder = new RoundBuilder()

    const seq = [
        -2, 10, 2, 1, -4, -5, 4, -12, 12, 0,
        -10, 6, 8, -11, 9, -8, -6, -1, 5, 7,
        11, 3, -3, -9, -7
    ]

    for (let i = 0; i < seq.length; i++) {
        builder.sheep([25, seq[i]], velocityNormalNx)
        builder.wait(0.3)
    }

    builder.wait(4)

    for (let i = 0; i < seq.length; i++) {
        builder.sheep([seq[i], -25], velocityNormalPy)
        builder.wait(0.3)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round4(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(4)

    for (let i = 0; i < 20; i++) {
        builder.sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        builder.wait(0.5)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.5)
    }

    builder.wait(10)

    for (let i = 0; i < 20; i++) {
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.5)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round5(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(5)

    for (let i = 0; i < 35; i++) {
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.8)
    }

    builder.wait(10)

    for (let i = 0; i < 35; i++) {
        builder.sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.8)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round6(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(6)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -3; j <= 3; j++) {
            builder.sheep([center + j, 25], velocityNormalNy)
        }
        builder.wait(1.5)
    }

    builder.wait(10)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            builder.sheep([center + j, 25], velocityNormalNy)
        }
        builder.wait(2)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round7(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(7)

    for (let i = 0; i < 30; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            builder.sheep([center + j, 25], velocityNormalNy)
        }
        builder.wait(0.5)
    }

    builder.wait(10)

    for (let i = 0; i < 30; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -1; j <= 1; j++) {
            builder.sheep([25, center + j], velocityNormalNx)
        }
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.5)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round8(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(8)

    for (let i = 0; i < 35; i++) {
        builder.sheep([randomInt(prng, -12, 12), -25], velocityNormalPy)
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.sheep([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        builder.wait(1.2)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round9(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(9)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            builder.sheep([center + j, 25], velocityNormalNy)
        }

        for (let j = 0; j < 2; j++) {
            builder.sheep([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        }

        builder.wait(2)
    }

    builder.wait(10)

    for (let i = 0; i < 15; i++) {
        const center = randomInt(prng, -12, 12)
        for (let j = -5; j <= 5; j++) {
            builder.sheep([center + j, -25], velocityNormalPy)
        }

        for (let j = 0; j < 3; j++) {
            builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        }

        builder.wait(1.5)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

// TODO: round10... bossround

export function round11(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(11)

    for (let i = 0; i < 16; i++) {
        builder.deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        builder.wait(0.5)
        builder.deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.5)
    }

    builder.wait(10)

    for (let i = 0; i < 16; i++) {
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
        builder.deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.sheep([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round12(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(12)

    for (let i = 0; i < 12; i++) {
        builder.deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
        builder.deer([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
        builder.wait(0.5)
    }

    builder.wait(10)

    for (let i = 0; i < 12; i++) {
        builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
        builder.deer([-25, randomInt(prng, -12, 12)], velocityNormalPx)
        builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        builder.wait(0.5)
    }

    builder.wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        }
        builder.wait(3)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round13(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(13)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            builder.deer([randomInt(prng, -12, 12), 25], velocityNormalNy)
        }
        builder.wait(3)
    }

    builder.wait(10)

    for (let i = 0; i < 8; i++) {
        for (let j = 0; j < 10; j++) {
            builder.deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
        }
        builder.wait(2)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function round14(): Round {
    const builder = new RoundBuilder()

    const prng = PRng.new(14)

    for (let i = 0; i < 20; i++) {
        for (let j = 0; j < 5; j++) {
            builder.sheep([25, randomInt(prng, -12, 12)], velocityNormalNx)
            builder.wait(0.3)
        }

        builder.deer([randomInt(prng, -12, 12), -25], velocityNormalPy)
    }

    addSharedPostRound(builder)

    return {
        steps: builder.steps
    }
}

export function getRounds(): Round[] {
    return [
        round1(),
        round2(),
        round3(),
        round4(),
        round5(),
        round6(),
        round7(),
        round8(),
        round9(),
        round11(),
        round12(),
        round13(),
        round14(),
    ]
}