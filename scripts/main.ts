import { GameMode, GameModeWarlock } from "./game/gamemode"

importScar("cardinal.scar")
importScar("ScarUtil.scar")

const g = globalThis as any
Core_RegisterModule("Mod")

g.Mod_OnInit = () => {
    print(`Creating game mode with ${Object.values(g.PLAYERS).length} players`)
    const gameMode = new GameModeWarlock(g.PLAYERS)
    print("Game mode components:")
    for (const [k, v] of Object.entries(gameMode.components)) {
        print(`## ${k}: ${v}`)
    }
    gameMode.onInit()
}
