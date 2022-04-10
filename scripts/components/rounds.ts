import { Task } from "../core/tasks"
import { Vector2 } from "../core/vector2"
import { RoundsSystemInputs } from "../systems/rounds"

export type RoundRunProps = {
    stopped: boolean
}

export type Round = (state: RoundRunProps, components: RoundsSystemInputs) => Promise<void>

export type RoundsComponent = {
    currentRound: number
    timeBetweenRounds: number,
    bounds: { min: Vector2, max: Vector2 },
    state: "init" | "waiting" | "inProgress" | "finished"
    rounds: Round[]
    currentRoundRunProps?: RoundRunProps
    currentTask?: Task
}
