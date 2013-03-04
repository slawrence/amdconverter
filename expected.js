/**
 * @class PTO.something.TheClass
 */

define([
    "../Widget",
    "../constants",
    "../dialog",
    "../formatters",
    "../gadget",
    "../lang",
    "../some/Class",
    "../thing/config",
    "../widget/ConstructorProperty",
    "./OtherThing",
    "./Thing",
    "dijit/form/Button",
    "dijit/registry",
    "dijit/widget/thingy/Form",
    "dojo/_base/array",
    "dojo/_base/declare",
    "dojo/_base/lang",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/keys"
], function (
    Widget,
    constants,
    dialog,
    formatters,
    gadget,
    lang,
    Class,
    config,
    ConstructorProperty,
    OtherThing,
    Thing,
    dijitButton,
    dijitRegistry,
    dijitForm,
    dojoArray,
    declare,
    dojoLang,
    dojoDom,
    domAttr,
    domClass,
    domConstruct,
    domGeom,
    keys
) {
var model = declare('PTO.something.TheClass', [Thing, OtherThing], {
    constructor: function () {
        var obj = new Class(),
            obj2 = new Widget(),
            formatted = formatters.formatName('John Doe');
        config.setConfigurationColor('blue');
        dojoLang.hitch({}, function (this.toString()));
    },

    aMethod: function () {
        /**
         * Don't add this PTO.testing.framework.widget
         * // hope this doesn't cause problems // /////
         * " " ' //
         */
        // /* hello */ /* //'" /* \ndojo.elephant(); PTO.testing.somewhere.over
        gadget.class('PTO.GoGo.Gadget');
        PTO.log.debug('This should be ignored');
        domClass.add('class');
        domAttr.attr('aria');
        dojoDom.byId('someId');
        domConstruct.place('' + title + '', html);
        domConstruct.place('<span id="printCaseTitle" style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">' +
                title + '</span>', html);
        
        domConstruct.destroy();
        domConstruct.place('');
        dojoArray.forEach('');
        domConstruct.empty();
        lang.thisShouldGenerateAWarning();
        new dijitButton({});
        new dijitForm();
        dialog.CONSTANT = 5;
        var x = new ConstructorProperty();
        dijitRegistry.someMethod();
        dijitRegistry.byId('id');
        dijitRegistry.byNode('node');
        dojoLang.clone(new Sheep());
        domGeom.contentBox('box');
        dojoArray.every('everyone');
        dojoArray.indexOf('index of');
        domGeom.marginBox('margin box');
        domGeom.position('positive');
        constants.SOMETHING = 23434;
        constants.widget.lowercaseoffconstants = 'sdfsdf';
        var a = keys;
        var b = keys.ENTER;
        var c = keys.some.ENTER.plus.ESC;
    }
});
return model;
});
