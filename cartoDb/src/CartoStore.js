Ext.define('CartoDb.CartoStore',{
    extend: 'Ext.data.Store',
    alias: 'store.CartoStore',
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],
    // proxy: {
    //         type: 'carto',
    //         username: 'crestonedigital',
    //         table: 'us_metro_stations'
    //     },
    getCartoSql: function() {
        var me = this;
        return this.sqlBuilder2_0({
                table: this.getProxy().table,
                username: this.getProxy().username
            });
    },

    getCartoCSS: function() {
        return ["#petroleum_refineries_1{",
                    'marker-fill-opacity: 0.9;',
                    'marker-line-color: #FFF;',
                    'marker-line-width: 1.5;',
                    'marker-line-opacity: 1;',
                    'marker-placement: point;',
                    'marker-type: ellipse;',
                    'marker-width: 10;',
                    'marker-fill: #FF6600;',
                    'marker-allow-overlap: true;',
                "}"].join(' ');
    }

});