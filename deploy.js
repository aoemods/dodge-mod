const fs = require("fs")
const path = require("path")
require("dotenv").config()

const outPath = path.join("assets", "scenarios", "multiplayer", "100-rounds", "100-rounds.scar")

const inPath = path.join("scripts-generated", "main.lua")

if (!fs.existsSync(inPath)) {
    console.error(`Input path ${inPath} does not exist, maybe tstl did not run yet.`)
    process.exit(2)
}

const inFileText = fs.readFileSync(inPath, "utf-8")
const outFileText = inFileText.replaceAll("importScar", "import")

console.log(inPath, "->", outPath)

fs.writeFileSync(outPath, outFileText)