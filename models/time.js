const getPassedTime = (startTime, endTime) => {
    let passTime = Math.floor((endTime - startTime) / 1000)
    let outputTime = ""
    if (passTime < 60)
        outputTime = passTime + " seconds ago"
    else if (passTime < (60 * 60))
        outputTime = Math.floor(passTime / 60) + " mins ago"
    else if (passTime < (60 * 60 * 60))
        outputTime = Math.floor(passTime / (60 * 60)) + " hrs ago"
    else if (passTime < (60 * 60 * 60 * 24))
        outputTime = Math.floor(passTime / (60 * 60 * 24)) + " days ago"
    else if (passTime < (60 * 60 * 60 * 24 * 30))
        outputTime = Math.floor(passTime / (60 * 60 * 24 * 30)) + " months ago"
    return outputTime
}

module.exports = getPassedTime