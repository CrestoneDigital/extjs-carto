Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    filterStore: function(combo, record){
        Ext.getStore('layer1').filter([{
            property: 'case_status',
            value: record.get('value'),
            operator: 'like'
        }]);
    },
    clearFilter: function(){
        this.lookup('comboFilter').reset();
        Ext.getStore('layer1').clearFilter();
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
                            username: 'extjscarto',
                            table: 'denver_service_requests',
                            reader: {
                                transform: {
                                    fn: function(data) {
                                        data.rows.forEach(function(item){
                                            item.timestamp = new Date(item.timestamp/1000000);
                                        }.bind(this));
                                        return data;
                                    }
                                }
                            }
                        }
                    },
                    combo: {
                        data: [{
                            name: 'Open',
                            value: 'Open'
                        },{
                            name: 'Closed',
                            value: 'Closed'
                        }]
                    }
                }
            },
            controller: mapController,
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'View Code',
                },{
                    xtype: 'combo',
                    fieldLabel: "Case Filter",
                    reference: 'comboFilter',
                    displayField: 'name',
                    valueField: 'value',
                    bind: {
                        store: '{combo}'
                    },
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
                xtype: "cartomap",
                region: 'center',
                center: 'us',
                reference: 'map',
                basemap: 'darkMatterLite',
                maskWhileLoading: true,
                layers: [{
                    subLayers: [{
                        bind: '{layer}',
                        style: {
                          type: 'intensity'
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
                bind: {
                    store: '{layer}'
                },
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