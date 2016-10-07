Ext.define('CartoDb.CartoStore',{
    extend: 'Ext.data.Store',
    alias: 'store.CartoStore',
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],
    requires: [
        'CartoDb.CartoDataModel'
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
            if(this._sublayer){
                this._sublayer.forEach(function(sublayer){
                    sublayer.setSQL(this.sqlBuilder2_0(storeConfig));
                }.bind(this));
            }
        }
    },
    
    remoteFilter: true,
    config: {
        style: null,
        storeId: null,
        applyFilterToLayer: true
    },
    model: 'CartoDb.CartoDataModel',
    // proxy: {
    //         type: 'carto',
    //         username: 'crestonedigital',
    //         table: 'us_metro_stations'
    //     },
    getSubLayer: function() {
        return this._subLayer;
    },

    getCartoSql: function(isMap) {
        return this.createCartoSql(isMap);
    },
    
    createCartoSql: function(isMap) {
        this._sql = this.sqlBuilder2_0(this.getProxy().getCurrentConfig(), {
            extraSelect: (isMap) ? ["'" + this.getStoreId() + "' AS carto_store_id"] : null
        });
        return this._sql;
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
            case 'heat':
                css = ['Map {',
                '-torque-frame-count:1;',
                '-torque-animation-duration:10;',
                '-torque-time-attribute:"dataperiod";',
                '-torque-aggregation-function:"count(cartodb_id)";',
                '-torque-resolution:8;',
                '-torque-data-aggregation:linear;',
                '}',
                '#' + table + '{',
                'image-filters: colorize-alpha(blue, cyan, lightgreen, yellow , orange, red);',
                'marker-file: url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png);',
                'marker-fill-opacity: 0.4*[value];',
                'marker-width: 35;',
                '}',
                '#' + table + '[frame-offset=1] {',
                'marker-width:37;',
                'marker-fill-opacity:0.2; ',
                '}',
                '#' + table + '[frame-offset=2] {',
                'marker-width:39;',
                'marker-fill-opacity:0.1; ',
                '}'].join('');
                break;
            // case 'wildfire':
            //     css = ['#' + table + '{',
            //         'marker-fill-opacity: 0.05;',
            //         'marker-line-color: #FFF;',
            //         'marker-line-width: 0.0;',
            //         'marker-line-opacity: 1;',
            //         'marker-placement: point;',
            //         'marker-type: ellipse;',
            //         'marker-width: 6;',
            //         'marker-fill: #FF5C00;',
            //         'marker-allow-overlap: true;',
            //     '}',
            //     '#' + table + ' [zoom <18]{',
            //         'marker-fill-opacity: 0.7;',
            //     '}',
            //     '#' + table + ' [zoom <9]{',
            //         'marker-fill-opacity: 0.4;',
            //         'marker-width: 5;',
            //     '}',
            //     '#' + table + ' [zoom <8]{',
            //         'marker-fill-opacity: 0.2;',
            //         'marker-width: 4;',
            //     '}',
            //     '#' + table + ' [zoom <7]{',
            //         'marker-fill-opacity: 0.08;',
            //         'marker-width: 3;',
            //     '}',
            //     '#' + table + ' [zoom <6]{',
            //         'marker-fill-opacity: 0.07;',
            //         'marker-width: 2;',
            //     '}',
            //     '#' + table + ' [zoom <5]{',
            //         'marker-width: 1;',
            //     '}'].join(' ');
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
        this._css = css;
        console.log(css);
        return css;
    }
    //  onFilterEndUpdate: function() {
    //      this.callParent(arguments);
    //      if(this.getApplyFilterToLayer() && !this.suppressNextFilter){
    //          debugger
    //      }
    //  }
});