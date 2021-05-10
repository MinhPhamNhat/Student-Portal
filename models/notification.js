const mongoose = require("mongoose")

const notificationShema = mongoose.Schema({
    authorId: {type: String, ref: "users"},
    categoryId: {type: String, enum: [
        'PDH',        'PSDH',    'PDTVMT',
        'PKTVKDCL',   'PTC',     'TTTH',
        'TDTCLC',     'SDTC',    'ATEM',
        'TTHTDNVCSV', 'KL',      'TTNN',
        'VCSKTVKD',   'MTCN',    'DDT',
        'CNTT',       'MTVBHLD', 'QTKD',
        'LDCD',       'TCNH',    'GDQT',
        'PCTHSSV'
      ], ref: "categories"},
    title: {type: String, require: true},
    subTitle: {type: String, require: true},
    content: {type: String, require: true},
    isImportance: Boolean,
    date: Date,
    
});
module.exports = mongoose.model('notification', notificationShema)