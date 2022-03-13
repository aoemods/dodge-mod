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
            makeStepSpawnProjectile([25, 13], [-10, 0]),
            makeStepWait(1.5),
            makeStepSpawnProjectile([25, -13], [-10, 0]),
            makeStepWait(5),
        ]
    }
}

export function round2(): Round {
    const steps: RoundStep[] = []

    for (let i = 0; i < 10; i++) {
        steps.push(makeStepSpawnProjectile([-25, i * 4 - 20], [10, 0]))
        steps.push(makeStepSpawnProjectile([-25, i * 4 - 17], [10, 0]))
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

        steps.push(makeStepSpawnProjectile([i * 4 - 20, -25], [0, 10]))
        steps.push(makeStepWait(0.5))
    }

    steps.push(makeStepWait(5))

    for (let i = 0; i < 10; i++) {
        steps.push(makeStepSpawnProjectile([-25, i * 4 - 20], [10, 0]))
        steps.push(makeStepSpawnProjectile([25, i * 4 - 18], [-10, 0]))
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
        -5, 0, -6, -14, 13, 3, 1, 6, -15, -7,
        5, 11, -2, 10, 4, -9, 7, 14, -12, -11,
        -13
    ]

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([-25, seq[i]], [10, 0]))
        steps.push(makeStepWait(0.5))
    }

    for (let i = 0; i < seq.length; i++) {
        steps.push(makeStepSpawnProjectile([seq[i], 25], [0, -10]))
        steps.push(makeStepWait(0.5))
    }

    steps.push(makeStepWait(5))

    return {
        steps
    }
}