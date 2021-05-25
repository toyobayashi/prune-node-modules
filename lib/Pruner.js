const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const minimatch = require('minimatch')
const {
  blackFiles,
  prodBlackFiles,
  prodBlackPackages,
  blackDirs,
  defaultWhitelist,
  devWhiteList
} = require('./list.js')

class Pruner {
  constructor (options) {
    this.options = options
  }

  /**
   * Prune a node project
   * @param {string} dir - Root dir
   * @returns {void}
   */
  prune (dir) {
    const nodeModulesDir = path.join(dir, 'node_modules')
    if (!fs.existsSync(nodeModulesDir)) return
    if (!fs.statSync(nodeModulesDir).isDirectory()) return
    const options = this.options
    const isProd = (!!options && !!options.production)
    const ls = fs.readdirSync(nodeModulesDir)
    for (let i = 0; i < ls.length; i++) {
      if (ls[i] === '.' || ls[i] === '..' || (!isProd && ls[i] === '.bin')) continue
      const packageDir = path.join(nodeModulesDir, ls[i])
      if (fs.statSync(packageDir).isDirectory()) {
        if (isProd) {
          if (prodBlackPackages.some(d => (d === ls[i]))) {
            rimraf.sync(packageDir)
            continue
          } else {
            const subLs = fs.readdirSync(packageDir)
            for (let j = 0; j < subLs.length; j++) {
              const subPath = path.join(packageDir, subLs[j])
              if (fs.statSync(subPath).isDirectory() && prodBlackPackages.some(d => d === path.posix.join(ls[i], subLs[j]))) {
                rimraf.sync(subPath)
              }
            }
          }
        }
        this.prune(packageDir)
        _pruneDirSync(packageDir, options)
      }
    }
  }
}

function _pruneDirSync (dir, options) {
  if (!fs.existsSync(dir)) return
  if (!fs.statSync(dir).isDirectory()) return

  const isProd = (!!options && !!options.production)

  const mergeDevWhitelist = isProd ? [] : devWhiteList
  const blackFileList = isProd ? [...blackFiles, ...prodBlackFiles] : blackFiles

  const ls = fs.readdirSync(dir)
  const wl = Array.from(new Set([...defaultWhitelist, ...mergeDevWhitelist, ...(options ? (Array.isArray(options.whitelist) ? options.whitelist : []) : [])]))
  const removeFiles = (options ? (Array.isArray(options.removeFiles) ? options.removeFiles : blackFileList) : blackFileList)
  const removeDirs = (options ? (Array.isArray(options.removeDirs) ? options.removeDirs : blackDirs) : blackDirs)

  for (let i = 0; i < ls.length; i++) {
    if (ls[i] === '.' || ls[i] === '..') continue
    const targetPath = path.join(dir, ls[i])
    if (fs.statSync(targetPath).isDirectory()) {
      if (removeDirs.some(d => (d === ls[i]))) {
        rimraf.sync(targetPath)
      } else {
        _pruneDirSync(targetPath, options)
      }
    } else {
      if (removeFiles.some(d => (d === ls[i])) || !wl.some(g => minimatch(targetPath, g))) {
        rimraf.sync(targetPath)
      }
    }
  }

  try {
    fs.rmdirSync(dir)
  } catch (_) {}
}

Pruner.prune = function prune (dir, options) {
  const pruner = new Pruner(options)
  try {
    pruner.prune(dir)
  } catch (_) {}
}

module.exports = Pruner
