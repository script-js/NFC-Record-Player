const ndef = new NDEFReader();

async function read() {
    await ndef.scan();
    console.log("> Scan started");
    ndef.addEventListener("readingerror", () => {
        console.log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(message.records)
        ndef.write("test")
    });
}