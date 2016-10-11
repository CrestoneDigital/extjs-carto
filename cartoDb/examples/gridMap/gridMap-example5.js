Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    filterStore: function(combo, record){
        Ext.getStore('layer1').filter([{
            property: 'city',
            value: record.data.value,
            operator: 'like'
        }]);
    },
    clearFilter: function(){
        this.lookup('comboFilter').reset();
        Ext.getStore('layer1').clearFilter();
    }
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
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'View Code',
                },{
                    xtype: 'combo',
                    fieldLabel: "City Filters",
                    reference: 'comboFilter',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        data: [{
                            name: 'Atlanta',
                            value: 'Atlanta'
                        },{
                            name: 'Boston',
                            value: 'Boston'
                        }]
                    }),
                    listeners: {
                        select: 'filterStore'
                    }
                },{
                    xtype: 'button',
                    text: 'Clear Filter',
                    handler: 'clearFilter'
                }]
            }],            
            items: [{
                xtype: "cartoMap",
                region: 'center',
                center: 'us',
                reference: 'map',
                basemap: 'darkMatterLite',
                layerItems: [{
                    username: 'crestonedigital',
                    subLayers: [{
                        storeId: 'layer1',
                        table: 'us_metro_stations',
                        autoLoad: true
                  }]

                }]
            },{
                xtype: 'grid',
                region: 'south',
                reference: 'southGrid',
                split: true,
                height: 350,
                plugins: 'gridfilters',
                listeners: {
                    afterrender: function(){
                        this.setStore(Ext.getStore('layer1'));
                    }
                },
                // store: Ext.getStore('layer1'),
                columns: [
                    { text: 'City', dataIndex: 'city', flex: 1, filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  },
                    { text: 'Name', dataIndex: 'name', flex: 2 }
                ],
            }]
        }]
    });
});