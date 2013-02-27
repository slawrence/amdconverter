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
        PTO.log.debug('This should be ignored');
        dojo.addClass('class');
        dojo.attr('aria');
        dojo.byId('someId');
        dojo.destroy();
        dojo.empty();
        PTO.thisShouldGenerateAWarning();
        new dijit.form.Button({});
        new dijit.widget.thingy.Form();
    }
});
