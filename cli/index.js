#!/usr/bin/env node
const fs = require('fs')
const { resolve } = require('path')

const helpMessage = `\
elm-svg usage: $elm-svg <src_dir> <dest_file>

options:
  --style, -s: for use with elm-css
  --help, -h: display this help message
`
const args = process.argv.slice(2)

function help(err) {
  if (err) { console.log(`\n${err}`) }
  console.log('')
  console.log(helpMessage);
  process.exit(err ? 1 : 0)
}

if (args.includes('-h') || args.includes('--help')) {
  help()
}

const shouldStyle = (args.includes('--style') || args.includes('-s'))

const filteredArgs = args
  .filter(a => !a.startsWith('-'))

if (filteredArgs.length !== 2) {
  help('expected <src_dir> and <dest_file>')
}

const [srcDir, destFile] = filteredArgs

fs.readdir(resolve(srcDir), { withFileTypes: true }, (err, dirents) => {
  if (err) { help(err) }
  const svgs = dirents
    .filter(d => d.isFile())
    .filter(d => d.name.match(/\.svg$/))
    .map(d => resolve(srcDir, d.name))
  // TODO: Finish
})
