dojo.provide('PTO.framework.FrameworkComponent');
dojo.require('PTO.framework.FrameworkRegistry');

/**
 * @class PTO.framework.FrameworkComponent
 */

dojo.declare('PTO.framework.FrameworkComponent', null, {

    constructor: function () {
        this.register();
    },

    register: function () {
        if (this.frameworkId) {
            PTO.log.warn('Error: framework component ' + this.declaredClass + ' has already been registered');
            return 1;
        }
        this.frameworkId = PTO.frameworkRegistry.registerId(this.declaredClass);
        PTO.log.debug("register:" + this.frameworkId);
    },

    destroy: function () {
        if (this.frameworkId) {
            PTO.frameworkRegistry.unregisterId(this.frameworkId);
            this.frameworkId = 0;
        } else {
            PTO.log.warn('Framework registry error in class: ' + this.declaredClass + ' :: This component has already been destroyed');
        }
        this.inherited(arguments);
        PTO.widget.somethingThing.methodName();
        dojo.addClass('sdfsf');
    }
});
