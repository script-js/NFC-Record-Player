var ytp;

function loadYTPlayer(url) {
    var urlParams = new URLSearchParams(url.split("youtu")[1].replace("be.com", "").replace(".be/", "/watch?v=").replace("/watch", ""));
    var videoId = urlParams.get("v")
    if (videoId && videoId.includes("?")) { videoId = videoId.split("?")[0] }
    var list = urlParams.get("list")
    if (list && list.includes("?")) { list = list.split("?")[0] }
    console.log(videoId, list)
    if (!ytp) {
        var playerConfig = {
            height: '1',
            width: '1',
            playerVars: {
                playsInline: 1
            },
            events: {
                'onReady': onPlayerReady,
                'onError': () => { window.open(url) },
                'onStateChange': function (event) {
                    var state = event.data
                    console.log(state, YT.PlayerState.ENDED)
                    if (state == YT.PlayerState.PLAYING) {
                        record.style.backgroundImage = 'url("http://img.youtube.com/vi/' + ytp.getVideoData().video_id + '/maxresdefault.jpg")'
                    } else if (state == YT.PlayerState.ENDED) {
                        console.log("stopped")
                        stopPlayingUI()
                    }
                }
            }
        }
        if (list) {
            playerConfig.playerVars.listType = 'playlist'
            playerConfig.playerVars.index = 0
            playerConfig.playerVars.list = list
        } else {
            playerConfig.videoId = videoId
        }
        ytp = new YT.Player('ytplayer', playerConfig);
    } else {
        if (list) {
            ytp.loadPlaylist({
                listType: 'playlist',
                list,
                index: 0
            });
            toggleSeekButtons(ytp.previousVideo, ytp.nextVideo)
        } else {
            ytp.loadVideoById({ videoId })
            toggleSeekButtons()
        }
        startPlayingUI(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, function () {
            ytp.playVideo()
            enablePlayButton(ytToggle)
        })
        ytp.pauseVideo()
    }
}

function ytToggle() {
    pauseUI(ytp.getPlayerState() === 1, function () { ytp.playVideo() }, function () { ytp.pauseVideo() })
}

function onPlayerReady(event) {
    var videoId = event.target.getVideoData().video_id
    console.log(videoId)
    startPlayingUI(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, function () {
        event.target.playVideo()
        enablePlayButton(ytToggle)
    })
    if (event.target.playerInfo.playlistId) {
        toggleSeekButtons(function () { event.target.previousVideo() }, function () { event.target.nextVideo() })
    }
}

function toSpotifyURI(url) {
    if (url.includes("spotify.com/")) {
        var parts = url.split("spotify.com/")[1].split("/")
        parts[1] = parts[1].split("?")[0]
        return parts;
    } else {
        return null;
    }
}

async function playSpotify(url) {
    var parts = toSpotifyURI(url)
    var uriToOpen = "spotify:" + parts[0] + ":" + parts[1] + ":play"
    if (!uriToOpen) {
        alert("Invalid Spotify URL")
        return;
    }
    if (window.Notification && Notification.permission !== "granted") {
        await Notification.requestPermission();
    }
    var oembed = await (await fetch("https://open.spotify.com/oembed?url=" + url)).json();
    startPlayingUI(oembed.thumbnail_url, function () {
        new Notification("NFCPlayer", {
            body: "Tap to return"
        });
        location.href = uriToOpen
        enablePlayButton(function () {
            if (playing) {
                interruptor.play()
                alert("Starting I")
            } else {
                interruptor.pause()
                alert("Stopping I")
            }
            pauseUI(playing)
        })
    })
}