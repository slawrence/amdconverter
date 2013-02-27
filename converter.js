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
                pattern: /PTO\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    var pieces = rest.split('.');
                    //TODO: We can make assumptions here (I hope), if the last piece is capitalized it's a constructor
                    if (pieces[pieces.length - 1].charAt(0).match(/[A-Z]/)) {
                        this.alias = pieces[pieces.length -1];
                        this.depend = all;
                    } else {
                        //it's a method
                        if (pieces.length > 2) {
                            this.alias = pieces[pieces.length - 2] + '.' +
                                                 pieces[pieces.length -1];
                            this.depend = pieces[pieces.length - 2];
                        } else {
                            this.alias = rest;
                            this.depend = pieces[0];
                        }
                    }
                }
            }
        ];


    function replaceOldDojo(string) {
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
                addDependency(replacement.depend, alias);
                return alias;
            });
        }
        return string;
    }

    //TODO: Refactor!
    function addDependency(depend, alias) {
        if (!dependencies[depend]) {
            dependencies[depend] = alias;
        }
        //if (dependencies[depend]) {
            //if (alias) {
                //if (dependencies[depend][alias]) {
                    //dependencies[depend][alias] += 1;
                //} else {
                    //dependencies[depend][alias] = 1;
                //}
            //}
        //} else {
            //dependencies[depend] = {};
            //if (alias) {
                //dependencies[depend][alias] = 1;
            //}
        //}
    }

    function convertRequires(string) {
        //replace provide
        string = string.replace(/dojo\.provide\((?:'|")[\w\.]+(?:'|")\);/g, "");

        //replace requires, add dependency
        string = string.replace(/dojo\.require\((?:'|")([\w\.]+)(?:'|")\);/g, function (all, ns) {
            //addDependency(ns); //this shouldn't be necessary
            return "";
        });
        return string;
    }

    function convertDeclare(string) {
        return string.replace(/dojo\.declare\((?:'|")([\w\.]+)(?:'|"),\s*(null|[\w\.]+|\[[\w\.\s,]*\])[\S\s]*\}\);/g, function (all, className, parents) {
            //remove class name, it's not necessary.
            all = all.replace(/('|")[\w\.]*('|"),\s*/, "");
            //add return
            all = "return " + all;
            //surround with define
            all = defineString(dependencies) + all + "\n});";
            return all;
        });
    }

    //creates define statement given dependency object
    //TODO: Refactor
    function defineString(dependObject) {
        var str = "",
            tab = "    ",
            cnt = 0;

        for (var prop in dependObject) {
            cnt += 1;
        }

        str += "define([" + (cnt ? "\n" : "");
        for (var prop in dependObject) {
            str += tab + "\"" + prop + "\"\n";
        }
        str += "], function (" + (cnt ? "\n" : "");
        for (var prop in dependObject) {
            str += tab + dependObject[prop].split('.')[0] + "\n";
        }
        str += ") {\n";
        return str;
    }

    return {
        convert: function (fileString) {
            return convertDeclare(replaceOldDojo(convertRequires(fileString))).trim();
        },
        dependencies: dependencies
    };
}(window));
