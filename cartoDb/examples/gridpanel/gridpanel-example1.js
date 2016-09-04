Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoProxy'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.data.Store', {
        storeId: 'metrostopsStore',
        proxy: {
            type: 'carto',
            username: 'crestonedigital',
            table: 'us_metro_stations'
        }
    });

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'grid',
            title: 'Metro Stops',
            store: Ext.data.StoreManager.lookup('simpsonsStore'),
            columns: [
                { text: 'City', dataIndex: 'city' },
                { text: 'Name', dataIndex: 'name' }
            ],

            /* Generic footer for reviewing example */
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'bottom',
                items: [{
                    text: 'View Code'
                }]
            }]            
        }]
    });

});