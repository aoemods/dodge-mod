import { Task } from "../core/tasks"
import { Vector2 } from "../core/vector2"
import * as v2 from "../core/vector2"
import { pbgs } from "../constants"

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

export type RoundStepSpawnBoss = {
    type: "spawnBoss"
    pbg: string
}

export type RoundStepSpawnProjectile = {
    type: "spawnProjectile"
    position: Vector2
    velocity: Vector2
    pbg: string
}

export type RoundStepWait = {
    type: "wait"
    time: number
}

export type RoundStep = RoundStepSpawnBoss | RoundStepSpawnProjectile | RoundStepWait

export type Round = {
    steps: RoundStep[]
}

export class RoundBuilder {
    private _steps: RoundStep[] = []

    sheep(position: Vector2, direction: Vector2) {
        this.projectile(ProjectileType.Sheep, position, direction)
    }

    wolf(position: Vector2, direction: Vector2) {
        this.projectile(ProjectileType.Wolf, position, direction)
    }

    deer(position: Vector2, direction: Vector2) {
        this.projectile(ProjectileType.Deer, position, direction)
    }

    boar(position: Vector2, direction: Vector2) {
        this.projectile(ProjectileType.Boar, position, direction)
    }

    projectile(type: ProjectileType, position: Vector2, direction: Vector2) {
        const { pbg, speed } = projectileTypeData[type]
        const velocity = v2.scale(direction, speed)
        this._steps.push({
            type: "spawnProjectile",
            position,
            velocity,
            pbg,
        })
    }

    boss(pbg: string) {
        this._steps.push({
            type: "spawnBoss",
            pbg,
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
