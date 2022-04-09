import { Vector2 } from "./vector2"
import { Vector3 } from "./vector3"

export function getSquadGroupEntity(squadGroup: SGroupID) {
    return Squad_EntityAt(SGroup_GetSpawnedSquadAt(squadGroup, 1), 0)
}

export type SpawnEntityOptions = {
    unselectable?: boolean
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