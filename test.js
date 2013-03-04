dojo.provide('PTO.something.OtherThing');
dojo.require('PTO.something.Thing');
dojo.require('PTO.some.Class');
dojo.require('PTO.thing.config');
dojo.require('PTO.formatters');
dojo.require('PTO.widget');

/**
 * @class PTO.something.TheClass
 */

dojo.declare('PTO.something.TheClass', [PTO.something.Thing, PTO.something.OtherThing], {
    constructor: function () {
        var obj = new PTO.some.Class(),
            obj2 = new PTO.Widget(),
            formatted = PTO.formatters.formatName('John Doe');
        PTO.thing.config.setConfigurationColor('blue');
        dojo.hitch({}, function (this.toString()));
    },

    aMethod: function () {
        /**
         * Don't add this PTO.testing.framework.widget
         * // hope this doesn't cause problems // /////
         * " " ' //
         */
        // /* hello */ /* //'" /* \ndojo.elephant(); PTO.testing.somewhere.over
        PTO.gadget.class('PTO.GoGo.Gadget');
        PTO.log.debug('This should be ignored');
        dojo.addClass('class');
        dojo.attr('aria');
        dojo.byId('someId');
        dojo.place('' + title + '', html);
        dojo.place('<span id="printCaseTitle" style="display: inline-block; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; max-width: 80%;">' +
                title + '</span>', html);
        dojo.destroy();
        dojo.place('');
        dojo.forEach('');
        dojo.empty();
        PTO.thisShouldGenerateAWarning();
        new dijit.form.Button({});
        new dijit.widget.thingy.Form();
        PTO.dialog.CONSTANT = 5;
        var x = new PTO.widget.ConstructorProperty();
        dijit.registry.someMethod();
        dijit.byId('id');
        dijit.byNode('node');
        dojo.clone(new Sheep());
        dojo.contentBox('box');
        dojo.every('everyone');
        dojo.indexOf('index of');
        dojo.marginBox('margin box');
        dojo.position('positive');
        PTO.constants.SOMETHING = 23434;
        PTO.constants.widget.lowercaseoffconstants = 'sdfsdf';
        var a = dojo.keys;
        var b = dojo.keys.ENTER;
        var c = dojo.keys.some.ENTER.plus.ESC;
    }
});
