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
        });
    } catch (error) {
        console.log("Argh! " + error);
    }
}

function write() {
    ndef.addEventListener(
        "reading",
        (event) => {
            // Check if we want to write to this tag, or reject.
            ndef.write("test")
        }, { once: true })
}