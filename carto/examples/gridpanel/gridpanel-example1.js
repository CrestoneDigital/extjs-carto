Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoProxy'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.data.Store', {
        storeId: 'metrostopsStore',
        remoteFilter: true,
        remoteSort: true,
        // sorters: 'city',
        sorters: [{
            property: 'city',
            direction: 'ASC'
        }, 'name'],
        proxy: {
            type: 'carto',
            username: 'crestonedigital',
            table: 'us_metro_stations'
        },
        autoLoad: true
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'grid',
            title: 'United States - Metro Stops',
            store: Ext.data.StoreManager.lookup('metrostopsStore'),
            multiColumnSort: true,
            plugins: 'gridfilters',
            columns: [
                { text: 'City', dataIndex: 'city', flex: 1, filter: 'number' },
                {
                    text: 'Name',
                    dataIndex: 'name',
                    flex: 2, 
                    filter: {
                        type: 'string',
                        itemDefaults: {
                            emptyText: 'Search for...'
                        }
                    } 
                }
            ],

            bbar: [{
                xtype: 'pagingtoolbar',
                store: Ext.data.StoreManager.lookup('metrostopsStore'),
                displayInfo: true
            }],

            /* Generic footer for reviewing example */
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                ui: 'dark',
                padding: 10,
                items: [{
                    text: 'View Code'
                }]
            }]            
        }]
    });

});