const path = require('path')
const { pnm } = require('..')

pnm(path.join(__dirname, '..'), { production: false })
