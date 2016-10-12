Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoProxy',
    'CartoDb.CartoStore'
]);

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('CartoDb.CartoStore', {
        storeId: 'metrostopsStore',
        proxy: {
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
            columns: [
                { text: 'City', dataIndex: 'city', flex: 1 },
                { text: 'Name', dataIndex: 'name', flex: 2 }
            ],
            /* Generic footer for reviewing example */
            dockedItems: [{
                xtype: 'toolbar',
                dock: 'top',
                items: [{
                    text: 'View Code',
                },{
                    xtype: 'combo',
                    fieldLabel: "City Filters",
                    displayField: 'name',
                    valueField: 'value',
                    store: Ext.create('Ext.data.Store', {
                        data: [{
                            name: 'Atlanta',
                            value: 'atlanta'
                        },{
                            name: 'Boston',
                            value: 'boston'
                        }]
                    }),
                    listeners: {
                        select: function(combo, record) {
                            this.up('grid').store.filter('city', record.data.value);
                        }
                    }
                }]
            }]            
        }]
    });

});