Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    filterStore: function(combo, record){
        Ext.getStore('layer1').filter([{
            property: 'case_status',
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
                    fieldLabel: "Sentiment Filter",
                    reference: 'comboFilter',
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        data: [{
                            name: 'Open',
                            value: 'Open'
                        },{
                            name: 'Closed',
                            value: 'Closed'
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
                layers: [{
                    username: 'crestonedigital',
                    subLayers: [{
                        storeId: 'layer1',
                        table: 'denver_service_requests',
                        autoLoad: true,
                        style: {
                          type: 'intensity'
                        },
                        transform: {
                            fn: function(data) {
                                data.rows.forEach(function(item){
                                    item.timestamp = new Date(item.timestamp/1000000);
                                }.bind(this));
                                return data;
                            }
                        }
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
                columns: [{ 
                    text: 'Agency', 
                    dataIndex: 'agency', 
                    flex: 2, 
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    } 
                },{ 
                    text: 'Case Summary', 
                    dataIndex: 'case_summa', 
                    flex: 1,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  
                 },{ 
                    text: 'Case Status', 
                    dataIndex: 'case_status', 
                    flex: 1,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  
                 },{ 
                    xtype:'datecolumn',
                    format:'m-d-Y',
                    text: 'Date Created', 
                    dataIndex: 'case_cre_1', 
                    flex: 1,
                    filter: {
                        type: 'date',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }   
                }],
            }]
        }]
    });
});