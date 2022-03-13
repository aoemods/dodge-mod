const fs = require("fs")
const path = require("path")

const inPath = "scar"
const outPath = process.argv[2]

const inFile = path.join(inPath, "main.lua")

const inFileText = fs.readFileSync(inFile, "utf-8")
const outFileText = inFileText.replaceAll("importScar", "import")

const outFile = path.join(outPath, "toratest.scar")
console.log(inFile, "->", outFile)

fs.writeFileSync(outFile, outFileText)