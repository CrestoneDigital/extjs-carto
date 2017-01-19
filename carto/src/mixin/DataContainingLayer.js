Ext.define('Carto.mixin.DataContainingLayer', {
    mixinId: 'dataContainingLayer',

    requires: [
        'Carto.CartoCss'
    ],

    isDataContainingLayer: true,

    config: {
        store: null,
        sql: '',
        css: {
            type: 'point'
        },
        selection: null,
        interactivity: null
    },

    updateSql: function(sql) {
        if (sql) {
            var cartoLayer = this.getCartoLayer();
            if (cartoLayer) {
                cartoLayer.setSQL(sql);
            } else {
                this.create();
            }
        }
    },

    updateCartoLayer: function(cartoLayer) {
        var interactivity = this.getInteractivity(),
            tooltip;
        if (interactivity && interactivity.enable) {
            cartoLayer.setInteraction(true);
            cartoLayer.set({
                interactivity: 'cartodb_id' + ((interactivity.fields) ? ',' + interactivity.fields.join(',') : '')
            });
            tooltip = interactivity.tooltip;
            if(tooltip && tooltip.enable){
                this.getMap().getCartoMap().viz.addOverlay({
                    type: 'tooltip',
                    layer: cartoLayer,
                    template: tooltip.html || this.createDefaultTooltip(tooltip.fields || interactivity.fields, tooltip.mood),
                    position: tooltip.position || 'bottom|right',
                    fields: [this.createFields(interactivity.fields)]
                });
            }
            cartoLayer.on('featureClick', this.featureClick.bind(this));
            cartoLayer.on('featureOver', this.featureOver.bind(this));
            cartoLayer.on('featureOut', this.featureOut.bind(this));
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

    applyStore: function(store) {
        if (store) {
            store = Ext.StoreManager.lookup(store, 'carto');
            //<debug>
            if (!store.isCartoStore) {
                Ext.raise('Carto Layers cannot have non-carto stores.');
            }
            //</debug>
        }
        return store;
    },

    updateStore: function(store) {
        if (store) {
            store.addLayerToProxy(this);
        }
    },

    updateSelection: function(selection) {
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
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
        if (this.getCartoLayer() && css) {
            this.getCartoLayer().setCartoCSS(css.getCssString());
        }
    }

});