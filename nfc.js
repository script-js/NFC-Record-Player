const ndef = new NDEFReader();

async function read() {
    await ndef.scan();
    console.log("> Scan started");
    ndef.addEventListener("readingerror", () => {
        alert("Could not read NFC tag.")
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log(message.records)
        var record = message.records[message.records.length - 1]
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