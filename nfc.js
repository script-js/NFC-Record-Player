function read() {
    try {
        const ndef = new NDEFReader();
        await ndef.scan();
        console.log("> Scan started");

        ndef.addEventListener("readingerror", () => {
            console.log("Argh! Cannot read data from the NFC tag. Try another one?");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
            alert(`> Serial Number: ${serialNumber}`);
            alert(`> Records: (${message.records.length})`);
        });
    } catch (error) {
        console.log("Argh! " + error);
    }
}