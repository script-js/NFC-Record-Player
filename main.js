var playing = false;

function startPlayingUI(cover, playCommand) {
    display.innerText = "STARTING"
    if (playing) {
        if (!playbtn.disabled) {
            playbtn.click()
        }
        stopPlayingUI()
        setTimeout(function () { startPlayingUI(cover, playCommand) }, 1000)
    } else {
        playing = true;
        if (cover) {
            record.style.backgroundImage = 'url("' + cover + '")'
        }
        setTimeout(function () {
            navigator.vibrate(500);
            arm.style.transform = "rotate(20deg)"
        }, 500)
        setTimeout(function () {
            record.style.animation = "playing linear 1000ms"
            record.style.animationIterationCount = "infinite"
            display.innerText = "PLAY"
            playCommand()
        }, 1500)
    }
}

function enablePlayButton(action) {
    playbtn.onclick = action
    playbtn.disabled = false
}

function toggleSeekButtons(prevAction, nextAction) {
    if (prevAction && nextAction) {
        fb.disabled = false
        ff.disabled = false
        fb.onclick = prevAction
        ff.onclick = nextAction
    } else {
        fb.disabled = true
        ff.disabled = true
    }
}

function showPopup() {
    popup.style.display = "block"
    setTimeout(function () {
        popup.style.bottom = "-2%"
    }, 100)
}

function hidePopup() {
    popup.style.bottom = "-50%"
    setTimeout(function () {
        popup.style.display = "none"
    }, 100)
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

function powerOn(btn) {
    clickFeedback()
    btn.classList = "powerbtn on"
    btn.onclick = function () {
        clickFeedback()
        display.innerText = "POWERING OFF"
        if (playing) { stopPlayingUI() }
        setTimeout(function () {
            location.reload()
        }, 1000)
    }
    startReader()
    display.innerText = "Scanning"
    writebtn.disabled = false
}

function clickFeedback(elem) {
    if (elem && elem.disabled == true) {
        return
    }
    click.currentTime = 0
    navigator.vibrate(10);
    click.play()
}

function stopPlayingUI() {
    playing = false;
    record.style.animationIterationCount = "1"
    setTimeout(function () {
        navigator.vibrate(500);
        arm.style.transform = "rotate(0deg)"
    }, 500)
}

function pauseUI(playingStatus, play, pause) {
    if (playingStatus) {
        record.style.animationIterationCount = "1"
        display.innerText = "STOP"
        pause()
    } else {
        if (arm.style.transform == "rotate(20deg)") {
            record.style.animation = "playing linear 1000ms"
            record.style.animationIterationCount = "infinite"
            display.innerText = "PLAY"
            play()
        } else {
            startPlayingUI(null, play)
        }
    }
    playing = !playingStatus
}