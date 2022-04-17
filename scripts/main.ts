import { GameModeRounds } from "./game/gamemode"

print("Loading script")

importScar("MissionOMatic/MissionOMatic.scar")

// We need to define global functions which MissionOMatic will call.
// For that we can set variables on globalThis.
const g = globalThis as any

g.Mission_Start = () => {
    print(`Creating game mode with ${Object.values(PLAYERS).length} players`)
    const gameMode = new GameModeRounds(PLAYERS)
    print("Game mode components:")
    for (const [k, v] of Object.entries(gameMode.components)) {
        print(`## ${k}: ${v}`)
    }

    gameMode.onInit()
}

// Without this the game will crash as MissionOMatic tries to call it
g.GetRecipe = () => {
    print("GetRecipe() called")
    return {}
}

print("Script loaded")
