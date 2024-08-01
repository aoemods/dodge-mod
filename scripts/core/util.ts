import { Vector2 } from "./vector2"
import * as v2 from "./vector2"
import { Vector3 } from "./vector3"
import { PRng } from "./prng"

export function getSquadGroupEntity(squadGroup: SGroupID): EntityID {
    const sq = SGroup_GetSpawnedSquadAt(squadGroup, 1)
    // const et = Squad_EntityAt(sg, 0)
    const entity = Squad_GetFirstEntity(sq)
    return entity
}

export type SpawnEntityOptions = {
    unselectable?: boolean
    targetingType?: TargetingType
    invulnerable?: boolean
}

let nextEntityId = 0
/**
 * Spawn a SquadGroup
 * @param playerOwner 
 * @param position 
 * @param pbg should be sbp
 * @param options 
 * @returns SGROUPID
 */
export function spawnSquadGroup(
    playerOwner: Player,
    position: Position,
    pbg: string,
    options?: SpawnEntityOptions
): SGroupID {
    // @bug 报错
    let dummySquadBlueprint: SquadBlueprint = BP_GetSquadBlueprint(pbg)

    const squadGroup = SGroup_CreateIfNotFound(`sg_${nextEntityId++}`)
    UnitEntry_DeploySquads(
        playerOwner.id,
        squadGroup,
        [
            {
                sbp: dummySquadBlueprint,
                num_squads: 1,
            },
        ],
        position
    )

    if (options?.unselectable) {
        SGroup_SetSelectable(squadGroup, false)
        Entity_SetExtEnabled(getSquadGroupEntity(squadGroup), EXTID_MovementBlocker, false)
        Entity_SetExtEnabled(getSquadGroupEntity(squadGroup), EXTID_Moving, false)
    }

    if (options?.targetingType !== undefined) {
        SGroup_SetTargetingType(squadGroup, options.targetingType)
    }

    if (options?.invulnerable !== false) {
        SGroup_SetInvulnerable(squadGroup, true)
    }

    return squadGroup
}

export function spawnEntity(
    playerOwner: Player,
    position: Position,
    pbg: string,
    options?: SpawnEntityOptions
): EntityID {
    return getSquadGroupEntity(spawnSquadGroup(playerOwner, position, pbg, options))
}

export function makeVerticalLine(center: Vector2, offset: Vector2, count: number): Vector2[] {
    const positions: Vector2[] = []

    const startIndex = -Math.floor(count / 2) // eg. 2: -1, 0; 3: -1, 0, 1
    for (let i = startIndex; i < startIndex + count; i++) {
        positions.push(v2.add(center, v2.scale(offset, i)))
    }

    return positions
}

export function makeHorizontalLine(center: Vector2, offset: Vector2, count: number): Vector2[] {
    const sideward: Vector2 = [-offset[1], offset[0]]
    return makeVerticalLine(center, sideward, count)
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
    const range = max - min + 1
    return (prng.get_random_32() % range) + min
}

export function showNotification(message: string) {
    UI_CreateEventCue(message, undefined, "", "", "sfx_ui_event_queue_high_priority_play")
}

export function isEntityValidAndAlive(entityId: EntityID) {
    return Entity_IsValid(entityId.EntityID) && Entity_IsAlive(entityId)
}
