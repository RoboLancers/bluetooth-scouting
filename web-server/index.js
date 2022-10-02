import { PrismaClient } from "@prisma/client";
import express from "express";
import morgan from "morgan";
const PORT = process.env.PORT ?? 8080;
import bluetooth from "node-bluetooth";

const device = new bluetooth.DeviceINQ();


const prisma = new PrismaClient();

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
            id,
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
        scout: prisma.scouts.create({
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

  app.get("/getPairedDevices", (req, res) => {
    try {
      return res.json({
        devices: device.listPairedDevices(),
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.get("/getAllDevices", (req, res) => {
    try {
      let devices = [];
      device
        .on("finished", console.log.bind(console, "finished"))
        .on("found", (address, name) => {
          const foundDevice = { address, name };
          devices.push(foundDevice);
        })
        .scan();

      return res.json({
        devices,
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.get("/readFromDeviceAndUpdateDb/:address", async (req, res) => {
    const { address } = req.params;
    try {
      device.findSerialPortChannel(address, (channel) => {
        bluetooth.connect(address, channel, (err, connection) => {
          if (err) {
            console.error(err);
            return res.json({
              err,
            });
          }

          connection.on("data", async (buffer) => {
            const data = JSON.parse(buffer.toString());

            await prisma.scouts.create({
              data: {
                ...data,
              },
            });

            return res.json({
              data,
            });
          });
        });
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.get("/readFromDevice/:address", async (req, res) => {
    const { address } = req.params;
    try {
      device.findSerialPortChannel(address, (channel) => {
        bluetooth.connect(address, channel, (err, connection) => {
          if (err) {
            console.error(err);
            return res.json({
              err,
            });
          }

          connection.on("data", async (buffer) => {
            const data = JSON.parse(buffer.toString());

            return res.json({
              data,
            });
          });
        });
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/writeToDevice/:address", (req, res) => {
    const { address } = req.params;
    const { writable } = req.body;

    try {
      device.findSerialPortChannel(address, (channel) => {
        bluetooth.connect(address, channel, (err, connection) => {
          if (err) {
            console.error(err);
            return res.json({
              err,
            });
          }

          connection.write(Buffer.from(writable.toString()), () => {
            return res.json({
              m: `Wrote "${writable.toString()}" to device`,
            });
          });
        });
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.post("/writeToDeviceAndDb/:address", (req, res) => {
    const { address } = req.params;
    const { writable } = req.body;
    try {
      device.findSerialPortChannel(address, (channel) => {
        bluetooth.connect(address, channel, async (err, connection) => {
          if (err) {
            console.error(err);
            return res.json({
              err,
            });
          }

          await prisma.scouts.create({
            data: {
              ...writable,
            },
          });

          connection.write(Buffer.from(writable.toString()), () => {
            return res.json({
              m: `Wrote "${writable.toString()}" to device and to the database`,
            });
          });
        });
      });
    } catch (error) {
      return res.json({
        e: error.toString(),
      });
    }
  });

  app.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
  });
};

export default bootstrap;
