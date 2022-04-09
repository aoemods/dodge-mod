export enum EntitySyncProperty {
    None = 0,
    Position = 1,
    Heading = 2,
}

export type AoeEntityComponent = {
    entityId: EntityID
    height?: number
    syncMode?: "master" | "slave"
    syncProperties?: EntitySyncProperty
}
