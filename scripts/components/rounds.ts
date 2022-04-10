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

export class RoundBuilder {
    private _steps: RoundStep[] = []

    spawnProjectile(position: Vector2, velocity: Vector2) {
        this._steps.push({
            type: "spawnProjectile",
            position,
            velocity,
        })
    }

    wait(time: number) {
        this._steps.push({
            type: "wait",
            time,
        })

        Encounter.ClearGoal()
    }

    get steps(): RoundStep[] {
        return [...this._steps]
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
