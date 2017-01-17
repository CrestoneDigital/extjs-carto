Ext.define('Carto.CartoSubLayer', {
    // extend: 'Ext.Component',
    xtype: 'cartosublayer',

    requires: [
        'Carto.CartoCss',
        'Carto.CartoStore'
    ],

    mixins: [
        'Ext.mixin.Inheritable',
        'Ext.mixin.Observable',
        'Ext.mixin.Bindable'
    ],

    config: {
        sql: '',
        css: {
            type: 'point'
        },
        table: '',
        username: '',
        cartoSubLayer: null,
        hidden: false,
        selection: null,
        style: null,
        interactivity: null,
        type: null,
        layer: null,
        store: null
    },
    twoWayBindable: [
        'selection'
    ],

    isSubLayer: true,

    defaultBindProperty: 'store',

    updateSql: function(sql) {
        if (sql) {
            var cartoSubLayer = this.getCartoSubLayer(),
                layer = this.getLayer();
            if (cartoSubLayer) {
                cartoSubLayer.setSQL(sql);
            } else if (layer) {
                layer.createCartoSubLayer(this);
            }
        }
    },

    remove: function() {
        if (this.getCartoSubLayer()) {
            this.getCartoSubLayer().remove();
        }
    },

    buildCartoSubLayer: function() {
        var ret = {
                sql: this.getSql(),
                cartocss: this.getCss()
            },
            type = this.getType();
        if (type) {
            ret = {
                type: type,
                options: ret
            };
            // ret.type = type;
            if (type = 'torque') {
                // ret.options.geom_column = 'the_geom_webmercator';
                ret.options.table_name = this.getTable();
            }
        }
        return ret;
    },

    setCartoSubLayer: function(cartoSubLayer) {
        this.callParent(arguments);
        var interactivity = this.getInteractivity(),
            tooltip;
        if (interactivity && interactivity.enable) {
            cartoSubLayer.setInteraction(true);
            cartoSubLayer.set({
                interactivity: 'cartodb_id' + ((interactivity.fields) ? ',' + interactivity.fields.join(',') : '')
            });
            tooltip = interactivity.tooltip;
            if(tooltip && tooltip.enable){
                this.getLayer().getMap().getCartoMap().viz.addOverlay({
                    type: 'tooltip',
                    layer: cartoSubLayer,
                    template: tooltip.html || this.createDefaultTooltip(tooltip.fields || interactivity.fields, tooltip.mood),
                    position: tooltip.position || 'bottom|right',
                    fields: [this.createFields(interactivity.fields)]
                });
            }
            cartoSubLayer.on('featureClick', this.featureClick.bind(this));
            cartoSubLayer.on('featureOver', this.featureOver.bind(this));
            cartoSubLayer.on('featureOut', this.featureOut.bind(this));
        }
    },

    featureClick: function(e, latLng, point, record){
        var selection = this.getRecord(record.cartodb_id);
        this.setSelection(selection);
        this.getLayer().getMap().setSelection(selection);
        if (this.hasListeners.itemclick) {
            this.fireEvent('itemclick', this, selection);
        }
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
        }
    },

    featureOver: function() {
        if (!this._cursor && $('.leaflet-container').css('cursor') != 'pointer' ) {
            this._cursor = $('.leaflet-container').css('cursor');
        }
        $('.leaflet-container').css('cursor','pointer');
    },

    featureOut: function() {
        $('.leaflet-container').css('cursor',this._cursor);
    },

    createDefaultTooltip: function(fields, mood) {
        var html = '<div class="cartodb-tooltip-content-wrapper ' + (mood || 'light') + '"><div class="cartodb-tooltip-content">';
        for(var i = 0; i < fields.length; i++){
            html += '<h4>' + fields[i] + '</h4><p>{{' + fields[i] + '}}</p>';
        }
        return html + '</div></div>';
    },

    createFields: function(fields) {
        var obj = {};
        for(var i = 0; i < fields.length; i++){
            obj[fields[i]] = fields[i];
        }
        return obj;
    },

    getRecord: function(cartodb_id) {
        return this.getStore().findRecord('cartodb_id', cartodb_id);
    },

    setHidden: function(hide) {
        this.callParent(arguments);
        var cartoSubLayer = this.getCartoSubLayer();
        if (cartoSubLayer) {
            if (hide) {
                cartoSubLayer.hide();
            } else {
                cartoSubLayer.show();
            }
        }
    },

    getRefOwner: function() {
        // return this.getLayer().getMap();
        return this.getLayer();
    },

    constructor: function(config) {
        config = config || {};

        if (config.initialConfig) {
            config = config.initialConfig;
        }

        if (config.subLayerId) {
            this.setId(config.subLayerId);
        }

        this.initialConfig = config;
        this.getId();
        this.initConfig(config);

        var viewModel = this.lookupViewModel();
        if (viewModel) {
            this.initBindable();
        }
        var layer = this.getLayer();
        if (layer && layer.rendered) {
            this.onRender(layer);
        }
        delete this.subLayerId;
        return this;
    },

    beforeInitConfig: function() {
        this.mixins.observable.constructor.call(this);
    },

    beforeRender: function() {
        // this.initBindable();
        // var bind = this.getBind(),
        //     binding;
        // for (var b in bind) {
        //     binding = bind[b];
        //     if (!binding.calls) {
        //         debugger
        //         binding.notify();
        //     }
        // }
        // debugger
        // this.lookupViewModel().notify();
    },

    onRender: function(layer) {
        this.rendered = true;

        if (this.getReference()) {
            this.publishState();
        }
    },

    initInheritedState: function(inheritedState) {
        this.mixins.bindable.initInheritedState.call(this, inheritedState);
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.StoreManager.lookup(store, 'carto');
        }
        return store;
    },

    updateStore: function(store) {
        if (store) {
            store.addSubLayerToProxy(this);
        }
    },

    updateSelection: function(selection) {
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
        }
    },

    updateUsername: function(username, oldUsername) {
        var layer = this.getLayer();
        if (username && layer) {
            layer.setUsername(username);
        }
    },

    updateLayer: function(layer, oldLayer) {
        if (layer) {
            var username = this.getUsername();
            if (username) {
                layer.setUsername(username);
            }
        }
    },

    setCssAttribute: function(attr, value, suppressed) {
        if (typeof attr !== 'string') {
            suppressed = value;
        }
        this.css.set(attr, value);
        if (!suppressed) {
            this.updateCss(this.css);
        }
    },

    addCssCase: function(caseObj, suppressed) {
        this.css.addCase(caseObj);
        if (!suppressed) {
            this.updateCss(this.css);
        }
    },

    removeCssCase: function(condition, suppressed) {
        this.css.removeCase(condition);
        if (!suppressed) {
            this.updateCss(this.css);
        }
    },

    getCss: function() {
        var css = this.callParent();
        if (css) {
            css = css.getCssString();
        }
        return css;
    },

    applyCss: function(css) {
        if (css && !css.isCartoCss) {
            css = new Carto.CartoCss(css);
        }
        return css;
    },

    updateCss: function(css) {
        if (this.getCartoSubLayer() && css) {
            this.getCartoSubLayer().setCartoCSS(css.getCssString());
        }
    },

    destroy: function() {
        if (!this.hasListeners.beforedestroy || this.fireEvent('beforedestroy', this) !== false) {
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = true;

            this.removeBindings();
    
            this.destroyBindable();
 
            // We need to defer clearing listeners until after doDestroy() completes, 
            // to let the interested parties fire events until the very end. 
            this.clearListeners();
 
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = false;
 
            this.callParent(); // Ext.Base 
        }
    },
});