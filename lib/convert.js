const parser = require('xml2js')

/**
 * Converts an svg attribute to an elm attribute
 */
exports.toCamelCase = function toCamelCase(name) {
  return name.replace(/-\w/g, ([, letter]) => letter.toUpperCase())
}

exports.toList = function toList(level, ...values) {
  if (!values.length) {
    return 
  }
  const list = values
    .map(s => `, ${s}`)
  list[0] = list[0].replace(/^,/m, '[')
  list.push(']')
  return list
    .map(s => {
      const spaces = [...Array( level * 4 )].map(() => ' ').join('')
      return `${spaces}${s}`
    })
    .join('\n');
}

exports.toTag = function toTag() {

}

exports.attribute = function attribute(name, value) {
  return `Attributes.${toCamelCase(name)} "${value}"`
}

/**
 * Convert an svg to an elm function
 */
exports.convert = function convert(name, svg) {
  const template = `\
  ${name} : List Attribute -> Html msg\
  ${name} attributes =
    %contents%
  `
  return new Promise((resolve, reject) => {
    parser.parseString(svg, (err, xml) => {
      if (err) { throw err }
      // console.log(xml)
      resolve()
    })
  })
}

