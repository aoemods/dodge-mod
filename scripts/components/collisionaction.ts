export type CollisionActionKillPlayer = {
    type: "killPlayer"
}

export type CollisionActionDamageBoss = {
    type: "damageBoss"
    amount: number
}

export type CollisionAction = CollisionActionKillPlayer | CollisionActionDamageBoss

export type CollisionActionComponent = {
    actions: CollisionAction[]
}
