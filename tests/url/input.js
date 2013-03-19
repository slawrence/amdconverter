dojo.provide('PTO.framework.GadgetCollapsedTitlesWidget');

/**
 * Creates the rotated titles for a collapsed gadget container.  Constructor parameter:
 *
 * gadgets: an array of the gadgets in the collapsed gadget container.  This widget will reference this array
 * any time a gadget's title changes.
 */
dojo.declare('PTO.framework.GadgetCollapsedTitlesWidget', dijit._Widget, {

    /**
     * Widget base CSS class.
     */
    baseClass: "ptoCollapsedGadgetWrapper",

    /**
     * The SVG namespace for the DOM elements.
     */
    svgNS: "http://www.w3.org/2000/svg",

    method: function () {
        dojo.place();
    }
});
