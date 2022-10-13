import ApplicationService from "./classes/ApplicationService";
import BluetoothService from "./classes/BluetoothService";

const main = async () => {
  const bluetooth = new BluetoothService();
  const { ble, onAdvertisingStart } = bluetooth;

  const application = new ApplicationService();

  ble.on("advertisingStart", onAdvertisingStart);

  // upsert forms

  bluetooth.onUploadForm((data) => {
    application.upsertForms(data);
  });

  // routes for web app

  application.router.get("/queryForms", application.getForms);
  application.router.post("/postForms", application.uploadForms);

  application
    .bootstrap()
    // From PRISMA docs, leave here
    .catch(async (e) => {
      console.error(e);
      await application.db.$disconnect();
      process.exit(1);
    });
};

await main();
