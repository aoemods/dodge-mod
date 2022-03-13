export type Vector2 = [number, number]

export function add(a: Vector2, b: Vector2): Vector2 {
    return [
        a[0] + b[0],
        a[1] + b[1]
    ]
}

export function addInline(a: Vector2, b: Vector2) {
    a[0] += b[0]
    a[1] += b[1]
}

export function scale(a: Vector2, s: number): Vector2 {
    return [
        a[0] * s,
        a[1] * s
    ]
}

export function scaleInline(a: Vector2, s: number) {
    a[0] *= s
    a[1] *= s
}

export function distanceSquared(a: Vector2, b: Vector2) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    return dx * dx + dy * dy
}