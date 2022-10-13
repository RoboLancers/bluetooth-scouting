import bleno from "bleno";
import schema from "./schema.json";

export default class BluetoothService {
  name = "lancer-scout";

  uuid = "0425b4beebba490396d08663974f2123";

  state = "";

  ble;

  data;

  constructor(name, uuid) {
    this.ble = bleno;

    if (name && uuid) {
      this.name = name;
      this.uuid = uuid;
    }
  }

  startAdvertising() {
    try {
      this.ble.on("stateChange", (state) => {
        this.state = state;
      });

      if (this.state == "poweredOn") {
        this.ble.startAdvertising(this.name, [this.uuid], (err) => {
          throw new Error(err.toString());
        });
      } else {
        this.stopAdvertising();
      }
    } catch (error) {
      console.error(error);
    }
  }

  stopAdvertising() {
    this.ble.stopAdvertising();
  }

  onAdvertisingStart(err) {
    try {
      if (!err) {
        const characteristic = new this.ble.Characteristic({
          uuid: "d6dde2c271c349079232de076f48f8a9",
          properties: ["read", "write"],
          onReadRequest: this.onRead,
          onWriteRequest: this.onWrite,
        });
        const primaryService = new this.ble.PrimaryService({
          uuid: "0425b4beebba490396d08663974f2123",
          characteristics: [characteristic],
        });
        this.ble.setServices([primaryService], (err) => {
          throw new Error(err);
        });
      } else {
        throw new Error(err);
      }
    } catch (error) {
      console.error(error.toString());
    }
  }

  onRead(offset, callback) {
    console.log("***\n\n" + JSON.stringify(schema));
    callback(
      this.ble.Characteristic.RESULT_SUCCESS,
      Buffer.from(JSON.stringify(schema))
    );
  }

  onWrite(data, offset, withoutResponse, callback) {
    // !TODO find better solution
    let instreamWriteBuffer;
    try {
      instreamWriteBuffer += data.toString().replace(/\x19/g, "'");

      if (
        instreamWriteBuffer.length != 0 &&
        instreamWriteBuffer.endsWith("]")
      ) {
        this.data = JSON.parse(instreamWriteBuffer);
      }

      this.uploadForm(this.data);
      callback(this.ble.Characteristic.RESULT_SUCCESS);
    } catch (error) {
      console.error(error);
      callback(this.ble.Characteristic.RESULT_UNLIKELY_ERROR);
    }
  }

  onUploadForm(callback) {
    callback(this.data);
  }
}
