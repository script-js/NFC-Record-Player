var ndef;

try {
    ndef = new NDEFReader();
} catch (err) {
    console.warn(err)
    alert("NFC is not supported in this browser.\nWeb NFC is only supported on Chrome based browsers on Android devices.")
}

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
            var record = message.records[message.records.length - 1]
            if (record && record.recordType === "text") {
                var decoder = new TextDecoder(record.encoding);

                var textData = decoder.decode(record.data);

                console.log(`Text content: ${textData}`);
                if (textData.includes("NFCRECORDPLAYER:")) {
                    var tagjson = JSON.parse(textData.replace("NFCRECORDPLAYER:", ""))
                    switch (tagjson.provider) {
                        case "link":
                            startPlayingUI("https://s2.googleusercontent.com/s2/favicons?sz=256&domain_url=" + tagjson.uri, function () {
                                window.open(tagjson.uri)
                            })
                            playbtn.disabled = true
                            break;
                        case "youtube":
                            loadYTPlayer(tagjson.uri)
                            break;
                        case "httpgetrequest":
                            startPlayingUI("", function () {
                                console.log(fetch(tagjson.uri))
                            })
                            playbtn.disabled = true
                            break;
                        default:
                            alert("Invalid NFC Tag")
                            break;
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
    display.innerText = "WRITING"
    ndef.addEventListener("reading", async function (message, serialNumber) {
        console.log("Writing " + text)
        await ndef.write(text)
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
