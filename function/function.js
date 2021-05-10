const fs = require('fs')

const convertBinaryToBase64 = (value) => {
    return Buffer.from(value.reduce((data, byte) => data + String.fromCharCode(byte), ''), 'binary').toString('base64')
}
const range= (size, startAt) => {
    return [...Array(size).keys()].map(i => i + startAt);
}
module.exports = {
    getPassedTime: (startTime, endTime) => {
        let passTime = Math.floor((endTime - startTime) / 1000)
        if (passTime < 60)
            return passTime + " seconds ago"
        else if (passTime < (60 * 60))
            return Math.floor(passTime / 60) + " mins ago"
        else if (passTime < (60 * 60 * 24))
            return Math.floor(passTime / (60 * 60)) + " hrs ago"
        else if (passTime < (60 * 60 * 24 * 30))
            return Math.floor(passTime / (60 * 60 * 24)) + " days ago"
        else if (passTime < (60 * 60 * 24 * 30 * 365))
            return Math.floor(passTime / (60 * 60 * 24 * 30)) + " months ago"
        return ""
    },

    convertImageToURL: (file) => {
        var img = fs.readFileSync(file.path);
        var encode_image = img.toString('base64');
        var image = Buffer.from(encode_image, 'base64')
        return `data:${file.mimetype};base64,${convertBinaryToBase64(image.toJSON().data)}`
    },

    createPageRange: (curPage, maxPage)=>{
        var pageRange = range(5, curPage-2)
        var start = pageRange.indexOf(1)
        var end = pageRange.indexOf(maxPage)
        if (start === -1 && end === -1){
            return pageRange
        }else if (start === -1){
            return pageRange.slice(0,end+1)
        }else if (end === -1){
            return pageRange.slice(start,)
        }else{
            return pageRange.slice(start, end+1)
        }
    },
}