const bleno = require("bleno")

const { writeData, readData } = require("./mock-db")

bleno.on("stateChange", (state) => {
    if(state == "poweredOn"){
        console.log("*** Power On")
        
        bleno.startAdvertising("test", [ "0425b4beebba490396d08663974f2123" ], (err) => {
            if(err){
                console.warn("*** Error", err)
            }
        })
    } else {
        console.log("*** Power Off")

        bleno.stopAdvertising()
    }
})

bleno.on("advertisingStart", (err) => {
    if(err){
        console.warn(err)
    } else {
        console.log("*** success advertising")

        // TODO: major concurrency issues possible here
        // TODO: implement buffer size write header for performance benefits (no json) and accuracy
        // TODO: does it make sense to implement a timeout after 1 second?
        let currentBuffer = ""

        bleno.setServices([
            new bleno.PrimaryService({
                uuid: "0425b4beebba490396d08663974f2123",
                characteristics: [
                    new bleno.Characteristic({
                        uuid: "d6dde2c271c349079232de076f48f8a9",
                        properties: [ "read", "write" ],
                        onReadRequest: (offset, callback) => {
                            console.log("*** read")

                            // TODO: test read data functionality

                            callback(bleno.Characteristic.RESULT_SUCCESS, Buffer.from(""))
                        },
                        onWriteRequest: (data, offset, shouldRespond, callback) => {
                            // TODO: very likely other decoding issues will occur, look into properly decoding from ascii to utf8
                            currentBuffer += data.toString().replace(/\x19/g,"'")

                            if(currentBuffer.length != 0 && currentBuffer[currentBuffer.length - 1] == "]"){
                                try {
                                    const bufferObjectData = JSON.parse(currentBuffer)

                                    console.log("*** Finished Receiving Data")

                                    writeData(bufferObjectData)

                                    currentBuffer = ""
                                } catch(e){}
                            }
                            callback(bleno.Characteristic.RESULT_SUCCESS)
                        }
                    })
                ]
            })
        ])
    }
})