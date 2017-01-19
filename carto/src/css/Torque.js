Ext.define('Carto.css.Torque', {
    extend: 'Carto.css.Css',
    alias: 'cartocss.torque',

    value: {
        Map: {
            torqueFrameCount: 256,
            torqueAnimationDuration: 30,
            torqueTimeAttribute: '"cartodb_id"',
            torqueAggregationFunction: '"count(cartodb_id)"',
            torqueResolution: 2,
            torqueDataAggregation: 'linear'
        },

        compOp: 'lighter',
        markerFillOpacity: 0.9,
        markerLineColor: '#FFF',
        markerLineWidth: 0,
        markerLineOpacity: 1,
        markerType: 'ellipse',
        markerWidth: 6,
        markerFill: '#0F3B82',
        case: [{
            condition: 'frame-offset=1',
            markerWidth: 8,
            markerFillOpacity: 0.45
        }, {
            condition: 'frame-offset=2',
            markerWidth: 10,
            markerFillOpacity: 0.225
        }]
    }
});