'use strict'

Object.defineProperty(exports, '__esModule', { value: true })

const Pruner = require('./lib/Pruner.js')

function pnm (dir, options) {
  Pruner.prune(dir, options)
}

exports.Pruner = Pruner
exports.pnm = pnm
