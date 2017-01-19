Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    onSelect: function(rowmodel, record) {
        this.lookup('southGrid').ensureVisible(record);
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
            layout: 'border',
            viewModel: {
                stores: {
                    refineries: {
                        type: 'carto',
                        storeId: 'refineriesStore',
                        autoLoad: true,
                        proxy: {
                            username: 'extjscarto',
                            table: 'petroleum_refineries',
                            enableLatLng: true
                        }
                    }
                }
            },
            controller: mapController,
            items: [{
                xtype: "cartomap",
                region: 'center',
                center: 'us',
                reference: 'map',
                bind: {
                    selection: '{selectedValue}'
                },
                selectedAction: 'panTo',
                basemap: 'darkMatterLite',
                layers: [{
                    subLayers: [{
                        subLayerId: 'intenseLayer',
                        bind: {
                            store: '{refineries}'
                        },
                        css: {
                            type: 'intensity'
                        },
                        interactivity: {
                            enable: true,
                            fields: [
                                'site_name', 'company', 'state', 'total_oper'
                            ],
                            tooltip: {
                                enable: true
                            }
                        }
                    }]

                }]
            }, {
                xtype: 'cartomap',
                region: 'east',
                width: '50%',
                bind: {
                    selection: '{selectedValue}'
                },
                layers: [{
                    subLayers: [{
                        subLayerId: 'normalLayer',
                        bind: {
                            store: '{refineries}'
                        },
                        interactivity: {
                            enable: true
                        }
                    }]
                }]
            }, {
                xtype: 'grid',
                region: 'south',
                reference: 'southGrid',
                split: true,
                idProperty: 'cartodb_id',
                bind: {
                    store: '{refineries}',
                    selection: '{selectedValue}'
                },
                listeners: {
                    select: 'onSelect'
                },
                height: 350,
                columns: [{
                    text: 'Site Name', 
                    dataIndex: 'site_name',
                    flex: 1
                },{
                    text: 'Company', 
                    dataIndex: 'company',
                    flex: 1
                },{
                    text: 'State', 
                    dataIndex: 'state',
                    flex: 1
                },{
                    text: 'Total Operation', 
                    dataIndex: 'total_oper',
                    flex: 1
                }]
            }]
        }]
    });
});