Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoProxy'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.data.Store', {
        storeId: 'metrostopsStore',
        proxy: {
            type: 'carto',
            username: 'extjscarto',
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
            columns: [
                { text: 'City', dataIndex: 'city', flex: 1 },
                { text: 'Name', dataIndex: 'name', flex: 2 }
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