const ndef = new NDEFReader();
var writing = false;

async function startReader() {
    await ndef.scan();
    console.log("Scan started");
    ndef.addEventListener("readingerror", () => {
        alert("Could not read NFC tag.")
    });

    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        if (!writing) {
            console.log(message.records)
            var record = message.records[message.records.length - 1]
            if (record && record.recordType === "text") {
                var decoder = new TextDecoder(record.encoding);

                var textData = decoder.decode(record.data);

                console.log(`Text content: ${textData}`);
                console.log(`Language code: ${record.lang}`);
                if (textData.includes("NFCRECORDPLAYER:")) {
                    var tagjson = JSON.parse(textData.replace("NFCRECORDPLAYER:",""))
                    alert("Provider: " + tagjson.provider + "\nURI: " + tagjson.uri)
                } else {
                    alert("Invalid NFC Tag")
                }
            } else {
                alert("Invalid NFC Tag")
            }
        }
    });
}

function writeTag(provider, uri) {
    var text = "NFCRECORDPLAYER:" + JSON.stringify({provider, uri})
    writing = true;
    console.log("Waiting to write...")
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log("Writing " + text)
        ndef.write(text)
        alert("Write Complete")
        writing = false;
    }, { once: true });
}