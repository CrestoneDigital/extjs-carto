Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap'
]);


/**
 * The most basic usage
 */
// Ext.onReady(function () {
//     Ext.QuickTips.init();

//     Ext.create('Ext.container.Viewport', {
//         layout: 'fit',
//         items: [{
//             xtype: "cartoMap"
//         }]
//     });

// });

/**
 *  
 * Basic map Centered on Russia using Russian ISO3166 code
 */
// Ext.onReady(function () {
//     Ext.QuickTips.init();

//     Ext.create('Ext.container.Viewport', {
//         layout: 'fit',
//         items: [{
//             xtype: "cartoMap",
//             center: 'ru'
//         }]
//     });

// });

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
            layerItems: [
                {
                  username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer1',
                      table: 'petroleum_refineries'
                  }]

                }
            ]

        }]
    });

});