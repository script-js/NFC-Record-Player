var ytp;
var scp;

function loadYTPlayer(url) {
    var urlParams = new URLSearchParams(url.split("youtu")[1].replace("be.com", "").replace(".be/", "/watch?v=").replace("/watch", "").replace("/playlist", ""));
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
                playsInline: 1,
                autoplay: 0
            },
            events: {
                'onReady': onPlayerReady,
                'onError': () => { window.open(url) },
                'onStateChange': function (event) {
                    var state = event.data
                    console.log(state)
                    if (state == YT.PlayerState.PLAYING) {
                        record.style.backgroundImage = 'url("https://img.youtube.com/vi/' + ytp.getVideoData().video_id + '/maxresdefault.jpg")'
                    } else if (state == YT.PlayerState.ENDED) {
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
        startPlayingUI(`http://img.youtube.com/vi/${ytp.getVideoData().video_id}/maxresdefault.jpg`, function () {
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

function loadSoundcloudPlayer(url) {
    scp = SC.Widget("scplayer");
    scp.load(url.replace("m.",""))
    scp.bind(SC.Widget.Events.READY, () => {
        scp.getCurrentSound((soundData) => {
            if (soundData && soundData.artwork_url) {
                var highResArt = soundData.artwork_url.replace('-large.', '-t500x500.');
                console.log('Album Cover URL:', highResArt);
            } else {
                console.log('No artwork found for this playlist.');
            }
            startPlayingUI(highResArt, function () {
                scp.play()
                enablePlayButton(function () {
                    scp.isPaused(function (r) {
                        pauseUI(!r, function () { scp.play() }, function () { scp.pause() })
                    })
                })
                toggleSeekButtons(function () {
                    scp.prev()
                    scp.seekTo(0)
                }, function () {
                    scp.seekTo(0)
                    scp.next()
                })
                scp.bind(SC.Widget.Events.PLAY, function () {
                    scplayer.style.display = 'none'
                    display.innerText = "PLAY"
                })

                setTimeout(function () {
                    scp.isPaused(function (r) {
                        if (!r) {
                            scplayer.style.display = "inline"
                            display.innerText = "PRESS ORANGE BUTTON"
                        }
                    })
                }, 500)
            })
        });
    });
}