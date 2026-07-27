var ytp;

function loadYTPlayer(url) {
    var urlParams = new URLSearchParams(url.split("youtu")[1].replace("be.com", "").replace(".be/", "/watch?v=").replace("/watch", ""));
    var videoId = urlParams.get("v").split("?")[0]
    var list = urlParams.get("list").split("?")[0]
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
                //'onError': () => { window.open(url) },
                'onStateChange': function (state) { if (state == YT.PlayerState.PLAYING) { record.style.backgroundImage = 'url("http://img.youtube.com/vi/' + ytp.getVideoData().video_id + '/maxresdefault.jpg")' } }
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
        })
        ytp.pauseVideo()
    }
}

function onPlayerReady(event) {
    var videoId = event.target.getVideoData().video_id
    console.log(videoId)
    startPlayingUI(`http://img.youtube.com/vi/${videoId}/maxresdefault.jpg`, function () {
        event.target.playVideo()
    })
    toggleSeekButtons(event.target.previousVideo, event.target.nextVideo)
    enablePlayButton(function () {
        if (playing) {
            event.target.pauseVideo()
        } else {
            event.target.playVideo()
        }
        pauseUI(event.target.getPlayerState() === 1)
    })
}