const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const minimatch = require('minimatch')

const blackFiles = [
  'Makefile',
  'Gulpfile.js',
  'Gruntfile.js',
  'gulpfile.js',
  '.DS_Store',
  '.tern-project',
  '.gitattributes',
  '.editorconfig',
  '.eslintrc',
  'eslint',
  '.eslintrc.js',
  '.eslintrc.json',
  '.eslintignore',
  '.stylelitrc',
  '.htmllintrc',
  'htmllint.js',
  '.lint',
  '.npmignore',
  '.jshintrc',
  '.flowconfig',
  '.documentup.json',
  '.yarn-metadata.json',
  '.travis.yml',
  'appveyor.yml',
  '.gitlab-ci.yml',
  'circle.yml',
  '.coveralls.yml',
  'CHANGES',
  'LICENSE.txt',
  'LICENSE',
  'LICENSE.md',
  'AUTHORS',
  'CONTRIBUTORS',
  '.yarn-integrity',
  '.yarnclean',
  '_config.yml',
  '.babelrc',
  'babel.config.js',
  '.yo-rc.json',
  'jest.config.js',
  'tsconfig.json',
  'webpack.config.js',
  'webpack.config.ts',
  'webpack.config.coffee',
  'binding.gyp',
  'api-extractor.json'
]

const blackPackages = [
  'nan',
  'node-gyp',
  'node-addon-api',
  '.bin'
]

const blackDirs = [
  '__tests__',
  'test',
  'tests',
  'powered-test',
  'docs',
  'doc',
  '.idea',
  '.vscode',
  'example',
  'examples',
  'coverage',
  '.nyc_output',
  '.circleci',
  '.github'
]

const defaultWhitelist = [
  '**/*.js',
  '**/*.json',
  '**/*.node'
]

function pruneSync (dir, options) {
  const nodeModulesDir = path.join(dir, 'node_modules')
  if (!fs.existsSync(nodeModulesDir)) return
  if (!fs.statSync(nodeModulesDir).isDirectory()) return
  const ls = fs.readdirSync(nodeModulesDir)
  for (let i = 0; i < ls.length; i++) {
    if (ls[i] === '.' || ls[i] === '..') continue
    const packageDir = path.join(nodeModulesDir, ls[i])
    if (fs.statSync(packageDir).isDirectory()) {
      if (blackPackages.some(d => (d === ls[i]))) {
        rimraf.sync(packageDir)
      } else {
        pruneSync(packageDir, options)
        _pruneDirSync(packageDir, options)
      }
    }
  }
}

function _pruneDirSync (dir, options) {
  if (!fs.existsSync(dir)) return
  if (!fs.statSync(dir).isDirectory()) return

  const ls = fs.readdirSync(dir)
  const wl = [...defaultWhitelist, ...(options ? (Array.isArray(options.whitelist) ? options.whitelist : []) : [])]
  const removeFiles = (options ? (Array.isArray(options.removeFiles) ? options.removeFiles : blackFiles) : blackFiles)

  for (let i = 0; i < ls.length; i++) {
    if (ls[i] === '.' || ls[i] === '..') continue
    const targetPath = path.join(dir, ls[i])
    if (fs.statSync(targetPath).isDirectory()) {
      if (blackDirs.some(d => (d === ls[i]))) {
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
}

module.exports = pruneSync
