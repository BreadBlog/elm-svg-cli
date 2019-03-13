const R = require('ramda')
const parser = require('xml2js')
const { EOL } = require('os')

function spaces(level, str) {
  const start = R.pipe(
    R.multiply(4),
    R.range,
    R.map(R.always(' ')),
    R.join(''),
  )(level)
  return `${start}${str}`
}

/**
 * Converts an svg attribute to an elm attribute
 */
exports.toCamelCase = function toCamelCase(name) {
  return name.replace(/-\w/g, ([, letter]) => letter.toUpperCase())
}

/*
 * TODO: Remove
name : List Attribute : Svg msg
name attributes_ =
    Svg.svg
        (List.append
            [ Attribute.fill "fff"
            , Attribute.stroke "fff"
            ]
            attributes_
        )
        [ Svg.circle
            [ Attribute.fill "fff"
            , Attribute.stroke "fff"
            ]
            []
        ]
 */

/**
 * Convert an svg array to an elm list
 *
 * Values can be either a string i.e. `Attribute.fill "fff"`
 * or an object i.e. { name: 'circle', list: [ `Attribute.fill "fff"` ] }
 */
exports.toAttributes = function toList(level, ...values) {
  if (!values.length) {
    return spaces(level, '[]')
  }
  const list = values
    .map((s, i) => {
      if (typeof s === 'string') {
        return spaces(level, `, ${s}`)
      } else if (Array.isArray(s)) {
        if (i === 0) {
          // TODO:
        } else {
          return toList(level, s);
        }
      }
    })
  list[0] = list[0].replace(/^(\s*)(,)(.*)$/m, '$1[$3')
  list.push(spaces(level, ']'))
  return list
    .join(EOL)
}

exports.toNode = function toNode(level, name, attributes, nodes) {
  return R.join(EOL)([
    `Svg.${name}`,
    toAttributes(level, ...attributes),
    toNodes(level, ...nodes),
  ])
}

exports.toNodes = function toNodes(level, ...nodes) {
  if (!nodes || !nodes.length) {
    return spaces(level, '[]')
  }
}

exports.toTag = function toTag() {

}

exports.attribute = function attribute(name, value) {
  return `Attributes.${toCamelCase(name)} "${value}"`
}

function fnTemplate(name) {
  return R.join(EOL)([
    `${name} : List (Attribute msg) -> Svg msg`,
    `${name} toSvgAttributes =`,
  ])
}

function parseXml(key, value) {
  const values = R.converge(
    R.pipe(
      R.zip,
    ),
    [
      R.keys,
      R.values,
    ]
  )(obj)
  const attributes = R.pipe(
    R.pipe(
      R.head,
      R.filter(R.equals('$')),
    ),
    R.nth(1),
  )(values)
  const nodes = R.pipe(
    R.pipe(
      R.head,
      R.filter(R.pipe(
        R.equals('$'),
        R.not,
      )),
    ),
    R.nth(1),
  )(values)

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
      const atttributes = xml.$
      console.log(xml)
      resolve()
    })
  })
}

