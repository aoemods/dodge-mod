import { Task } from "../core/tasks"
import { Vector2 } from "../core/vector2"

export type RoundStepSpawnProjectile = {
    type: "spawnProjectile"
    position: Vector2
    velocity: Vector2
}

export type RoundStepWait = {
    type: "wait"
    time: number
}

export type RoundStep = RoundStepSpawnProjectile | RoundStepWait

export type Round = {
    steps: RoundStep[]
}

export function makeStepSpawnProjectile(position: Vector2, velocity: Vector2): RoundStepSpawnProjectile {
    return {
        type: "spawnProjectile",
        position,
        velocity,
    }
}

export function makeStepWait(time: number): RoundStepWait {
    return {
        type: "wait",
        time,
    }
}

export type RoundsComponent = {
    currentRound: number
    remainingSteps: RoundStep[]
    timeBetweenRounds: number,
    bounds: { min: Vector2, max: Vector2 },
    state: "init" | "waiting" | "inProgress" | "finished"
    rounds: Round[]
    currentTask?: Task
}
