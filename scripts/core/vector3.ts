export type Vector3 = [number, number, number]

export function add(a: Vector3, b: Vector3): Vector3 {
    return [
        a[0] + b[0],
        a[1] + b[1],
        a[2] + b[2],
    ]
}

export function addInline(a: Vector3, b: Vector3) {
    a[0] += b[0]
    a[1] += b[1]
    a[2] += b[2]
}

export function scale(a: Vector3, s: number): Vector3 {
    return [
        a[0] * s,
        a[1] * s,
        a[2] * s,
    ]
}

export function scaleInline(a: Vector3, s: number) {
    a[0] *= s
    a[1] *= s
    a[2] *= s
}

export function distanceSquared(a: Vector3, b: Vector3) {
    const dx = a[0] - b[0]
    const dy = a[1] - b[1]
    const dz = a[2] - b[2]
    return dx * dx + dy * dy + dz * dz
}