Ext.define('CartoDb.CartoStore',{
    extend: 'Ext.data.Store',
    alias: 'store.CartoStore',
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],
    requires: [
        'CartoDb.CartoDataModel'
    ],
    model: 'CartoDb.CartoDataModel',
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
    getCartoCSS: function(data) {
        var css;
        switch(data.type){
            case 'basic':
                css = ["#petroleum_refineries_1{",
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
                break;
            case 'heat':
                css = ['#wildfire{',
                   ' marker-fill-opacity: 0.05;',
                    'marker-line-color: #FFF;',
                    'marker-line-width: 0.0;',
                    'marker-line-opacity: 1;',
                    'marker-placement: point;',
                    'marker-type: ellipse;',
                    'marker-width: 6;',
                    'marker-fill: #FF5C00;',
                    'marker-allow-overlap: true;',
                '}',
                '#wildfire [zoom <18]{',
                    'marker-fill-opacity: 0.7;',
                '}',
                '#wildfire [zoom <9]{',
                    'marker-fill-opacity: 0.4;',
                    'marker-width: 5;',
                '}',
                '#wildfire [zoom <8]{',
                    'marker-fill-opacity: 0.2;',
                    'marker-width: 4;',
                '}',
                '#wildfire [zoom <7]{',
                    'marker-fill-opacity: 0.08;',
                    'marker-width: 3;',
                '}',
                '#wildfire [zoom <6]{',
                    'marker-fill-opacity: 0.07;',
                    'marker-width: 2;',
                '}',
                '#wildfire [zoom <5]{',
                    'marker-width: 1;',
                '}'].join(' ');
                break;
            default:
                css = ["#petroleum_refineries_1{",
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
        return css;
    }
});