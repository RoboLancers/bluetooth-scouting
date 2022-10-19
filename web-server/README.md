# **Lancer Scout Web Server**

## **Setup**

This software is platform dependent, so it will vary depending on your operating system.

 * First you need **NodeJS** installed on your computer. Any version should work, but it is *v16.13.0* at the time this is being written. Installing NodeJS allows the computer to run the server on your computer.

 * Now you need to install the **Bluetooth middleware** so phones can connect wirelessly to the server. This step varies between platforms. Detailed instructions can be found [here](https://www.npmjs.com/package/@abandonware/bleno#Prerequisites).

 * Next, in a terminal inside of this directory, **run *npm install***. This will install all of the software the server is dependent on internally.

 * Finally, in a terminal inside of this directory, **run *npm start***. This will run the server. You should see a lot of text flash by in the terminal. This just means that the bluetooth module is running properly.