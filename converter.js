var CONVERTER = (function (global) {
    var dependencies = {},
        ignore = {
            'PTO.app': true,
            'PTO.config': true,
            'PTO.log': true,
            'dojo.declare': true
        },
        shouldIgnore = function (string) {
            for (var prop in ignore) {
                if (string.indexOf(prop) === 0) {
                    return ignore[prop];
                }
            }
        },
        upperFirstChar = function (string) { return string.charAt(0).toUpperCase() + string.slice(1); },
        dependNameMap = {
            'dojo/dom-class': 'domClass',
            'dojo/dom-attr': 'domAttr',
            'dojo/dom': 'dojoDom',
            'dojo/_base/connect': 'dojoConnect',
            'dojo/dom-construct': 'domConstruct',
            'dojo/_base/declare': 'declare',
            'dojo/_base/array': 'dojoArray',
            'dojo/_base/lang': 'dojoLang',
            'dojo/keys': 'keys',
            'dojo/query': 'dojoQuery',
            'dojo/_base/event': 'dojoEvent',
            'dojo/dom-style': 'domStyle',
            'dojo/_base/window': 'dojoWindow',
            'dijit/registry': 'dijitRegistry'
        },
        replacements = [
            {
                pattern: /dojo\.addClass/g,
                depend: 'dojo/dom-class',
            },
            {
                pattern: /dojo\.attr/g,
                depend: 'dojo/dom-attr',
            },
            {
                pattern: /dojo\.byId/g,
                depend: 'dojo/dom',
            },
            {
                pattern: /dojo\.connect/g,
                depend: 'dojo/_base/connect',
            },
            {
                pattern: /dojo\.create/g,
                depend: 'dojo/dom-construct',
            },
            {
                pattern: /dojo\.declare/g,
                depend: 'dojo/_base/declare',
            },
            {
                pattern: /dojo\.destroy/g,
                depend: 'dojo/dom-construct',
            },
            {
                pattern: /dojo\.disconnect/g,
                depend: 'dojo/_base/connect',
            },
            {
                pattern: /dojo\.empty/g,
                depend: 'dojo/dom-construct',
            },
            {
                pattern: /dojo\.forEach/g,
                depend: 'dojo/_base/array',
            },
            {
                pattern: /dojo\.hasClass/g,
                depend: 'dojo/dom-class',
            },
            {
                pattern: /dojo\.hitch/g,
                depend: 'dojo/_base/lang',
            },
            {
                pattern: /dojo\.keys/g,
                depend: 'dojo/keys',
            },
            {
                pattern: /dojo\.map/g,
                depend: 'dojo/_base/array',
            },
            {
                pattern: /dojo\.mixin/g,
                depend: 'dojo/_base/lang',
            },
            {
                pattern: /dojo\.place/g,
                depend: 'dojo/dom-construct',
            },
            {
                pattern: /dojo\.query/g,
                depend: 'dojo/query',
            },
            {
                pattern: /dojo\.removeClass/g,
                depend: 'dojo/dom-class',
            },
            {
                pattern: /dojo\.replaceClass/g,
                depend: 'dojo/dom-class',
            },
            {
                pattern: /dojo\.some/g,
                depend: 'dojo/_base/array',
            },
            {
                pattern: /dojo\.stopEvent/g,
                depend: 'dojo/_base/event',
            },
            {
                pattern: /dojo\.style/g,
                depend: 'dojo/dom-style',
            },
            {
                pattern: /dojo\.toggleClass/g,
                depend: 'dojo/dom-class',
            },
            {
                pattern: /dojo\.window/g,
                depend: 'dojo/_base/window',
            },
            {
                pattern: /dijit\.byId/g,
                depend: 'dijit/registry',
            },
            {
                pattern: /PTO\.([\w\.]*)/g,
                repFn: function (all, rest) {
                    var pieces = rest.split('.');
                    this.depend = all;
                    //TODO: We can make assumptions here (I hope), if the last piece is capitalized it's a constructor
                    if (pieces.length > 2) {
                        this.alias = upperFirstChar(pieces[pieces.length - 2] + '.' +
                                             pieces[pieces.length -1]);
                    } else {
                        this.alias = upperFirstChar(rest);
                    }
                }
            },
            {
                pattern: /PTO
            }
        ];


    function convertDeclare(string) {
        var i, replacement;

        //do replacements of globals based on pattern/fn
        for (i = 0; i < replacements.length; i += 1) {
            replacement = replacements[i];

            string = string.replace(replacement.pattern, function (all) {
                var argArray, alias;
                if (shouldIgnore(all)) {
                    return all;
                }
                //apply fn if defined
                if (replacement.repFn) {
                    argArray = Array.prototype.slice.apply(arguments);
                    replacement.repFn.apply(replacement, argArray);
                }
                //determine alias (a repFn may define one)
                if (replacement.alias) {
                    alias = replacement.alias;
                } else {
                    //lookup on dependency map
                    alias = dependNameMap[replacement.depend];
                    if (!alias) {
                        console.error("Uh oh. Alias not specified.");
                    }
                }
                //TODO: Refactor
                if (dependencies[replacement.depend]) {
                    if (dependencies[replacement.depend][alias]) {
                        dependencies[replacement.depend][alias] += 1;
                    } else {
                        dependencies[replacement.depend][alias] = 1;
                    }
                } else {
                    dependencies[replacement.depend] = {};
                    dependencies[replacement.depend][alias] = 1;
                }
                return alias;
            });
        }
        return string;
    }

    function convertRequires(string) {
        //replace provide
        string = string.replace(/dojo\.provide\((?:'|")[\w\.]+(?:'|")\);/g, "");

        //replace requires
        return string;
    }

    return {
        convert: function (fileString) {
            return convertDeclare(convertRequires(fileString)).trim();
        },
        dependencies: dependencies
    };
}(window));
