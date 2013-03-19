dojo.provide('PTO.something.OtherThing');
dojo.require('PTO.something.Thing');
dojo.require('PTO.some.Class');
dojo.require('PTO.thing.config');
dojo.require('PTO.formatters');
dojo.require('PTO.widget');
dojo.require('PTO.schema.services.ClaimService');
dojo.require('PTO.schema.services.SearchService');
dojo.require('PTO.schema.services.ClaimSetService');

/**
 * @class PTO.something.TheClass
 */

dojo.declare('PTO.widget.document.DocumentViewerLoader', [PTO.something.Thing, PTO.something.OtherThing], {
    constructor: function () {
        var obj = new PTO.some.Class(),
            obj2 = new PTO.Widget(),
            formatted = PTO.formatters.formatName('John Doe');
        PTO.thing.config.setConfigurationColor('blue');
        dojo.hitch({}, function (this.toString()));
    },

    svgNS: "http://www.w3.org/2000/svg",

    aMethod: function () {
        /**
         * Don't add this PTO.testing.framework.widget
         * // hope this doesn't cause problems // /////
         * " " ' //
         */
        // /* hello */ /* //'" /* \ndojo.elephant(); PTO.testing.somewhere.over
        PTO.gadget.class('PTO.GoGo.Gadget');
        PTO.log.debug('This shouldnt be ignored');
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
        ORE.lang.isDefined('sdfsf');
        dojo.marginBox('margin box');
        dojo.position('positive');
        PTO.constants.SOMETHING = 23434;
        PTO.constants.widget.lowercaseoffconstants = 'sdfsdf';
        var a = dojo.keys;
        var b = dojo.keys.ENTER;
        var c = dojo.keys.some.ENTER.plus.ESC;
        PTO.widget.document.Something = {};
        PTO.widget.document.something.getOut();
        PTO.widget.document.getOut();
        PTO.widget.document.getDocumentViewerLoader = function () {
            if (!loader) {
                loader = new PTO.widget.document.DocumentViewerLoader();
            }
            return loader;
        };
        dijit.popup.open({this: 'this'});
        dijit.popup.close({this: 'this'});
        dijit.placeOnScreen();
        dojo.style('arg1', arg2, arg3);
        dojo.style('arg1', arg2);
        dojo.stopEvent();
        dojo.toggleClass();
        dojo.removeClass();
        dojo.query('sdfsdf', dom);
        dijit.focus(domelement);
        dojo.trim('  sdfsdf   sdf  ');
        PTO.service.get('Employee');
        PTO.serviceFactory.something('');
        dojo.string.substitute("${replace}", { replace: "this" });
        dojo.string.trim("  sdf sdf ");
        updatedMetadataNode = dojo._toDom(this._createMetaDataDisplay(prop, value, pinned));
        dojo.isArray([]);
        dojo.html.set(selectedTextItem, this.createSelectedMenuText(selection));
        PTO.widget.document.getDocumentViewerLoader();
        PTO.widget.document.markupKey.get();
        dojo.weeeirrd(); //no replacement rule setup, testing warning
        iframe = dojo.io.iframe.create('printframe', '', 'documentPrint.jsp');
        dojo.cookie('sdfsf');
        dojo.isFunction(function () {});
        dojo.safeMixin({}, {});
        dojo.hasClass('sdfsdf');
        dojo.replaceClass('sdfsf');
        dijit.getEnclosingWidget();
        PTO.dialog.BTN_CANCEL;
        PTO.dialog.BTN_CANCEL.somethingelse;
        PTO.log('This is a logging statement');

        dojo.isString('sdfsdf');
        dojo.isIE;
        dojo._getBorderExtents();
        dojo.ready();
        dojo.body();
        dojo.getComputedStyle();
        dojo.doc();
        dojo._toPixelValue();
        dojo._getMarginExtents();
        dojo._getPadExtents();
    },

    templateString: 'something dojoAttachPoint="pinnedDataNodeCenter">/something' +
        'asdfasdfdsf dojoType' + 'dojoAttachEvent';
});
