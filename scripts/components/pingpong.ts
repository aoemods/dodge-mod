import { Vector2 } from "../core/vector2"

export type PingPongComponent = {
    speed: number
    goingTo: "a" | "b"
    positionA: Vector2
    positionB: Vector2
}