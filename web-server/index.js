import { PrismaClient } from "@prisma/client"
const prisma = new PrismaClient()
import bleno from "bleno"
import express from "express"

import schema from "./schema.json"

const uploadForms = (forms) => {
  forms.forEach((form) => {
    prisma.form.findFirst({ where: { id: form.id } }).then((found) => {
      if(found == null){
        prisma.form.create({ data: {
          id: form.id,
          type: form.type,
          inputs: JSON.stringify(form.inputs)
        }})
      }
    })
  })
}

bleno.on("stateChange", (state) => {
  if(state == "poweredOn"){
    bleno.startAdvertising("lancer-scout", [ "0425b4beebba490396d08663974f2123" ], (err) => {
      if(err){
        console.warn(err)
      }
    })
  } else {
    bleno.stopAdvertising()
  }
})

bleno.on("advertisingStart", (err) => {
  if(err){
    console.warn(err)
  } else {
    let instreamWriteBuffer = ""

    const schemaString = JSON.stringify(schema)
    const schemaChunkCharacteristics = []
    for(let i = 0;i<Math.ceil(schemaString.length / 23);i++){
      const chunkIndexString = new Array(4 - i.toString().length).fill("0").join("") + i.toString()
      const chunkBuffer = Buffer.from(schemaString.slice(23 * i, 23 * (i + 1)))
      schemaChunkCharacteristics.push(new bleno.Characteristic({
        uuid: "19995b5d7e8e42119e3f38428d42" + chunkIndexString,
        properties: [ "read" ],
        value: chunkBuffer
      }))
    }

    bleno.setServices([
      new bleno.PrimaryService({
        uuid: "0425b4beebba490396d08663974f2123",
        characteristics: [
          new bleno.Characteristic({
            uuid: "d6dde2c2-71c349079232de076f48f8a9",
            properties: [ "write", "writeWithoutResponse" ],
            onWriteRequest: (data, offset, withoutResponse, callback) => {
              instreamWriteBuffer += data.toString().replace(/\x19/g, "'")
              if(instreamWriteBuffer.length != 0 && instreamWriteBuffer.endsWith("]")){
                try {
                  const instreamWriteObject = JSON.parse(instreamWriteBuffer)
                  uploadForms(instreamWriteObject)
                  instreamWriteBuffer = ""
                } catch(_){}
              }
              callback(bleno.Characteristic.RESULT_SUCCESS)
            }
          }),
          new bleno.Characteristic({
            uuid: "95df9c18c01d489eaf1863df799ae7d3",
            properties: [ "read" ],
            value: Buffer.from(schemaChunkCharacteristics.length.toString())
          }),
          ...schemaChunkCharacteristics
        ]
      })
    ])
  }
})

const bootstrap = async () => {
  const app = express()

  app.use(express.json())

  app.route("/").get((req, res) => {
    // TODO: return react build dir
    res.send("Hello World!")
  })

  app.route("/delete").get((req, res) => {
    prisma.form.deleteMany().then(() => {
      res.send("Deleted")
    })
  })

  app.route("/forms").get((req, res) => {
    prisma.form.findMany().then((forms) => {
      res.send(JSON.parse(JSON.stringify(forms, (key, value) => typeof value == "bigint" ? value.toString() : value)))
    })
  })

  app.listen(8080, () => console.log("\nRunning Lancer Scout Server\n"))
}

bootstrap()
  // why disconnect on server created?
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })