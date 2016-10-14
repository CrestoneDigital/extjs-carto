Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);



var mapController = Ext.create('Ext.app.ViewController',{
    filterStore: function(combo, record){
        Ext.getStore('layer1').filter([{
            property: 'sentiment',
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
                            username: 'crestonedigital',
                            table: 'starwars',
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
                            name: 'Negative',
                            value: 'neg'
                        },{
                            name: 'Postive',
                            value: 'pos'
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
                    fieldLabel: "Sentiment Filter",
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
                    text: 'Author Handle', 
                    dataIndex: 'author_handle', 
                    flex: 2, 
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  
                },{ 
                    text: 'Author Gender', 
                    dataIndex: 'author_gender', 
                    flex: 1,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  
                },{ 
                    text: 'Followers', 
                    dataIndex: 'followers', 
                    flex: 1,
                    filter: {
                        type: 'number',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    } 
                 },{ 
                    text: 'Sentiment', 
                    dataIndex: 'sentiment', 
                    flex: 1/2,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }  
                 },{ 
                    text: 'Text', 
                    dataIndex: 'text', 
                    flex: 3,
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    }
                }]
            }]
        }]
    });
});