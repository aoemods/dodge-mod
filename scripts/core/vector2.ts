export type Vector2 = [number, number]

export function add(a: Vector2, b: Vector2): Vector2 {
    return [
        a[0] + b[0],
        a[1] + b[1]
    ]
}

export function sub(a: Vector2, b: Vector2): Vector2 {
    return [
        a[0] - b[0],
        a[1] - b[1]
    ]
}

export function addInline(a: Vector2, b: Vector2) {
    a[0] += b[0]
    a[1] += b[1]
}

export function subInline(a: Vector2, b: Vector2) {
    a[0] -= b[0]
    a[1] -= b[1]
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

export function lengthSquared(a: Vector2) {
    return a[0] * a[0] + a[1] * a[1]
}

export function length(a: Vector2) {
    return Math.sqrt(a[0] * a[0] + a[1] * a[1])
}

export function distanceSquared(a: Vector2, b: Vector2) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    return dx * dx + dy * dy
}

export function normalizeSafe(a: Vector2) {
    const l = length(a)

    if (Math.abs(l) > 1e-5) {
        a[0] /= l
        a[1] /= l
    } else {
        a[0] = 0
        a[1] = 0
    }
}
export function getNormalizedSafe(a: Vector2) {
    const normalized: Vector2 = [...a]
    normalizeSafe(normalized)
    return normalized
}
