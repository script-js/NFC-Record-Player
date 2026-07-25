try {
    const ndef = new NDEFReader();
} catch (err) {
    alert(err)
}

async function read() {
    try {
        await ndef.scan();
        console.log("> Scan started");
        ndef.addEventListener("readingerror", () => {
            console.log("Argh! Cannot read data from the NFC tag. Try another one?");
        });

        ndef.addEventListener("reading", ({ message, serialNumber }) => {
            console.log(message)
            if (confirm("Would you like to write?")) {
                ndef.write("test")
            }
        });
    } catch (error) {
        console.log("Argh! " + error);
    }
}