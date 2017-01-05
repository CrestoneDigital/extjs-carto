Ext.define('Carto.CartoSubLayer', {
    extend: 'Ext.Component',
    xtype: 'cartosublayer',

    requires: [
        'Carto.CartoCss'
    ],

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
<<<<<<< HEAD
        if (this.hasListeners.itemclick) {
            this.fireEvent('itemclick', this, selection);
=======
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
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
<<<<<<< HEAD
            store = Ext.StoreManager.lookup(store, 'Carto.CartoStore');
=======
            store = Ext.StoreManager.lookup(store, 'CartoDb.CartoStore');
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
        }
        return store;
    },

    updateStore: function(store) {
        store.addSubLayerToProxy(this);
    },

    updateSelection: function(selection) {
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
        }
    },

    // setStyle: function(style) {
    //     this.style = style;
    // },

    // getCss: function() {
    //     return this.css || this.createCss();
    // },

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
        // if (css && typeof css === 'object') {
        //     css = this.createCss(css);
        // }
        return css;
    },

    updateCss: function(css) {
        if (this.getCartoSubLayer() && css) {
            this.getCartoSubLayer().setCartoCSS(css.getCssString());
        }
    }

    // createCss: function(css) {
    //     // var css,
    //         // table = this.getTable(),
    //     // var style = this.getStyle() || {type: 'point'};
    //     // if(style.css) {
    //     //     this.setCss(style.css);
    //     //     return style.css;
    //     // }
    //     var type = css.type,
    //         obj;
    //     if (type) {
    //         obj = this.cssTypes[type];
    //         delete css.type;
    //     }
    //     return this.createCssString(Ext.apply({}, css, obj));
    //     // switch(style.type){
    //     //     /**
    //     //      * Coming soon...
    //     //      */
    //     //     // case 'heat':
    //     //     //     css = ['Map {',
    //     //     //     '-torque-frame-count:1;',
    //     //     //     '-torque-animation-duration:10;',
    //     //     //     '-torque-time-attribute:"dataperiod";',
    //     //     //     '-torque-aggregation-function:"count(cartodb_id)";',
    //     //     //     '-torque-resolution:8;',
    //     //     //     '-torque-data-aggregation:linear;',
    //     //     //     '}',
    //     //     //     '#' + table + '{',
    //     //     //     'image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
    //     //     //     'marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
    //     //     //     'marker-fill-opacity: 0.4*[value];',
    //     //     //     'marker-width: 35;',
    //     //     //     '}',
    //     //     //     '#' + table + '[frame-offset=1] {',
    //     //     //     'marker-width:37;',
    //     //     //     'marker-fill-opacity:0.2; ',
    //     //     //     '}',
    //     //     //     '#' + table + '[frame-offset=2] {',
    //     //     //     'marker-width:39;',
    //     //     //     'marker-fill-opacity:0.1; ',
    //     //     //     '}'].join('');
    //     //     //     break;
    //     //     case 'polygon':
    //     //         // css = [
    //     //         //     '#' + table + '{',
    //     //         //         'polygon-fill: ' + (style.polygonFill || '#374C70') + ';',
    //     //         //         'polygon-opacity: ' + (style.polygonOpacity || '0.9') + ';',
    //     //         //         'polygon-gamma: ' + (style.polygonGamma || '0.5') + ';',
    //     //         //         'line-color: ' + (style.lineColor || '#FFF') + ';',
    //     //         //         'line-width: ' + (style.lineWidth || '1') + ';',
    //     //         //         'line-opacity: ' + (style.lineOpacity || '0.5') + ';',
    //     //         //         'line-comp-op: ' + (style.lineCompOp || 'soft-light') + ';',
    //     //         //     '}'
    //     //         // ].join('');
    //     //         css = this.cssTypes[style.type];
    //     //         delete style.type;
    //     //         css = this.createCssString(Ext.apply({}, style, css));
    //     //         break;
    //     //     case 'intensity':
    //     //         css = [
    //     //             '#' + table + '{',
    //     //                 'marker-fill:' + (style.fill || '#FFCC00') + ';',
    //     //                 'marker-width:' + (style.width || '10') + ';',
    //     //                 'marker-line-color:' + (style.lineColor || '#FFF') + ';',
    //     //                 'marker-line-width:' + (style.lineWidth || '1') + ';',
    //     //                 'marker-line-opacity:' + (style.lineOpacity || '1') + ';',
    //     //                 'marker-fill-opacity:' + (style.fillOpacity || '0.9') + ';',
    //     //                 'marker-comp-op: multiply;',
    //     //                 'marker-type: ellipse;',
    //     //                 'marker-placement: point;',
    //     //                 'marker-allow-overlap: true;',
    //     //                 'marker-clip: false;',
    //     //                 'marker-multi-policy: largest;',
    //     //             '}'
    //     //         ].join('');
    //     //         break;
    //     //     default:
    //     //         css = [
    //     //             "#" + table + "{",
    //     //                 'marker-line-color:' + (style.lineColor || '#FFF') + ';',
    //     //                 'marker-line-width:' + (style.lineWidth || '1.5') + ';',
    //     //                 'marker-line-opacity:' + (style.lineOpacity || '1') + ';',
    //     //                 'marker-fill-opacity:' + (style.fillOpacity || '0.9') + ';',
    //     //                 'marker-placement: point;',
    //     //                 'marker-type: ellipse;',
    //     //                 'marker-fill:' + (style.fill || '#FF6600') + ';',
    //     //                 'marker-width:' + (style.width || '10') + ';',
    //     //                 'marker-allow-overlap: true;',
    //     //             "}"
    //     //         ].join(' ');
    //     // }
    //     // this.setCss(css);
    //     // return css;
    // },

    // createCssString: function(obj, table, isCase) {
    //     var str, k, i;
    //     if (isCase) {
    //         str = '[' + obj.condition + ']{';
    //     } else {
    //         table = table || this.getTable() || 'layer';
    //         str = '#' + table + '{';
    //     }
    //     for (k in obj) {
    //         if (k === 'case') {
    //             if (!Ext.isArray(obj[k])) {
    //                 obj[k] = [obj[k]];
    //             }
    //             for (var i in obj[k]) {
    //                 str += this.createCssString(obj[k][i], null, true);
    //             }
    //         } else if (k === 'condition') {

    //         } else {
    //             str += this.parseCss(k) + ':' + obj[k] + ';';
    //         }
    //     }
    //     return str + '}';
    // },

    // parseCss: function(str) {
    //     return str.replace(this.cssRegex, this.replaceUppercase);
    // },

    // replaceUppercase: function(str) {
    //     return '-' + str.toLowerCase();
    // },

    // cssRegex: /[A-Z]/g,

    // cssTypes: {
    //     point: {
    //         markerLineColor: '#FFF',
    //         markerLineWidth: '1.5',
    //         markerLineOpacity: '1',
    //         markerFillOpacity: '0.9',
    //         markerPlacement: 'point',
    //         markerType: 'ellipse',
    //         markerFill: '#FF6600',
    //         markerWidth: '10',
    //         markerAllowOverlap: true
    //     },
    //     line: {
    //         lineColor: '#FFF',
    //         lineWidth: '1',
    //         lineOpacity: '0.5',
    //         lineCompOp: 'soft-light'
    //     },
    //     polygon: {
    //         polygonFill: '#374C70',
    //         polygonOpacity: '0.9',
    //         polygonGamma: '0.5',
    //         lineColor: '#FFF',
    //         lineWidth: '1',
    //         lineOpacity: '0.5',
    //         lineCompOp: 'soft-light'
    //     },
    //     intensity: {
    //         markerFill: '#FFCC00',
    //         markerWidth: '10',
    //         markerLineColor: '#FFF',
    //         markerLineWidth: '1',
    //         markerLineOpacity: '1',
    //         markerFillOpacity: '0.9',
    //         markerCompOp: 'multiply',
    //         markerType: 'ellipse',
    //         markerPlacement: 'point',
    //         markerAllowOverlap: true,
    //         markerClip: false,
    //         markerMultiPolicy: 'largest'
    //     }
    // }
});