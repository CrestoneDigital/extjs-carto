Ext.define('Carto.AbstractLayer', {

    mixins: [
        'Ext.mixin.Inheritable',
        'Ext.mixin.Observable',
        'Ext.mixin.Bindable'
    ],

    config: {
        cartoLayer: null,
        hidden: false,
        table: '',
        username: '',
        mapZIndex: null
    },

    isAbstractLayer: true,

    constructor: function(config) {
        config = config || {};

        if (config.initialConfig) {
            config = config.initialConfig;
        }

        this.initialConfig = config;

        if (config.layerId) {
            this.setId(config.layerId);
        }

        this.getId();
        this.initConfig(config);
        
        // debugger
        // var viewModel = this.lookupViewModel();
        // debugger
        // if (viewModel) {
        this.initBindable();
        // }

        delete this.layerId;
        return this;
    },

    beforeInitConfig: function() {
        this.mixins.observable.constructor.call(this);
    },

    createCartoLayer: Ext.emptyFn,

    buildCartoLayer: Ext.emptyFn,

    updateCartoLayer: function(cartoLayer) {
        if (this.getHidden()) {
            cartoLayer.hide();
        }
    },

    updateHidden: function(hidden) {
        var cartoLayer = this.getCartoLayer();
        if (cartoLayer) {
            if (hide) {
                cartoLayer.hide();
            } else {
                cartoLayer.show();
            }
        }
    },

    getType: function() {
        var alias = this.alias;
        return alias ? alias[0].split('.')[1] : null;
    },

    remove: function(destroy) {
        var cartoLayer = this.getCartoLayer();
        if (cartoLayer) {
            cartoLayer.remove();
        }
        if (destroy) {
            this.destroy();
        }
    },

    initInheritedState: function(inheritedState) {
        this.mixins.bindable.initInheritedState.call(this, inheritedState);
    },

    doDestroy: Ext.emptyFn,

    destroy: function() {
        if (!this.hasListeners.beforedestroy || this.fireEvent('beforedestroy', this) !== false) {
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = true;
            
            this.doDestroy();

            this.removeBindings();
    
            this.destroyBindable();
 
            // We need to defer clearing listeners until after doDestroy() completes, 
            // to let the interested parties fire events until the very end. 
            this.clearListeners();
 
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = false;
 
            this.callParent(); // Ext.Base 
        }
    }
});