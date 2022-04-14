import { Vector2 } from "./vector2"
import { Vector3 } from "./vector3"
import { PRng } from "./prng"

export function getSquadGroupEntity(squadGroup: SGroupID) {
    return Squad_EntityAt(SGroup_GetSpawnedSquadAt(squadGroup, 1), 0)
}

export type SpawnEntityOptions = {
    unselectable?: boolean
    targetingType?: TargetingType
}

let nextEntityId = 0
export function spawnEntity(playerOwner: Player, position: Position, pbg: string, options?: SpawnEntityOptions) {
    let dummySquadBlueprint: SquadBlueprint = BP_GetSquadBlueprint(pbg)

    const squadGroup = SGroup_CreateIfNotFound(`sg_${nextEntityId++}`)
    UnitEntry_DeploySquads(playerOwner.id, squadGroup, [{
        sbp: dummySquadBlueprint, numSquads: 1
    }], position)

    if (options?.unselectable) {
        SGroup_SetSelectable(squadGroup, false)
    }

    if (options?.targetingType !== undefined) {
        SGroup_SetTargetingType(squadGroup, options.targetingType)
    }

    return getSquadGroupEntity(squadGroup)
}

export function vector2ToPosition(v: Vector2, height?: number): Position {
    const [x, y] = v

    let h = World_GetHeightAt(x, y)
    if (height) {
        h += height
    }

    return World_Pos(x, h, y)
}

export function positionToVector2(position: Position): Vector2 {
    return [position.x, position.z]
}

export function copyPositionToVector2(vector: Vector2, position: Position) {
    vector[0] = position.x
    vector[1] = position.z
}

export function vector3ToPosition(v: Vector3): Position {
    const [x, y, z] = v
    return World_Pos(x, y, z)
}

export function positionToVector3(position: Position): Vector3 {
    return [position.x, position.y, position.z]
}

export function copyPositionToVector3(vector: Vector3, position: Position) {
    vector[0] = position.x
    vector[1] = position.y
    vector[2] = position.z
}

/**
 * Returns a random integer in a range.
 * @param min Minimum value (inclusive)
 * @param max Maximum value (inclusive)
 * @returns Random integer between min (inclusive) and max (inclusive).
 */
export function randomInt(prng: PRng, min: number, max: number) {
    const range = (max - min) + 1
    return (prng.get_random_32() % range) + min
}

export function showNotification(message: string) {
    UI_CreateEventCue(message, undefined, "", "", "sfx_ui_event_queue_high_priority_play")
}
