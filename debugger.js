const net = require("net")
const fs = require("fs")
const readline = require("readline").createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Connecting...")
const client = new net.Socket()

let allData = Buffer.alloc(0)

let getglobalscalled = false

const fileStream = fs.createWriteStream("dbg.txt", { flags: "a" })

client.on("data", data => {
    allData = allData + data

    while (allData.length >= 8) {
        const messageSize = data.readUInt32LE(0)
        if (allData.length >= 8 + messageSize) {
            const message = allData.toString("utf-8", 8, 8 + messageSize)
            fileStream.write(message + "\n")

            if (!getglobalscalled && message.includes("STACK")) {
                console.log("Sending GETGLOBALS")
                client.write("GETGLOBALS\r")
                getglobalscalled = true
            }

            allData = allData.slice(8 + messageSize, 8 + messageSize + allData.length)
        } else {
            break
        }
    }
})

client.on("close", () => {
    console.log("Connection closed");
})

client.connect({
    host: "127.0.0.1",
    port: 8081,
}, () => {
    console.log("Connected")
})

/*nextInput = true
function maybeGetInput() {
    if (nextInput) {
        nextInput = false
        readline.question("Cmd:", cmd => {
            console.log("Sending", cmd)
            console.log(client.write(cmd + "\r"))
            nextInput = true
        })
    }
}

setInterval(maybeGetInput, 100)*/