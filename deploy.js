const fs = require("fs")
const path = require("path")
require("dotenv").config()

const outPath = process.env["AOE4_SCAR_PATH"]

if (!outPath) {
    console.error("Copy or rename the .env.example file to .env file and set its output path to where you want the generated script to be.")
    process.exit(1)
}

const inPath = path.join("scripts-generated", "main.lua")

if (!fs.existsSync(inPath)) {
    console.error(`Input path ${inPath} does not exist, maybe tstl did not run yet.`)
    process.exit(2)
}

const inFileText = fs.readFileSync(inPath, "utf-8")
const outFileText = inFileText.replaceAll("importScar", "import")

console.log(inPath, "->", outPath)

fs.writeFileSync(outPath, outFileText)