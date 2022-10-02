const bleno = require("bleno")

bleno.on("stateChange", (state) => {
    if(state == "poweredOn"){
        console.log("started advertising")
        bleno.startAdvertising("TestBleServer", "0425b4be-ebba-4903-96d0-8663974f2123")
    } else {
        console.log("stopped advertising")
        bleno.stopAdvertising()
    }
})

bleno.on("accept", (address) => {
    console.log("accepted connection with " + address)
})

bleno.on("disconnect", (address) => {
    console.log("disconnected from " + address)
})

bleno.on("advertisingStart", (err) => {
    if(err){
        console.warn(err)
    } else {
        console.log("success advertising")

        bleno.setServices([
            new bleno.PrimaryService({
                uuid: "0425b4be-ebba-4903-96d0-8663974f2123",
                characteristics: [
                    new bleno.Characteristic({
                        value: null,
                        uuid: "d6dde2c2-71c3-4907-9232-de076f48f8a9",
                        properties: [ "read", "write" ],
                        onReadRequest: (offset, callback) => {
                            console.log("read")
                            callback(this.RESULT_SUCCESS, Buffer.from("hello"))
                        },
                        onWriteRequest: (data, offset, shouldRespond, callback) => {
                            console.log("write " + data)
                            callback(this.RESULT_SUCCESS)
                        }
                    })
                ]
            })
        ])
    }
})