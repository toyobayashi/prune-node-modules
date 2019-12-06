const path = require('path')
const fs = require('fs')
const rimraf = require('rimraf')
const minimatch = require('minimatch')

const blackFiles = [
  '.DS_Store',
  '.tern-project',
  '.gitattributes',
  '.editorconfig',
  '.eslintrc',
  'eslint',
  '.eslintrc.js',
  '.eslintrc.json',
  '.eslintignore',
  'tslint.json',
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
  'api-extractor.json'
]

const prodBlackFiles = [
  'Makefile',
  'CMakeLists',
  'Gulpfile.js',
  'Gruntfile.js',
  'gulpfile.js',
  'tsconfig.json',
  'webpack.config.js',
  'webpack.config.ts',
  'webpack.config.coffee',
  'binding.gyp'
]

const blackPackages = [
  'nan',
  'node-gyp',
  'node-addon-api',
  '@types',
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
  '**/*.node',
  '**/*.wasm'
]

const devWhiteList = [
  '**/*.ts',
  '**/*.txt',
  '**/*.html',
  '**/*.css',
  '**/*.vue',
  '**/*.tsx',
  '**/*.jsx',
  '**/*.less',
  '**/*.sass',
  '**/*.scss',
  '**/*.ejs',
  '**/*.jade',
  '**/*.coffee',
  '**/*.c',
  '**/*.cc',
  '**/*.cpp',
  '**/*.py',
  '**/*.svg',
  '**/*.ttf',
  '**/*.otf',
  '**/*.woff2',
  '**/*.eot'
]

function pruneSync (dir, options) {
  const nodeModulesDir = path.join(dir, 'node_modules')
  if (!fs.existsSync(nodeModulesDir)) return
  if (!fs.statSync(nodeModulesDir).isDirectory()) return
  const isProd = (!!options && !!options.production)
  const ls = fs.readdirSync(nodeModulesDir)
  for (let i = 0; i < ls.length; i++) {
    if (ls[i] === '.' || ls[i] === '..' || (!isProd && ls[i] === '.bin')) continue
    const packageDir = path.join(nodeModulesDir, ls[i])
    if (fs.statSync(packageDir).isDirectory()) {
      if (isProd && blackPackages.some(d => (d === ls[i]))) {
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
  } catch (err) {
    // ignore
  }
}

module.exports = pruneSync
