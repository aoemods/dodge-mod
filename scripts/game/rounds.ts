import { makeStepSpawnProjectile, makeStepWait, Round, RoundStep } from "../components/rounds"

export function round1(): Round {
    return {
        steps: [
            makeStepSpawnProjectile([25, 0], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, 0], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, 10], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, -10], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, -7], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, 7], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, 3], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, -3], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, 12], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, -11], [-10, 0]),
            makeStepWait(5),
        ]
    }
}

export function round2(): Round {
    const steps: RoundStep[] = []

    for (let i = 0; i < 10; i++) {
        steps.push(makeStepSpawnProjectile([-25, i * 4 - 20], [10, 0]))
        if (i % 2 === 0) {
            steps.push(makeStepSpawnProjectile([-25, i * 4 - 17], [10, 0]))
        }
        steps.push(makeStepWait(1.2))
    }

    steps.push(makeStepWait(3))

    return {
        steps
    }
}

export function round3(): Round {
    const steps: RoundStep[] = []

    for (let i = 0; i < 10; i++) {
        steps.push(makeStepSpawnProjectile([-25, i * 4 - 20], [10, 0]))
        steps.push(makeStepWait(0.5))

        if (i % 3 === 0) {
            steps.push(makeStepSpawnProjectile([i * 4 - 20, -25], [0, 10]))
            steps.push(makeStepWait(0.5))
        }
    }

    steps.push(makeStepWait(3))

    for (let i = 0; i < 8; i++) {
        steps.push(makeStepSpawnProjectile([-25, i * 5 - 20], [10, 0]))
        if (i % 2 === 0) {
            steps.push(makeStepSpawnProjectile([25, i * 5 - 18], [-10, 0]))
        }
        steps.push(makeStepWait(0.5))
    }

    steps.push(makeStepWait(5))

    return {
        steps
    }
}

export function round4(): Round {
    const steps: RoundStep[] = []

    const seq = [
        -10, 8, -8, 2, -4, 12, 15, 9, -3, -1,
        -5, 0, -6, 3, 1, 6, -15, -7, 5,
        11, -2, 10, 4, -9, 7, -12, -11,
    ]

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([-25, seq[i]], [10, 0]))
        steps.push(makeStepWait(0.5))
    }

    steps.push(makeStepWait(2))

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([seq[i], 25], [0, -10]))
        steps.push(makeStepWait(0.5))
    }

    steps.push(makeStepWait(5))

    return {
        steps
    }
}

export function round5(): Round {
    const steps: RoundStep[] = []

    const seq = [
        -2, 10, 2, 1, -4, -5, 4, -12, 12, 0,
        -10, 6, 8, -11, 9, -8, -6, -1, 5, 7,
        11, 3, -3, -9, -7
    ]

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([25, seq[i]], [-10, 0]))
        steps.push(makeStepWait(0.3))
    }

    steps.push(makeStepWait(2))

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([seq[i], -25], [0, 10]))
        steps.push(makeStepWait(0.3))
    }

    steps.push(makeStepWait(5))

    return {
        steps
    }
}

export function getRounds(): Round[] {
    return [
        round1(),
        round2(),
        round3(),
        round4(),
        round5(),
    ]
}