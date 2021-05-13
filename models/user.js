const mongoose = require('mongoose')
const userSchema = mongoose.Schema({
    _id: String,
    name: {
      type: String, 
      require: true
    },
    email: {
      type: String, 
      require: true,
      unique: true
    },
    avatar: {
      type: String, 
    },
    role: { 
      admin: Boolean, 
      department: Boolean, 
      student: Boolean 
    },
    sub: {
      type: String
    },
    class: String,
    faculty: String,
    quote: String,
    desc: String,
    initialTime: Date,
    departmentID: {
      type: String,
      unique: true
    },
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