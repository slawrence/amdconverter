var one;
this.CONVERTER = (function () {
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
        toRelativePath = function (string, current) {
            if (current) {
                string = relative(current.replace(/\./g, "/"), string.replace(/\./g, "/"));
                if (string.indexOf(".") !== 0) {
                    string = "./" + string;
                }
                return string;
            }
            return string;
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
            'dojo/dom-geometry': 'domGeom',
            'dojo/_base/window': 'dojoWindow',
            'dijit/registry': 'dijitRegistry'
        },
        /**
         * NOTE: Order matters! Each runs one after the other
         */
        replacements = [
            {
                pattern: /dojo\.(add)Class/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(attr)/g,
                depend: 'dojo/dom-attr'
            },
            {
                pattern: /dojo\.(byId)/g,
                depend: 'dojo/dom'
            },
            {
                pattern: /dojo\.(connect)/g,
                depend: 'dojo/_base/connect'
            },
            {
                pattern: /dojo\.(create)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(declare)/g,
                depend: 'dojo/_base/declare',
                alias: 'declare',
                repFn: function (all) {
                    //hacky work around specifically for declare, since we don't won't to replace it till the end
                    addDependency(this.depend, this.alias);
                    return all;
                }
            },
            {
                pattern: /dojo\.(destroy)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(disconnect)/g,
                depend: 'dojo/_base/connect'
            },
            {
                pattern: /dojo\.(empty)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(forEach)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(hasClass)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(hitch)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.keys[\.]?([\w\.]*)/g,
                depend: 'dojo/keys'
            },
            {
                pattern: /dojo\.(map)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(mixin)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(place)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(query)/g,
                depend: 'dojo/query'
            },
            {
                pattern: /dojo\.(removeClass)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(replaceClass)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(some)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(stopEvent)/g,
                depend: 'dojo/_base/event'
            },
            {
                pattern: /dojo\.(style)/g,
                depend: 'dojo/dom-style'
            },
            {
                pattern: /dojo\.(toggleClass)/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(window[\w\.]*)/g,
                depend: 'dojo/_base/window'
            },
            {
                pattern: /dojo\.(clone)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(contentBox)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dojo\.(every)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(indexOf)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(marginBox)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dojo\.(position)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dijit\.(byId)/g,
                depend: 'dijit/registry'
            },
            {
                pattern: /dijit\.(byNode)/g,
                depend: 'dijit/registry'
            },
            {
                pattern: /dijit\.registry\.([\w\.]+)/g,
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
                pattern: /PTO\.constants\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    this.alias = 'constants.' + rest;
                    this.depend = toRelativePath('PTO.constants', currentPath);
                }
            },
            {
                pattern: /PTO\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    var pieces = rest.split('.'),
                        last = pieces[pieces.length - 1];

                    //First, make sure the match is not itself
                    if (currentPath && currentPath === all) {
                        warn('Reference to itself found. Not replacing: ' + all);
                        return all; //ignore
                    }

                    //Is the match a constructor?
                    if (last.match(/^[A-Z][a-z_\$][\w]*/)) {
                        this.alias = last;
                        this.depend = toRelativePath(all, currentPath);
                    } else {
                        //it's a method or constant
                        if (pieces.length > 1) {
                            //piece before last is alias
                            this.alias = pieces[pieces.length - 2] + "." + last;
                            //don't include method in dependency
                            this.depend = toRelativePath(all.replace(/\.[\w]+$/, ""), currentPath);
                        } else {
                            //this will be methods directly off PTO, i.e. PTO.isDefined, PTO.isUndefined
                            this.alias = "lang." + rest;
                            this.depend = toRelativePath("PTO.lang", currentPath);
                        }
                    }
                }
            },
            {
                pattern: /ORE\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    warn('Reference to ORE found: ' + all)
                    return all;
                }
            }
        ];


    /**
     * Runs a replacement operation on a string using the replacements array
     */
    function replace(string, replacement, inString, inComment) {
        return string.replace(replacement.pattern, function (all, rest) {
            var argArray, alias, fnReturn;
            if (shouldIgnore(all) || (!replacement.commentAgnostic && inComment) || (!replacement.stringAgnostic && inString)) {
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
                if (!replacement.depend) {
                    console.error("Uh oh. Dependency not defined for alias");
                }
            } else {
                //If an alias was not defined, use default alias based on depend map and regex 'rest' capture
                alias = dependNameMap[replacement.depend] + (rest ? "." + rest : "");
                if (!alias) {
                    console.error("Uh oh. Alias not specified.");
                }
            }
            addDependency(replacement.depend, alias);
            return alias;
        });
    }

    /**
     * Loops through replacements array. If the pattern is found the following steps are executed:
     * 1. return all (do no replacement) if should be ignored
     * 2. apply fn if defined
     * 3. assign dependency with alias to dependencies map
     */
    function replaceOldDojo(oldString) {
        var i,
            j,
            whole = "",
            pieces,
            piece,
            currentComment,
            currentString,
            inComment = false,
            inString = false,
            delimiters = /(\/\*|\*\/|"|'|\/\/|(?:\r\n?|\n))/g;

        pieces = oldString.split(delimiters);
        for (i = 0; i < pieces.length; i += 1) {
            piece = pieces[i];
            if (currentComment) {
                if ((currentComment !== "//" && piece === "*/") || (currentComment === "//" && piece.match(/(\r\n?|\n)/))) {
                    currentComment = undefined;
                }
            } else {
                if (piece === "/*" || piece === "//") {
                    currentComment = piece;
                }
            }
            inComment = !!currentComment;

            //only handle strings if not in a comment
            if (!inComment) {
                if (currentString && currentString === piece) {
                    currentString = undefined;
                } else {
                    if (!currentString && (piece === "'" || piece === '"')) {
                        currentString = piece;
                    }
                }
                inString = !!currentString;
            }

            //run the replacements
            for (j = 0; j < replacements.length; j += 1) {
                if (!piece.match(delimiters)) {
                    piece = replace(piece, replacements[j], inString, inComment);
                }
            }
            whole += piece;
        }
        return whole;
    }

    /**
     * Basically replaces provide/require wit) empty strings
     */
    function convertRequires(string, path) {
        var providePattern = /dojo\.provide\((?:'|")[\w\.]+(?:'|")\);/g,
            requirePattern = /dojo\.require\((?:'|")([\w\.]+)(?:'|")\);/g;
        //replace provide
        string = string.replace(providePattern, "");

        //replace requires, add dependency
        string = string.replace(requirePattern, function (all, ns) {
            var match = ns.match(/PTO\.schema\.services\.([\w\.]+)/),
                alias;
            if (match) {
                alias = match[1];
                addDependency(toRelativePath("PTO.schema.services", path) + "/" + alias, alias);
            }
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
        var declarePattern = /dojo\.declare\((?:(?:'|")([\w\.]+)(?:'|"),)?\s*(null|[\w\.]+|\[[\w\.\s,]*\])([\S\s]*)\}\);/g;
        return string.replace(declarePattern, function (all, className, parents, rest) {
            var newDeclare = "declare('" + className + "', " + parents + rest;
            newDeclare = defineString(dependencies) + "var model = " + newDeclare + "\n});\nreturn model;\n});";
            return newDeclare;
        });
    }

    /**
     * We use the first argument of the declare signature to get the current "path"
     */
    function getCurrentPath(string, nsRoot) {
        var declarePath = string.match(/dojo\.declare\((?:'|")([\w\.]*)(?:'|")/);
        currentPath = nsRoot || declarePath ? declarePath[1] : undefined;
        if (!currentPath) {
            warn('Current path could not be determined. Unable to provide relative paths.');
        }
    }

    /**
     * In case the same instance is used repeatedly, reset private vars
     */
    function reset() {
        dependencies = {};
        warnings = [];
        currentPath = undefined;
    }

    return {
        //nsRoot is period delimited namespace of the file's location
        convert: function (fileString, nsRoot) {
            reset();
            getCurrentPath(fileString, nsRoot);
            fileString = convertDeclare(replaceOldDojo(convertRequires(fileString, currentPath))).trim();
            this.warnings = warnings;
            //hacky workaround for declare, since we only want to replace it at the end
            return fileString.replace(/dojo\.declare/g, "declare");
        }
    };
}());
