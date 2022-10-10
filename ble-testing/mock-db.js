const fs = require("fs")

// don't really care about performance of system read/write so call this before every interaction
const init = () => {
    if(fs.existsSync("./data/store.json")){
        const data = fs.readFileSync("./data/store.json", { encoding: "utf8" })
        try {
            JSON.parse(data)
        } catch(e){
            // corrupted database, store just in case and populate a new empty one
            fs.writeFileSync("./data/store-" + Date.now().toString() + ".json", data, { encoding: "utf8" })
            fs.writeFileSync("./data/store.json", JSON.stringify([]), { encoding: "utf8" })
        }
    } else {
        fs.writeFileSync("./data/store.json", JSON.stringify([]), { encoding: "utf8" })
    }
}

const writeData = (data) => {
    init()

    const fileData = fs.readFileSync("./data/store.json", { encoding: "utf8" })
    const json = JSON.parse(fileData)

    // merge rather than double write entries
    data.forEach(newEntry => {
        let hasEntryId = false
        json.forEach(existingEntry => {
            if(newEntry.id == existingEntry.id){
                hasEntryId = true
            }
        })
        if(!hasEntryId){
            json.push(newEntry)
        }
    })

    fs.writeFileSync("./data/store.json", JSON.stringify(json), { encoding: "utf8" })
}

const readData = () => {
    init()

    const fileData = fs.readFileSync("./data/store.json", { encoding: "utf8" })
    const json = JSON.parse(fileData)
    
    return json
}

module.exports = { writeData, readData }