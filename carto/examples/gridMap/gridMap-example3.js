Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    onSelect: function(rowmodel, record) {
        this.lookup('southGrid').ensureVisible(record);
    }
});


Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            viewModel: {
                stores: {
                    layer: {
                        storeId: 'layer1',
                        type: 'carto',
                        autoLoad: true,
                        proxy: {
                            enableLatLng: true,
                            username: 'extjscarto',
                            table: 'petroleum_refineries'
                        }
                    }
                }
            },
            controller: mapController,
            tbar: {
                items: {
                    xtype: 'checkboxfield',
                    reference: 'lockToMapBox',
                    boxLabel: 'Lock to Map'
                }
            },
            items: [{
                xtype: "cartomap",
                region: 'center',
                center: 'us',
                reference: 'map',
                bind: {
                    selection: '{selectedValue}',
                    mapLock: '{lockToMapBox.checked}'
                },
                storesToLock: ['layer1'],
                basemap: 'darkMatterLite',
                layers: [{
                    subLayers: [{
                        bind: '{layer}',
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
            },{
                xtype: 'grid',
                region: 'south',
                reference: 'southGrid',
                split: true,
                idProperty: 'cartodb_id',
                bind: {
                    selection: '{selectedValue}',
                    store: '{layer}'
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