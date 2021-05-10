const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    name: {type: String, require: true},
    email: {type: String, require: true},
    avatar: {type: String, require: true},
    role: { admin: Boolean, department: Boolean, student: Boolean },
    sub: {type: String, require: true},
    class: String,
    faculty: String,
    quote: String,
    desc: String,
    initialTime: Date,
    departmentID: String,
    permission: [{type: String, enum: [
        'PDH',        'PSDH',    'PDTVMT',
        'PKTVKDCL',   'PTC',     'TTTH',
        'TDTCLC',     'SDTC',    'ATEM',
        'TTHTDNVCSV', 'KL',      'TTNN',
        'VCSKTVKD',   'MTCN',    'DDT',
        'CNTT',       'MTVBHLD', 'QTKD',
        'LDCD',       'TCNH',    'GDQT',
        'PCTHSSV'
      ], ref:"categories"}],
})

module.exports = mongoose.model('users', userSchema)