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


var mapViewModel = Ext.create('Ext.app.ViewModel',{
    data: {
        lockToMap: true
    }
});


Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            viewModel: mapViewModel,
            controller: mapController,
            tbar: {
                items: {
                    xtype: 'checkboxfield',
                    reference: 'lockToMapBox',
                    boxLabel: 'Lock to Map',
                    bind: {
                        value: '{lockToMap}'
                    }
                }
            },
            items: [{
                xtype: "cartoMap",
                region: 'center',
                center: 'us',
                reference: 'map',
                bind: {
                    selection: '{selectedValue}',
                    mapLock: '{lockToMap}'
                },
                storesToLock: ['layer1'],
                // selectedAction: 'panTo',
                baseLayerName: 'Dark Matter (lite)',
                layerItems: [{
                  username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer1',
                      enableLatLng: true,
                      table: 'petroleum_refineries',
                      autoLoad: true,
                      interactivity: {
                          enable: true,
                          fields: [
                              'site_name', 'company', 'state', 'total_oper', 'cartodb_id'
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
                    selection: '{selectedValue}'
                },
                listeners: {
                    afterrender: function(){
                        this.setStore(Ext.getStore('layer1'));
                    },
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