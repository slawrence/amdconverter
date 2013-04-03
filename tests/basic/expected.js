/**
 * @class PTO.something.TheClass
 */
define([
    "dojo/_base/declare",
    "../../Widget",
    "../../constants",
    "../../dialog/constants",
    "../../formatters",
    "../../gadget",
    "../../lang",
    "../../schema/services/ClaimService",
    "../../schema/services/ClaimSetService",
    "../../schema/services/SearchService",
    "../../some/Class",
    "../../something/OtherThing",
    "../../something/Thing",
    "../../thing/config",
    "../ConstructorProperty",
    "../UIConstructorProperty",
    "../document",
    "./Something",
    "./something",
    "dijit/Tooltip",
    "dijit/focus",
    "dijit/form/Button",
    "dijit/layout/utils",
    "dijit/place",
    "dijit/popup",
    "dijit/registry",
    "dijit/widget/thingy/Form",
    "dojo/Stateful",
    "dojo/_base/array",
    "dojo/_base/event",
    "dojo/_base/kernel",
    "dojo/_base/lang",
    "dojo/_base/window",
    "dojo/cookie",
    "dojo/dom",
    "dojo/dom-attr",
    "dojo/dom-class",
    "dojo/dom-construct",
    "dojo/dom-geometry",
    "dojo/dom-style",
    "dojo/has",
    "dojo/html",
    "dojo/io/iframe",
    "dojo/keys",
    "dojo/query",
    "dojo/ready",
    "dojo/store/Memory",
    "dojo/string",
    "plugins/ioc!../../logging/Logger"
], function (
    declare,
    Widget,
    constants,
    dialogConstants,
    formatters,
    gadget,
    lang,
    ClaimService,
    ClaimSetService,
    SearchService,
    Class,
    OtherThing,
    Thing,
    config,
    ConstructorProperty,
    UIConstructorProperty,
    document,
    Something,
    something,
    DijitTooltip,
    dijitFocus,
    dijitButton,
    dijitLayoutUtils,
    dijitPlace,
    dijitPopup,
    dijitRegistry,
    dijitForm,
    Stateful,
    dojoArray,
    dojoEvent,
    kernel,
    dojoLang,
    dojoWindow,
    cookie,
    dojoDom,
    domAttr,
    domClass,
    domConstruct,
    domGeom,
    domStyle,
    has,
    dojoHtml,
    dojoIframe,
    keys,
    dojoQuery,
    ready,
    Memory,
    dojoString,
    log
) {
    return declare('PTO.widget.document.DocumentViewerLoader', [Thing, OtherThing], {
        constructor: function () {
            var obj = new Class(),
                obj2 = new Widget(),
                formatted = formatters.formatName('John Doe');
            config.setConfigurationColor('blue');
            dojoLang.hitch({}, function (this.toString()));
        },

        svgNS: "http://www.w3.org/2000/svg",

        aMethod: function () {
            /**
             * Don't add this PTO.testing.framework.widget
             * // hope this doesn't cause problems // /////
             * " " ' //
             */
            // /* hello */ /* //'" /* \ndojo.elephant(); PTO.testing.somewhere.over
            gadget.class('PTO.GoGo.Gadget');
            log.debug('This shouldnt be ignored');
            domClass.add('class');
            domAttr.attr('aria');
            domAttr.has('data-some-attr');
            dojoDom.byId('someId');
            dojoDom.setSelectable({}, true);
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
            dialogConstants.CONSTANT = 5;
            var x = new ConstructorProperty();
            var xx = new UIConstructorProperty();
            dijitRegistry.someMethod();
            dijitRegistry.byId('id');
            dijitRegistry.byNode('node');
            dojoLang.clone(new Sheep());
            domGeom.contentBox('box');
            dojoArray.every('everyone');
            dojoArray.indexOf('index of');
            ORE.lang.isDefined('sdfsf');
            domGeom.marginBox('margin box');
            domGeom.position('positive');
            constants.SOMETHING = 23434;
            constants.widget.lowercaseoffconstants = 'sdfsdf';
            var a = keys;
            var b = keys.ENTER;
            var c = keys.some.ENTER.plus.ESC;
            Something = {};
            something.getOut();
            document.getOut();
            PTO.widget.document.getDocumentViewerLoader = function () {
                if (!loader) {
                    loader = new PTO.widget.document.DocumentViewerLoader();
                }
                return loader;
            };
            dijitPopup.open({this: 'this'});
            dijitPopup.close({this: 'this'});
            dijitPlace.at();
            domStyle.set('arg1', arg2, arg3);
            domStyle.set('arg1', arg2);
            dojoEvent.stop();
            domClass.toggle();
            domClass.remove();
            dojoQuery('sdfsdf', dom);
            dojoQuery.NodeList();
            dijitFocus.focus(domelement);
            dojoLang.trim('  sdfsdf   sdf  ');
            PTO.service.get('Employee');
            PTO.serviceFactory.something('');
            dojoString.substitute("${replace}", { replace: "this" });
            dojoString.trim("  sdf sdf ");
            updatedMetadataNode = domConstruct.toDom(this._createMetaDataDisplay(prop, value, pinned));
            dojoLang.isArray([]);
            dojoHtml.set(selectedTextItem, this.createSelectedMenuText(selection));
            PTO.widget.document.getDocumentViewerLoader();
            PTO.widget.document.markupKey.get();
            dojo.weeeirrd(); //no replacement rule setup, testing warning
            iframe = dojoIframe.create('printframe', '', 'documentPrint.jsp');
            cookie('sdfsf');
            dojoLang.isFunction(function () {});
            declare.safeMixin({}, {});
            domClass.contains('sdfsdf');
            domClass.replace('sdfsf');
            dijitRegistry.getEnclosingWidget();
            dialogConstants.BTN_CANCEL;
            dialogConstants.BTN_CANCEL.somethingelse;
            log('This is a logging statement');

            dojoLang.isString('sdfsdf');
            has('ie');
            has('webkit');
            domGeom.getBorderExtents();
            ready();
            dojoWindow.body();
            domStyle.getComputedStyle();
            dojoWindow.doc();
            domStyle.toPixelValues();
            domGeom.getMarginExtents();
            domGeom.getPadExtents();

            dijitLayoutUtils.layoutChildren();
            dijitLayoutUtils.marginBox2contentBox();

            ORE.NoAbstractMethodImplError();
            PTO.store.get("ObjectStore");
            DijitTooltip.show();
            DijitTooltip.hide();
            DijitTooltip({
                config: {}
            });

            new Stateful();

            dojoLang.getObject();

            new Memory({data: {"id": "fake"}, idProperty: "id"});

            kernel.deprecated("Don't use this!", "Use that!", "2.0");
        },

        templateString: 'something data-dojo-attach-point="pinnedDataNodeCenter">/something' +
            'asdfasdfdsf data-dojo-type' + 'data-dojo-attach-event';
    });
});
