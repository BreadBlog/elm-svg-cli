const { expect } = require('chai')

const {
  convert,
  toCamelCase,
  toList,
} = require('./convert')

describe('convert', function () {
  describe('#toCamelCase', function () {
    [
      {
        from: 'test',
        to: 'test',
      },
      {
        from: 'accent-height',
        to: 'accentHeight',
      },
      {
        from: 'horiz-adv-x',
        to: 'horizAdvX',
      },
    ].forEach(function ({ from, to }) {
      it(`converts ${from} to ${to}`, function () {
        const actual = toCamelCase(from)
        expect(actual).to.eq(to)
      })
    })
  })

  describe('#toList', function () {
    [
      {
        from: [0, 'Attributes.fill "fff"', 'Attributes.stroke "000000"'],
        to:
`\
[ Attributes.fill "fff"
, Attributes.stroke "000000"
]\
`,
      },
      {
        from: [1, 'Attribute.fill "fff"', 'Attribute.stroke "000"'],
        to:
`\
    [ Attribute.fill "fff"
    , Attribute.stroke "000"
    ]\
`
      },
      {
        from: [],
        to:
`\
[ Attribute.fill "fff"
, Svg.circle
    []
]
`
      },
    ].forEach(({ from, to }, i) => {
      it(`converts set ${i} correctly to list`, function () {
        const actual = toList(...from)
        expect(actual).to.eq(to)
      })
    })
  })

  describe.only('#convert', function () {
    [
      {
        from: ['empty', '<svg></svg>'],
        to: `
        empty : List (Attribute msg) -> Svg msg
        empty toSvgAttributes =
            Svg.svg
                (List.append
                    []
                    toSvgAttributes
                )
                []
        `
      },
      {
        from: ['attribute', '<svg fill="fff"></svg>'],
        to: `
        attribute : List (Attribute msg) -> Svg msg
        attribute toSvgAttributes =
            Svg.svg
                (List.append
                    [ Attributes.fill "fff"
                    ]
                    toSvgAttributes
                )
                []
        `
      },
      {
        from: ['x', '<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="feather feather-x"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>'],
        to:
`\
x : List (Attribute msg) -> Svg msg
x toSvgAttributes =
    Svg.svg
        (List.append
            [ Svg.Attributes.xmlns "http://www.w3.org/2000/svg"
            , Svg.Attributes.width "24"
            , Svg.Attributes.height "24"
            , Svg.Attributes.viewBox "0 0 24 24"
            , Svg.Attributes.fill "none"
            , Svg.Attributes.stroke "currentColor"
            , Svg.Attributes.strokeWidth "2"
            , Svg.Attributes.strokeLinecap "round"
            , Svg.Attributes.strokeLinejoin "round"
            , Svg.Attributes.class "feather feather-x"
            ]
            toSvgAttributes
        )
        [ Svg.line
            [ Svg.Attributes.x1 "18"
            , Svg.Attributes.y1 "6"
            , Svg.attributes.x2 "6"
            , Svg.attributes.y2 "18"
            ]
            []
        , Svg.line
            [ Svg.Attributes.x1 "6"
            , Svg.Attributes.y1 "6"
            , Svg.attributes.x2 "18"
            , Svg.attributes.y2 "18"
            ]
            []
        ]\
`,
      }
    ].forEach(({ from, to }) => {
      it(`converts ${from[0]} to elm`, async () => {
        const actual = await convert(...from)
        expect(actual).to.eq(to)
      })
    })
  })
})
