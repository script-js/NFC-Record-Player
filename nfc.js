var ndef;
var currentTag = "notag";

try {
    ndef = new NDEFReader();
} catch (err) {
    console.warn(err)
    alert("NFC is not supported in this browser.\nWeb NFC is only supported on Chrome based browsers on Android devices.")
}

var writing = false;
navigator.wakeLock.request("screen");

function invalidTag() {
    var prevAction = display.innerText
    display.innerText = "INVALID TAG"
    setTimeout(function () {
        display.innerText = prevAction
    }, 1500)
}

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
                if (textData == currentTag) { return; }
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
                            startPlayingUI(null, function () {
                                console.log(fetch(tagjson.uri))
                            })
                            playbtn.disabled = true
                            break;
                        case "spotify":
                            playSpotify(tagjson.uri)
                            break;
                        case "soundcloud":
                            loadSoundcloudPlayer(tagjson.uri)
                            break;
                        default:
                            invalidTag()
                            break;
                    }
                    currentTag = textData
                } else {
                    invalidTag()
                }
            } else {
                invalidTag()
            }
        }
    });
}

function writeTag(provider, uri) {
    if (provider == "spotifyapp") {
        writeSpotifyURI(uri)
        return;
    }
    if (uri.includes("on.soundcloud")) {
        alert("Warning: on.soundcloud.com links don't work. Open the link in a new tab and copy the soundcloud.com URL it redirects to from your address bar.")
        return;
    }
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

function writeSpotifyURI(url) {
    if (confirm("Note: The tag written by the Spotify App option will not work with this website and will show an invalid tag error if scanned from here. Instead, it directly opens the Spotify app and starts playback. This is the recommended way to play Spotify with NFC tags, but you will not be able to use the NFC Player UI.")) {
        writing = true;
        var parts = toSpotifyURI(url)
        var uri = "spotify:" + parts[0] + ":" + parts[1] + ":play"
        display.innerText = "WRITING"
        ndef.addEventListener("reading", async function (message, serialNumber) {
            console.log("Writing " + uri)
            await ndef.write({
                records: [
                    {
                        recordType: "url",
                        data: uri
                    }
                ]
            })
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
}