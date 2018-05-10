Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);


var mapController = Ext.create('Ext.app.ViewController',{
    onLayerChange: function(segButton, value, oldValue){
        var map = this.lookup('map');
        if (oldValue) {
            map.removeLayer(map.getLayers().first(), true);
        }
        map.addLayer(value);
        map.getLayer('layer').setStore(this.getStore('fireLayer'));

        // var map = this.lookup('map');
        // if (oldValue.length) {
        //     map.removeLayer(map.getLayers().first(), true);
        // }
        // map.addLayer(value[0]);
        // map.getLayer('layer').setStore(this.getStore('fireLayer'));
    }
});

/**
 *  
 * Basic map w/toolbar Centered on US. 
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'fit',
            controller: mapController,
            viewModel: {
                stores: {
                    fireLayer: {
                        type: 'carto',
                        autoLoad: true,
                        onlyTiles: true,
                        proxy: {
                            username: 'crestonedigital',
                            table: 'wildfire'
                        }
                    }
                }
            },
            items: [{
                xtype: "cartomap",
                center: 'us',
                reference: 'map',
                basemap: 'darkMatterLite'
            }],
            tbar: [{
                xtype: 'segmentedbutton',
                reference: 'cssButton',
                listeners: {
                    change: 'onLayerChange'
                },
                items: [{
                    text: 'Intensity',
                    value: {
                        subLayers: {
                            layerId: 'layer',
                            css: {
                                type: 'intensity',
                                value: {
                                    markerFillOpacity: 0.05,
                                    markerLineWidth: 0.0,
                                    markerWidth: 6,
                                    markerFill: '#FF5C00',
                                    case: [{
                                        condition: 'zoom<18',
                                        markerFillOpacity: 0.7
                                    }, {
                                        condition: 'zoom<9',
                                        markerFillOpacity: 0.4,
                                        markerWidth: 5
                                    }, {
                                        condition: 'zoom<8',
                                        markerFillOpacity: 0.2,
                                        markerWidth: 4
                                    }, {
                                        condition: 'zoom<7',
                                        markerFillOpacity: 0.08,
                                        markerWidth: 3
                                    }, {
                                        condition: 'zoom<6',
                                        markerFillOpacity: 0.07,
                                        markerWidth: 2
                                    }, {
                                        condition: 'zoom<5',
                                        markerWidth: 1
                                    }]
                                }
                            }
                        }
                    },
                    pressed: true
                }, {
                    text: 'Heatmap',
                    value: {
                        type: 'torque',
                        layerId: 'layer',
                        css: {
                            type: 'heatmap'
                        }
                    }
                }]
            }]
        }]
    });
});