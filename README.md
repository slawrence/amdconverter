AMD Converter
==================

## Quick Start

* `git clone https://github.com/slawrence/amdconverter.git`
* `cd amdconverter`
* `python -m SimpleHTTPServer 8000`
* Open in browser: `localhost:8000`

Or use apache.

## Replacements

`converter.js` has an array called `replacements` that defines each replacement. The script runs each one serially, so order is important. It also declares a object map called `dependNameMap`, which defines each dependency and its "alias". Over time the definition of these rules have become pretty funky, but the gist of them is they specify a `pattern` and a `depend` property. The `pattern` property defines what is replaced. The first grouping item is the method. The `depend` property is used to lookup the alias.

## Hardlink converter.js

Optional: Link converter.js to the converter.js on the projects svn trunk so changes are synced.

* `ln converter.js /your/svn/trunk/node/location/converter.js`

## Add a test

* Add test name to `testNames.json` in root dir

        {
            tests: [
                'basic',
                'yourtestname' // <-- Added test
            ]
        }

* Create a `yourtestname` folder in the `tests` directory
* Create `input.js` and `expected.js` files in the `yourtestname` directory
    * `input.js` should be in the format of the old style dojo api (1.6)
    * `expected.js` should be the expected result of the conversion

* Example directory stucture:

        - amdconverter/
            - tests/
                - basic/
                    - input.js
                    - expected.js
                - yourtestname/
                    - input.js
                    - expected.js


