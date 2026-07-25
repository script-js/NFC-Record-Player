const ndef = new NDEFReader();

async function read() {
    await ndef.scan();
    console.log("> Scan started");
    ndef.addEventListener("readingerror", () => {
        console.log("Argh! Cannot read data from the NFC tag. Try another one?");
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(message.records)
        if (record.recordType === "text") {
            var decoder = new TextDecoder(record.encoding);

            var textData = decoder.decode(record.data);

            console.log(`Text content: ${textData}`);
            console.log(`Language code: ${record.lang}`);
            alert(textData)
        }
    });
}

function write(text) {
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log("Writing " + text)
        ndef.write(text)
    });
}