// import { PrismaClient } from "@prisma/client"
// const prisma = new PrismaClient()
// import bleno from "bleno"
// import express from "express"

// import schema from "./schema.json"

// console.log("run")

// const uploadForms = (forms: any) => {
//   console.log("Uploading forms to database:")
//   console.log({ forms })

//   const uploadForm = (index: number) => {
//     if(index < forms.length){
//       prisma.form.upsert({
//         where: { id: forms[index].id },
//         update: forms[index],
//         create: forms[index]
//       }).then(() => {
//         uploadForm(index + 1)
//       })
//     }
//   }
  
//   uploadForm(0)
// }

// bleno.on("stateChange", (state) => {
//   if(state == "poweredOn"){
//     bleno.startAdvertising("lancer-scout", [ "0425b4beebba490396d08663974f2123" ], (err) => {
//       if(err){
//         console.warn(err)
//       }
//     })
//   } else {
//     bleno.stopAdvertising()
//   }
// })

// bleno.on("advertisingStart", (err) => {
//   if(err){
//     console.warn(err)
//   } else {
//     let instreamWriteBuffer = ""

//     bleno.setServices([
//       new bleno.PrimaryService({
//         uuid: "0425b4beebba490396d08663974f2123",
//         characteristics: [
//           new bleno.Characteristic({
//             uuid: "d6dde2c271c349079232de076f48f8a9",
//             properties: [ "read", "write" ],
//             onReadRequest: (offset, callback) => {
//               callback(bleno.Characteristic.RESULT_SUCCESS, Buffer.from(JSON.stringify(schema)))
//             },
//             onWriteRequest: (data, offset, withoutResponse, callback) => {
//               instreamWriteBuffer += data.toString().replace(/\x19/g, "'")
//               if(instreamWriteBuffer.length != 0 && instreamWriteBuffer.endsWith("]")){
//                 try {
//                   const instreamWriteObject = JSON.parse(instreamWriteBuffer)
//                   uploadForms(instreamWriteObject)
//                   instreamWriteBuffer = ""
//                 } catch(_){}
//               }
//               callback(bleno.Characteristic.RESULT_SUCCESS)
//             }
//           })
//         ]
//       })
//     ])
//   }
// })

// const bootstrap = async () => {
//   const app = express()

//   app.use(express.json())

//   app.route("/queryForms").post(async (req, res) => {
//     try {
//       const forms = await prisma.form.findMany({ where: req.body })

//       res.json({
//         success: true,
//         forms
//       })
//     } catch(error){
//       res.json({
//         success: false,
//         error
//       })
//     }
//   })

//   app.listen(8080, () => console.log("Running Lancer Scout Server"))
// }

// bootstrap()
//   // why disconnect on server created?
//   .then(async () => {
//     await prisma.$disconnect()
//   })
//   .catch(async (e) => {
//     console.error(e)
//     await prisma.$disconnect()
//     process.exit(1)
//   })