var one;
this.CONVERTER = (function () {
    'use strict';
    var dependencies = {},
        warnings = [],
        currentPath,
        warn = function (message) {
            warnings.push(message);
        },
        ignore = {
            'PTO.app': true,
            'PTO.config': true,
            'PTO.service': true,
            'PTO.store': true,
            'PTO.serviceFactory': true,
            'PTO.widget.document.getDocumentViewer': true,
            'PTO.widget.document.markupKey': true
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
            var before = string, pieces;
            if (current) {
                string = relative(current.replace(/\./g, "/"), string.replace(/\./g, "/"));
                //hack workaround for references to the folder current class is in
                if (string === "") {
                    pieces = current.split('.');
                    if (pieces.length > 2) {
                        return "../" + pieces[pieces.length - 2];
                    }
                    warn('Difficulties defining relative path for: ' + string + ' - ignoring');
                    return current;
                }
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
            'dojo/html': 'dojoHtml',
            'dojo/_base/connect': 'dojoConnect',
            'dojo/cookie': 'cookie',
            'dojo/dom-construct': 'domConstruct',
            'dojo/_base/declare': 'declare',
            'dojo/_base/array': 'dojoArray',
            'dojo/io/iframe': 'dojoIframe',
            'dojo/_base/lang': 'dojoLang',
            'dojo/_base/kernel': 'kernel',
            'dojo/keys': 'keys',
            'dojo/_base/event': 'dojoEvent',
            'dojo/dom-style': 'domStyle',
            'dojo/dom-geometry': 'domGeom',
            'dojo/_base/window': 'dojoWindow',
            'dojo/string': 'dojoString',
            'dojo/ready': 'ready',
            'dojo/has': 'has',
            'dojo/Stateful': 'Stateful',
            'dojo/store/Memory': 'Memory',
            'dijit/registry': 'dijitRegistry',
            'dijit/popup': 'dijitPopup',
            'dijit/focus': 'dijitFocus',
            'dijit/layout/utils': 'dijitLayoutUtils',
            'dijit/Tooltip': 'DijitTooltip'
        },
        /**
         * NOTE: Order matters! Each runs one after the other
         */
        replacements = [
            {
                pattern: /dojoAttachPoint/g,
                stringAgnostic: true,
                repFn: function (all) {
                    return 'data-dojo-attach-point';
                }
            },
            {
                pattern: /dojoType/g,
                stringAgnostic: true,
                repFn: function (all) {
                    return 'data-dojo-type';
                }
            },
            {
                pattern: /dojoAttachEvent/g,
                stringAgnostic: true,
                repFn: function (all) {
                    return 'data-dojo-attach-event';
                }
            },
            {
                pattern: /dojo\.(add)Class/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(trim)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(isString)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(getObject)/g,
                depend: 'dojo/_base/lang',
                repFn: function (all) {
                    warn('dojo.getObject relies on globals - refactor to make dojo.getObject unnecessary');
                }
            },
            {
                pattern: /dojo\.isIE/g,
                depend: 'dojo/has',
                repFn: function (all) {
                    warn('dojo.IsIE detected - replaced with has("ie"). Please double check the replacement for cases where a specific version of IE needed to be detected');
                    addDependency(this.depend, dependNameMap[this.depend]);
                    return "has('ie')";
                }
            },{
                pattern: /dojo\.isWebKit/g,
                depend: 'dojo/has',
                repFn: function (all) {
                    addDependency(this.depend, dependNameMap[this.depend]);
                    return "has('webkit')";
                }
            },
            {
                pattern: /dojo\.(attr)/g,
                depend: 'dojo/dom-attr',
                repFn: function (all) {
                    warn('WARNING: Found a reference to dojo.attr: Because of the changes to dojo API you will have to manually find each instance and replace "attr" method with either get/set/has/etc. Also see dom-prop.');
                }
            },
            {
                pattern: /dojo\.(byId)/g,
                depend: 'dojo/dom'
            },
            {
                pattern: /dojo\.(setSelectable)/g,
                depend: 'dojo/dom'
            },
            {
                pattern: /dojo\.Stateful()/g,
                depend: 'dojo/Stateful'
            },
            {
                pattern: /dojo\.store\.Memory()/g,
                depend: 'dojo/store/Memory'
            },
            {
                pattern: /dojo\.html\.(set)/g,
                depend: 'dojo/html'
            },
            {
                pattern: /dojo\.(connect)/g,
                depend: 'dojo/_base/connect'
            },
            {
                pattern: /dojo\._toDom/g,
                rest: 'toDom',
                depend: 'dojo/dom-construct'
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
                    //hacky work around specifically for declare, since we don't want to replace it until the end
                    addDependency(this.depend, this.alias);
                    return all;
                }
            },
            {
                pattern: /dojo\.(destroy)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.(safeMixin)/g,
                depend: 'dojo/_base/declare'
            },
            {
                pattern: /dojo\.(filter)/g,
                depend: 'dojo/_base/array'
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
                pattern: /dojo\.hasClass/g,
                rest: 'contains',
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(hitch)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.(deprecated)/g,
                depend: 'dojo/_base/kernel'
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
                pattern: /dojo\.(isFunction)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.cookie()/g,
                depend: 'dojo/cookie'
            },
            {
                pattern: /dojo\.(place)/g,
                depend: 'dojo/dom-construct'
            },
            {
                pattern: /dojo\.query/g,
                alias: 'dojoQuery',
                depend: 'dojo/query'
            },
            {
                pattern: /dojo\.(remove)Class/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(replace)Class/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(some)/g,
                depend: 'dojo/_base/array'
            },
            {
                pattern: /dojo\.(stop)Event/g,
                depend: 'dojo/_base/event'
            },
            {
                pattern: /dojo\.string\.([\w\.]+)/g,
                depend: 'dojo/string'
            },
            {
                pattern: /dojo\.io\.iframe\.([\w\.]+)/g,
                depend: 'dojo/io/iframe'
            },
            {
                pattern: /dojo\.(getComputedStyle)/g,
                depend: 'dojo/dom-style'
            },
            {
                pattern: /dojo\.\_toPixelValue/g,
                rest: 'toPixelValues',
                depend: 'dojo/dom-style'
            },
            {
                pattern: /dojo\.style/g,
                depend: 'dojo/dom-style',
                alias: 'domStyle.set',
                repFn: (function (all) {
                    var alreadyWarned = false;
                    return function () {
                        if (!alreadyWarned) {
                            warn('WARNING - This file contains references to dojo.style. All instances were replaced by domStyle.set. You need to check to make sure that domStyle.get was not actually needed in the case only two arguments.');
                            alreadyWarned = true;
                        }
                    };
                }())
            },
            {
                pattern: /dojo\.(toggle)Class/g,
                depend: 'dojo/dom-class'
            },
            {
                pattern: /dojo\.(window[\w\.]*)/g,
                depend: 'dojo/_base/window'
            },
            {
                pattern: /dojo\.(body)/g,
                depend: 'dojo/_base/window'
            },
            {
                pattern: /dojo\.(doc)/g,
                depend: 'dojo/_base/window'
            },
            {
                pattern: /dojo\.(clone)/g,
                depend: 'dojo/_base/lang'
            },
            {
                pattern: /dojo\.ready()/g,
                depend: 'dojo/ready'
            },
            {
                pattern: /dojo\.(contentBox)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dojo\.\_(getBorderExtents)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dojo\.\_(getMarginExtents)/g,
                depend: 'dojo/dom-geometry'
            },
            {
                pattern: /dojo\.\_(getPadExtents)/g,
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
                pattern: /dojo\.(isArray)/g,
                depend: 'dojo/_base/lang'
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
                pattern: /dijit\.(getEnclosingWidget)/g,
                depend: 'dijit/registry'
            },
            {
                pattern: /dijit\.popup\.([\w\.]*)/g,
                depend: 'dijit/popup'
            },
            {
                pattern: /dijit\.placeOnScreen/g,
                alias: 'dijitPlace.at',
                depend: 'dijit/place'
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
                pattern: /dijit\.(focus)/g,
                depend: 'dijit/focus'
            },
            {
                pattern: /dijit\.(show)Tooltip/g,
                depend: 'dijit/Tooltip'
            },
            {
                pattern: /dijit\.(hide)Tooltip/g,
                depend: 'dijit/Tooltip'
            },
            {
                pattern: /dijit\.Tooltip()/g,
                depend: 'dijit/Tooltip'
            },
            {
                pattern: /dijit\.layout\.(layoutChildren)/g,
                depend: 'dijit/layout/utils'
            },
            {
                pattern: /dijit\.layout\.(marginBox2contentBox)/g,
                depend: 'dijit/layout/utils'
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
                pattern: /PTO\.dialog\.([A-Z_]+[\w\.]*)/g,
                repFn: function (all, rest) {
                    this.alias = 'dialogConstants.' + rest;
                    this.depend = toRelativePath('PTO.dialog.constants', currentPath);
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
                pattern: /PTO\.log([\w\.]*)/g,
                repFn: function (all, rest) {
                    this.alias = 'log' + rest;
                    this.depend = 'plugins/ioc!' + toRelativePath('PTO.logging.Logger', currentPath);
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
            /*
            {
                pattern: /ORE\.([\w\.]+Error)/g,
                repFn: function (all, rest) {
                    this.alias = 'errors.' + rest;
                    this.depend = toRelativePath('PTO.errors', currentPath);
                }
            },
           */
            {
                pattern: /ORE\.([\w\.]+)/g,
                repFn: function (all, rest) {
                    warn('Reference to ORE found: ' + all);
                    return all;
                }
            },
            {
                pattern: /dojo\.[\w\.]+/g,
                repFn: function (all, rest) {
                    if (all !== "dojo.declare") { //declare isn't replaced till end
                        warn('Still references to dojo unreplaced: ' + all);
                    }
                    return all;
                }
            },
            {
                pattern: /dijit\.[\w\.]+/g,
                repFn: function (all, rest) {
                    warn('Still references to dijit unreplaced: ' + all);
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
                if (shouldIgnore(all)) {
                    warn("Ignoring '" + all + "' because of ignore rule");
                }
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
                rest = replacement.rest || rest;
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
                if (!inString && (piece === "/*" || piece === "//")) {
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
            requirePattern = /dojo\.require\((?:'|")([\w\.]+)(?:'|")\);/g,
            addDependencyIfMatch = function (matchedString, ns, regex) {
                var match = matchedString.match(regex),
                    alias;
                if (match) {
                    alias = match[1];
                    addDependency(toRelativePath(matchedString, path), alias);
                }
                return "";
            };

        //replace provide
        string = string.replace(providePattern, "");

        //replace requires, add dependency for any services found in schema/services or schema/channels
        string = string.replace(requirePattern, function (all, ns) {
            addDependencyIfMatch(ns, "PTO.schema.services", /PTO\.schema\.services[\w\.]*\.([\w]+$)/);
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
            if (a.depend === 'dojo/_base/declare') {
                return -1;
            }
            if (b.depend === 'dojo/_base/declare') {
                return 1;
            }
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
        var declarePattern = /dojo\.declare\((?:(?:'|")([\w\.]+)(?:'|"),)?\s*(null|[\w\.\_]+|\[[\w\.\_\s,]*\])([\S\s]*)\}\);/g;

        return string.replace(declarePattern, function (all, className, parents, rest) {
            var newDeclare;
            //add tabbing
            rest = rest.replace(/(\r\n?|\n)/g, function (all, match) {
                return match + "    ";
            });
            newDeclare = "declare('" + className + "', " + parents + rest;
            newDeclare = defineString(dependencies) + "    return " + newDeclare + "\n    });\n});";
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