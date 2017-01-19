Ext.define('Carto.css.HeatMap', {
    extend: 'Carto.css.Css',
    alias: 'cartocss.heatmap',

    value: {
        Map: {
            torqueFrameCount: 1,
            torqueAnimationDuration: 10,
            torqueTimeAttribute: '"contrdated"',
            torqueAggregationFunction: '"count(cartodb_id)"',
            torqueResolution: 8,
            torqueDataAggregation: 'linear'
        },

        imageFilters: 'colorize-alpha(blue, cyan, lightgreen, yellow , orange, red)',
        markerFile: 'url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png)',
        markerFillOpacity: '0.4*[value]',
        markerWidth: 35,
        case: [{
            condition: 'frame-offset=1',
            markerWidth: 37,
            markerFillOpacity: 0.2,
        }, {
            condition: 'frame-offset=2',
            markerWidth: 39,
            markerFillOpacity: 0.1
        }]
    }
});