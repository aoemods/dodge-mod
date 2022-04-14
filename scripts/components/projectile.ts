import { Vector2 } from "../core/vector2"

export type ProjectileComponent = {
    velocity: Vector2
    fade?: {
        period: number
        dutyCycle: number
    }
}