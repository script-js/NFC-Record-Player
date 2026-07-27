const ndef = new NDEFReader();
var writing = false;
navigator.wakeLock.request("screen");

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
                    var tagjson = JSON.parse(textData.replace("NFCRECORDPLAYER:", ""))
                    if (tagjson.provider == "link") {
                        var domain = new URL(tagjson.uri).hostname
                        startPlayingUI("https://t0.gstatic.com/faviconV2?client=SOCIAL&type=FAVICON&fallback_opts=TYPE,SIZE,URL&size=128&url=" + domain, function () {
                            window.open(tagjson.uri)
                        })
                    }
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
    var text = "NFCRECORDPLAYER:" + JSON.stringify({ provider, uri })
    writing = true;
    console.log("Waiting to write...")
    display.innerText = "WRITING"
    ndef.addEventListener("reading", ({ message, serialNumber }) => {
        console.log("Writing " + text)
        ndef.write(text)
        alert("Write Complete")
        writing = false;
        if (playing) {
            display.innerText = "PLAY"
        } else {
            display.innerText = "WRITE COMPLETE"
        }
    }, { once: true });
    alert("Ready to write\n Hold NFC tag on the back of the device")
}
