const fs = require('fs')
const pug = require('pug')

const dst = `${projekt}/dst`
const src = `${projekt}/src`

fs.writeFileSync(
    `${dst}/index.html`,
    pug.renderFile(`${src}/index.pug`)
)
