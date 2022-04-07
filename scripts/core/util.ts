import { Vector2 } from "./vector2"

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

export function vectorToPosition(v: Vector2, height?: number): Position {
    const [x, y] = v

    let h = World_GetHeightAt(x, y)
    if (height) {
        h += height
    }

    return World_Pos(x, h, y)
}