Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    
});


var mapViewModel = Ext.create('Ext.app.ViewModel',{

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
            items: [{
                xtype: "cartoMap",
                region: 'center',
                center: 'us',
                reference: 'map',
                bind: {
                    selection: '{selectedValue}'
                },
                selectedAction: ['panTo','placeMarker'],
                baseLayerName: 'Dark Matter (lite)',
                layerItems: [{
                  username: 'crestonedigital',
                  hidden: true,
                  subLayers: [{
                      storeId: 'layer1',
                      enableLatLng: true,
                      table: 'petroleum_refineries',
                      autoLoad: true,
                      interactivity: {
                          enable: true,
                          fields: [
                              'site_name', 'company', 'state', 'total_oper'
                          ]
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
                    }
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
            }, {
                xtype: 'container',
                reference: 'detailsPanel',
                padding: 10,
                width: '15%',
                region: 'east',
                split: true,
                tpl: ['<h3>Site Name</h3>',
                     '<p>{site_name}</p>',
                     '<h3>Company</h3>',
                     '<p>{company}</p>',
                     '<h3>State</h3>',
                     '<p>{state}</p>',
                     '<h3>Number of Operations</h3>',
                     '<p>{total_oper}</p>'],
                bind: {
                    data: '{selectedValue}'
                }
            }]
        }]
    });
});