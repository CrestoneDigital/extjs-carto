Ext.define('CartoDb.CartoSubLayer', {
    extend: 'Ext.Component',
    xtype: 'cartosublayer',

    config: {
        sql: '',
        css: '',
        table: '',
        cartoSubLayer: null,
        hidden: false,
        selection: null,
        style: null,
        interactivity: null,
        layer: null,
        store: null
    },
    twoWayBindable: [
        'selection'
    ],

    isSubLayer: true,

    defaultBindProperty: 'store',

    create: function(sql) {
        this.setSql(sql);
        if (this.getCartoSubLayer()) {
            this.getCartoSubLayer().setSQL(sql);
        } else {
            this.getLayer().createSubLayer(this);
        }
    },

    remove: function() {
        if (this.getCartoSubLayer()) {
            this.getCartoSubLayer().remove();
        }
    },

    buildCartoSubLayer: function() {
        return {
            sql: this.getSql(),
            cartocss: this.getCss()
        };
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
                this.getLayer().getMap().getMap().viz.addOverlay({
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

    lookupViewModel: function() {
        return this.getLayer().getMap().lookupViewModel();
    },

    lookupController: function() {
        return this.getLayer().getMap().lookupController();
    },

    getRefOwner: function() {
        return this.getLayer().getMap();
    },

    initComponent: function() {
        this.callParent(arguments);
        this.getBind();
    },

    applyStore: function(store) {
        if (store) {
            store = Ext.StoreManager.lookup(store, 'CartoDb.CartoStore');
        }
        return store;
    },

    updateStore: function(store) {
        store.addSubLayerToProxy(this);
    },

    setStyle: function(style) {
        this.style = style;
    },

    getCss: function() {
        return this.css || this.createCss();
    },

    updateCss: function(css) {
        if (this.getCartoSubLayer()) {
            this.getCartoSubLayer().setCartoCSS(css);
        }
    },

    createCss: function() {
        var css,
            table = this.getTable(),
            style = this.getStyle() || {type: 'basic'};
        if(style.css) {
            this.setCss(style.css);
            return style.css;
        }
        switch(style.type){
            /**
             * Coming soon...
             */
            // case 'heat':
            //     css = ['Map {',
            //     '-torque-frame-count:1;',
            //     '-torque-animation-duration:10;',
            //     '-torque-time-attribute:"dataperiod";',
            //     '-torque-aggregation-function:"count(cartodb_id)";',
            //     '-torque-resolution:8;',
            //     '-torque-data-aggregation:linear;',
            //     '}',
            //     '#' + table + '{',
            //     'image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
            //     'marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
            //     'marker-fill-opacity: 0.4*[value];',
            //     'marker-width: 35;',
            //     '}',
            //     '#' + table + '[frame-offset=1] {',
            //     'marker-width:37;',
            //     'marker-fill-opacity:0.2; ',
            //     '}',
            //     '#' + table + '[frame-offset=2] {',
            //     'marker-width:39;',
            //     'marker-fill-opacity:0.1; ',
            //     '}'].join('');
            //     break;
            case 'intensity':
                css = ['#' + table + '{',
                    'marker-fill:' + (style.fill || '#FFCC00') + ';',
                    'marker-width:' + (style.width || '10') + ';',
                    'marker-line-color:' + (style.lineColor || '#FFF') + ';',
                    'marker-line-width:' + (style.lineWidth || '1') + ';',
                    'marker-line-opacity:' + (style.lineOpacity || '1') + ';',
                    'marker-fill-opacity:' + (style.fillOpacity || '0.9') + ';',
                    'marker-comp-op: multiply;',
                    'marker-type: ellipse;',
                    'marker-placement: point;',
                    'marker-allow-overlap: true;',
                    'marker-clip: false;',
                    'marker-multi-policy: largest;',
                '}'].join('');
                break;
            default:
                css = ["#" + table + "{",
                    'marker-line-color:' + (style.lineColor || '#FFF') + ';',
                    'marker-line-width:' + (style.lineWidth || '1.5') + ';',
                    'marker-line-opacity:' + (style.lineOpacity || '1') + ';',
                    'marker-fill-opacity:' + (style.fillOpacity || '0.9') + ';',
                    'marker-placement: point;',
                    'marker-type: ellipse;',
                    'marker-fill:' + (style.fill || '#FF6600') + ';',
                    'marker-width:' + (style.width || '10') + ';',
                    'marker-allow-overlap: true;',
                "}"].join(' ');
        }
        this.setCss(css);
        return css;
    }
});