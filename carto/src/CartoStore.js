Ext.define('CartoDb.CartoStore',{
    extend: 'Ext.data.Store',
    alias: 'store.carto',
    requires: [
        'CartoDb.CartoProxy'
    ],
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],

    listeners: {
        filterchange: function(store, filters) {
            var storeConfig    = this.getProxy().getCurrentConfig();
            storeConfig.filter = [];
            filters.forEach(function(item){
                storeConfig.filter.push({
                    operator: (item._operator) ? item._operator : "like", 
                    value: (item._convert) ? item._value.toLocaleDateString() :item._value, 
                    property: item._property
                });
            }.bind(this));
            if(this._subLayer){
                this._subLayer.setSQL(this.sqlBuilder(storeConfig));
            }
        }
    },

    proxy: {
        type: 'carto'
    },
    
    remoteFilter: true,
    remoteSort: true,
    pageSize: 0,

    config: {
        style: null,
        storeId: null,
        groupBy: null,
        applyFilterToLayer: true
    },

    setLoadOptions: function(options) {
        var me = this,
            groupBy = me.getGroupBy();
        if (groupBy) {
            options.groupBy = groupBy;
        }
        me.callParent([options]);
    },

    addSubLayerToProxy: function(subLayer) {
        this.getProxy().addSubLayer(subLayer, true);
    },
    
    getSubLayer: function() {
        return this._subLayer;
    },

    getCartoSql: function(isMap) {
        return this.createCartoSql(isMap);
    },
    
    createCartoSql: function(isMap) {
        return this.sqlBuilder(this.getProxy().getCurrentConfig(), {
            extraSelect: (isMap) ? ["'" + this.getStoreId() + "' AS carto_store_id"] : null
        });
    },

    getCartoCSS: function() {
        return this.createCartoCSS();
    },
    createCartoCSS: function() {
        var css,
            table = this.getProxy().getTable(),
            style = this.getStyle() || {type: 'basic'};
        if(style.css) {
            this._css = style.css;
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
        return css;
    },
    destroy: function() {
        var subLayer = this.getSubLayer();
        subLayer.store = null;
        subLayer.remove();
        this.callParent();
    }
});