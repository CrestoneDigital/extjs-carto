Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap'
]);

/**
 *  
 * Basic map Centered on US with a starter layer
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: "cartoMap",
            center: 'us',
            layerItems: [{
                  username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer1',
                      table: 'petroleum_refineries'
                  }]

            }]
        }]
    });

});