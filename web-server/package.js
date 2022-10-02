import bootstrap from "./index";
import { exec } from "child_process";

await bootstrap()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });

  

const client = exec("cd ../web-client && npm start", (error, stdout, stderr) => {
  if (error) {
    console.error(error);
    process.exit(1);
  }
  console.info(stdout);
  console.log("Starting web client...");
});

client.addListener("spawn", () => {
    console.info("Web client started")
})
client.addListener("error", (err) => {
    console.error(`Web client error "${err}"`)
})
client.addListener("close", (code) => {
    console.log(`Web client closed with code "${code}"`)
})
