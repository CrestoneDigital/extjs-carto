Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);

/**
 *  
 * Layer Demo for different kinds of layers. 
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'fit',
            controller: Ext.create('Ext.app.ViewController'),
            viewModel: {
                stores: {
                    tweets: {
                        type: 'carto',
                        autoLoad: true,
                        onlyTiles: true,
                        filters: {
                            property: 'longitude',
                            value: -90,
                            operator: '>'
                        },
                        proxy: {
                            username: 'crestonedigital',
                            table: 'starwars'
                        }
                    },
                    coloradoZipCodes: {
                        type: 'carto',
                        autoLoad: true,
                        onlyTiles: true,
                        proxy: {
                            username: 'crestonedigital',
                            table: 'colorado_zipcodes'
                        }
                    },
                    oregonFires: {
                        type: 'carto',
                        autoLoad: true,
                        onlyTiles: true,
                        filters: {
                            property: 'state',
                            value: 'Oregon'
                        },
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
                basemap: 'darkMatterLite',
                layers: [{
                    type: 'torque',
                    table: 'lac_hospitals_2011',
                    username: 'crestonedigital',
                    sql: 'SELECT * FROM lac_hospitals_2011',
                    css: {
                        type: 'torque'
                    }
                }, {
                    subLayers: [{
                        bind: '{tweets}'
                    }, {
                        bind: '{coloradoZipCodes}',
                        css: {
                            type: 'polygon'
                        }
                    }]
                }, {
                    type: 'torque',
                    bind: '{oregonFires}',
                    css: {
                        type: 'heatmap'
                    }
                }]
            }]
        }]
    });
});