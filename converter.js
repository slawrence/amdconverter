var CONVERTER = (function () {
    'use strict';
    var dependencies = {},
        warnings = [],
        currentPath,
        warn = function (message) {
            console.log(message);
            warnings.push(message);
        },
        ignore = {
            'PTO.app': true,
            'PTO.config': true,
            'PTO.isUndefined': true,
            'PTO.log': true
        },
        shouldIgnore = function (string) {
            var prop;
            for (prop in ignore) {
                if (ignore.hasOwnProperty(prop) && string.indexOf(prop) === 0) {
                    return ignore[prop];
                }
            }
        },
        addDependency = function (depend, alias) {
            if (!dependencies[depend]) {
                dependencies[depend] = alias;
            }
        },
        upperFirstChar = function (string) { return string.charAt(0).toUpperCase() + string.slice(1); },
        relative = function (source, target) {
            source = source.split("/");
            target = target.split("/");
            source.pop();
            while (0 !== source.length && 0 !== target.length && target[0] === source[0]) {
                source.shift();
                target.shift();
            }
            while (0 !== source.length) {
                source.shift();
                target.unshift('..');
            }
            return target.join("/");
        },
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
                pattern: /dojo\.(addClass[\w\.]*)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(attr[\w\.]*)/g,
                depend: 'dojo/dom-attr'
            },
            {
                pattern: /dojo\.(byId[\w\.]*)/g,
                depend: 'dojo/dom'
            },
            {
                pattern: /dojo\.(connect[\w\.]*)/g,
                depend: 'dojo/_base/connect'
            },
            {
                pattern: /dojo\.(create[\w\.]*)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(declare[\w\.]*)/g,
                depend: 'dojo/_base/declare',
                alias: 'declare',
                repFn: function (all) {
                    //hacky work around specifically for declare, since we don't won't to replace it till the end
                    addDependency(this.depend, this.alias);
                    return all;
                }
            },
            {
                pattern: /dojo\.(destroy[\w\.]*)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(disconnect[\w\.]*)/g,
                depend: 'dojo/_base/connect'
            },
            {
                pattern: /dojo\.(empty[\w\.]*)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(forEach[\w\.]*)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(hasClass[\w\.]*)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(hitch[\w\.]*)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(keys[\w\.]*)/g,
                depend: 'dojo/keys'
            },
            {
                pattern: /dojo\.(map[\w\.]*)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(mixin[\w\.]*)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(place[\w\.]*)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(query[\w\.]*)/g,
                depend: 'dojo/query'
            },
            {
                pattern: /dojo\.(removeClass[\w\.]*)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(replaceClass[\w\.]*)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(some[\w\.]*)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(stopEvent[\w\.]*)/g,
                depend: 'dojo/_base/event'
            },
            {
                pattern: /dojo\.(style[\w\.]*)/g,
                depend: 'dojo/dom-style'
            },
            {
                pattern: /dojo\.(toggleClass[\w\.]*)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(window[\w\.]*)/g,
                depend: 'dojo/_base/window'
            },
            {
                pattern: /dijit\.(byId[\w\.]*)/g,
                depend: 'dijit/registry'
            },
            {
                pattern: /dijit\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    //this matches returns best guess at dijit dependency
                    var pieces = rest.split("."),
                        last = pieces[pieces.length - 1];
                    this.alias = "dijit" + last;
                    this.depend = all.replace(/\./g, "/");
                }
            },
            {
                pattern: /PTO\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    var pieces = rest.split('.'),
                        last = pieces[pieces.length - 1],
                        toRelativePath = function (string) {
                            string = relative(currentPath.replace(/\./g, "/"), string.replace(/\./g, "/"));
                            if (string.indexOf(".") !== 0) {
                                string = "./" + string;
                            }
                            return string;
                        };
                    //We can make assumptions here (I hope), if the last piece is capitalized it's a constructor
                    if (last.charAt(0).match(/[A-Z]/)) {
                        this.alias = last;
                        this.depend = toRelativePath(all);
                    } else {
                        //it's a method
                        if (pieces.length > 1) {
                            //piece before last is alias
                            this.alias = pieces[pieces.length - 2] + "." + last;
                            //don't include method in dependency
                            this.depend = toRelativePath(all.replace(/\.[\w]+$/, ""));
                        } else {
                            //not sure what to do here, e.g. PTO
                            warn('A method off PTO was found: ' + all);
                            this.alias = all;
                            this.depend = toRelativePath(all);
                        }
                    }
                }
            }
        ];

    /**
     * Loops through replacements array. If the pattern is found the following steps are executed:
     * 1. return all (do no replacement) if should be ignored
     * 2. apply fn if defined
     * 3. assign dependency with alias to dependencies map
     */
    function replaceOldDojo(string) {
        var i,
            replacement;

        //do replacements of globals based on pattern/fn
        for (i = 0; i < replacements.length; i += 1) {
            replacement = replacements[i];

            string = string.replace(replacement.pattern, function (all, rest) {
                var argArray, alias, fnReturn;
                if (shouldIgnore(all)) {
                    return all;
                }
                //apply fn if defined
                if (replacement.repFn) {
                    argArray = Array.prototype.slice.apply(arguments);
                    fnReturn = replacement.repFn.apply(replacement, argArray);
                    //allow repFn to define replacement directly if it desires
                    if (typeof fnReturn !== "undefined") {
                        return fnReturn;
                    }
                }
                //determine alias (a repFn may define one)
                if (replacement.alias) {
                    alias = replacement.alias;
                } else {
                    //lookup on dependency map
                    alias = dependNameMap[replacement.depend] + "." + rest;
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


    /**
     * Basically replaces provide/require with empty strings
     */
    function convertRequires(string) {
        var providePattern = /dojo\.provide\((?:'|")[\w\.]+(?:'|")\);/g,
            requirePattern = /dojo\.require\((?:'|")([\w\.]+)(?:'|")\);/g;
        //replace provide
        string = string.replace(providePattern, "");

        //replace requires, add dependency
        string = string.replace(requirePattern, function (all, ns) {
            //TODO: Schemas have to be added to dependencies here?
            //addDependency(ns); //this shouldn't be necessary
            return "";
        });

        return string;
    }

    /*
     * creates define statement given dependency object
     */
    //TODO: Refactor
    function defineString(dependObject) {
        var str = "",
            tab = "    ",
            array = [],
            i,
            prop,
            cnt = 0;

        //let's make an array for sorting purposes
        for (prop in dependObject) {
            if (dependObject.hasOwnProperty(prop)) {
                array.push({
                    alias: dependObject[prop],
                    depend: prop
                });
            }
        }
        cnt = array.length;
        array.sort(function (a, b) {
            if (a.depend < b.depend) {
                return -1;
            }
            if (a.depend > b.depend) {
                return 1;
            }
            return 0;
        });

        str += "define([" + (cnt ? "\n" : "");
        for (i = 0; i < cnt; i += 1) {
            str += tab + "\"" + array[i].depend + "\"" + (i !== cnt - 1 ? ",\n" : "\n");
        }
        str += "], function (" + (cnt ? "\n" : "");
        for (i = 0; i < cnt; i += 1) {
            str += tab + array[i].alias.split('.')[0] + (i !== cnt - 1 ? ",\n" : "\n");
        }
        str += ") {\n";
        return str;
    }
    /**
     * Surround declare with define function. At this point we should have a populated dependency map.
     * NOTE: We can only convert files that have one declare statement!
     */
    function convertDeclare(string) {
        var declarePattern = /dojo\.declare\((?:'|")([\w\.]+)(?:'|"),\s*(null|[\w\.]+|\[[\w\.\s,]*\])[\S\s]*\}\);/g;
        return string.replace(declarePattern, function (all, className, parents) {
            //remove class name, it's not necessary.
            all = all.replace(/(?:'|")([\w\.]*)(:?'|"),\s*/, "");
            //surround with define
            all = defineString(dependencies) + "var model = " + all + "\nreturn model;\n});";
            return all;
        });
    }

    return {
        //nsRoot is period delimited namespace of the file's location
        convert: function (fileString, nsRoot) {
            currentPath = nsRoot || fileString.match(/dojo\.declare\((?:'|")([\w\.]*)(?:'|")/)[1] || undefined;
            dependencies = {}; //reset dependencies
            warnings = []; //reset warnings
            fileString = convertDeclare(replaceOldDojo(convertRequires(fileString))).trim();
            this.dependencies = dependencies;
            this.warnings = warnings;
            this.className = currentPath;
            //hacky workaround for declare, since we only want to replace it at the end
            return fileString.replace(/dojo\.declare/g, "declare");
        }
    };
}());
