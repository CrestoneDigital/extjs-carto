Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);


var mapController = Ext.create('Ext.app.ViewController',{
    onLayerChange: function(segButton, value, oldValue){
        var map = this.lookup('map');
        if (oldValue.length) {
            map.removeLayer(map.getLayers().first(), true);
        }
        map.addLayer(value[0]);
        map.getSubLayers().first().setStore(this.getStore('fireLayer'));
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
                        subLayers: [{
                            // bind: '{fireLayer}',
                            css: {
                                type: 'intensity',
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
                        }]
                    },
                    pressed: true
                }, {
                    text: 'Heatmap',
                    value: {
                        subLayers: [{
                            // bind: '{fireLayer}',
                            type: 'torque',
                            css: {
                                type: 'heatmap'
                            }
                        }]
                    }
                }]
                // xtype: 'combo',
                // reference: 'layersBox',
                // fieldLabel: 'Select Layer',
                // displayField: 'name',
                // valueField: 'value',
                // store: {
                //     data: [{

                //     }]
                // },
                // // listeners: {
                // //     selec: 'onLayerAdd'
                // // },
                // width: 350,
                // editable: false
            }]
        }]
    });
});