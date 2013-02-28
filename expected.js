/**
 * @class PTO.something.TheClass
 */

define([
    "../Widget",
    "../dialog",
    "../formatters",
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
    "dojo/dom-geometry"
], function (
    Widget,
    dialog,
    formatters,
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
    domGeom
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
        PTO.log.debug('This should be ignored');
        domClass.add('class');
        domAttr.attr('aria');
        dojoDom.byId('someId');
        domConstruct.destroy();
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
    }
});
return model;
});
