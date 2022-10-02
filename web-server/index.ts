import { PrismaClient, Prisma } from "@prisma/client";
import express from "express";
import morgan from "morgan";
import bleno from "bleno";
import { BluetoothRequest } from "./types";

const PORT = process.env.PORT ?? 8080;

const prisma = new PrismaClient();

console.log("Starting scouting server....");

let advertising = false;

bleno.on("advertisingStart", (err) => {
  if (err) {
    console.error(`BLUETOOTH ERROR: ${err}`);
  } else {
    advertising = true;
  }
});

bleno.on("advertisingStop", () => {
  advertising = false;
});

bleno.on("accept", (address) => {
  console.log("accepted connection with " + address);
});

bleno.on("disconnect", (address) => {
  console.log("disconnected from " + address);
});

const startBlenoServer = () => {
  bleno.on("stateChange", (state) => {
    if (state == "poweredOn") {
      console.log("Advertising started");
      bleno.startAdvertising("robolancers-scouting-ble-server", [
        "4d959935-6272-4145-a913-473cd61724df",
      ]);
      return true;
    } else {
      console.log("Stopping advertising....");
      bleno.stopAdvertising(() => {
        console.log("BLUETOOTH: Stopped advertising");
      });
      return false;
    }
  });
};
type MutateReturn = {
  created: {
    schema?: any;
    scout?: any;
  };
  updated: {
    schema?: any;
    scout?: any;
  };
  m: string;
  error: string;
};
const mutateDb = async (
  data: Buffer,
  callback
): Promise<Partial<MutateReturn>> => {
  try {
    const processed = JSON.parse(data.toString()) as BluetoothRequest;

    switch (processed.data.type) {
      case "SCHEMA": {
        let schema;
        switch (processed.method) {
          case "CREATE": {
            schema = await prisma.schema.create({
              data: {
                ...(processed.data.raw as Prisma.SchemaCreateInput),
              },
            });

            // using 1 for success
            callback(1);
            return {
              created: {
                schema,
              },
            };
          }
          case "UPDATE": {
            schema = await prisma.schema.update({
              where: {
                id: processed.data.id,
              },
              data: {
                ...(processed.data.raw as Prisma.SchemaUpdateInput),
              },
            });
            // using 1 for success
            callback(1);

            return {
              updated: {
                schema,
              },
            };
          }
        }
      }
      case "SCOUT": {
        let scout;
        switch (processed.method) {
          case "CREATE": {
            scout = await prisma.scouts.create({
              data: {
                ...(processed.data.raw as Prisma.ScoutsCreateInput),
              },
            });

            // using 1 for success
            callback(1);

            return {
              created: {
                scout,
              },
            };
          }
          case "UPDATE": {
            scout = await prisma.scouts.update({
              where: {
                id: processed.data.id,
              },
              data: {
                ...(processed.data.raw as Prisma.ScoutsUpdateInput),
              },
            });

            // using 1 for success
            callback(1);

            return {
              updated: {
                scout,
              },
            };
          }
        }
      }
      default: {
        // using 0 for mismatched type
        callback(0);
        return {
          m: "Incorrect type provided",
        };
      }
    }
  } catch (error) {
    // 2 is error
    callback(2);
    return {
      error,
    };
  }
};
const bootstrap = async () => {
  const app = express();

  app.use(morgan());
  app.use(express.json());

  app.route("/uploadSchema").post(async (req, res) => {
    try {
      const schema = await prisma.schema.create({
        data: {
          ...req.body,
        },
      });

      res.json({
        schema,
      });
    } catch (error) {
      res.json({
        error,
      });
    }
  });

  app.get("/getSchema/:id", async (req, res) => {
    const { id } = req.params;

    try {
      if (!id) {
        return res.json({
          m: "No ID provided",
        });
      }
      const schema = await prisma.schema.findUniqueOrThrow({
        where: {
          id: parseInt(id.toString()),
        },
      });

      res.json({
        schema,
      });
    } catch (error) {
      console.log(error);
      res.json({
        error,
      });
    }
  });

  app.get("/getScout/:id", async (req, res) => {
    const { id } = req.params;
    try {
      return res.json({
        scout: await prisma.scouts.findUniqueOrThrow({
          where: {
            id: parseInt(id),
          },
        }),
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/uploadScout", async (req, res) => {
    const { scout } = req.body;
    try {
      return res.json({
        scout: await prisma.scouts.create({
          data: {
            ...scout,
          },
        }),
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/startBluetoothAdvertising", (req, res) => {
    try {
      const started = startBlenoServer();
      return res.json({
        started,
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/readFromDeviceAndUpdateDb", (req, res) => {
    try {
      if (advertising) {
        bleno.setServices([
          new bleno.PrimaryService({
            uuid: "0425b4be-ebba-4903-96d0-8663974f2123",
            characteristics: [
              new bleno.Characteristic({
                value: null,
                uuid: "d6dde2c2-71c3-4907-9232-de076f48f8a9",
                properties: ["write"],
                onWriteRequest: async (
                  data,
                  offset,
                  shouldRespond,
                  callback
                ) => {
                  console.log(`READ FROM DEVICE: Data ${data.toString()}`);

                  const mutated = await mutateDb(data, callback);

                  return res.json({
                    ...mutated,
                  });
                },
              }),
            ],
          }),
        ]);
      } else {
        throw new Error("Not advertising");
      }
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/writeToDevice", (req, res) => {});

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

await bootstrap()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
