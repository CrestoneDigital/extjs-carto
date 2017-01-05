Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Carto.CartoStore'
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
            xtype: "cartomap",
            center: 'us',
            layers: [{
                  subLayers: [{
                      store: {
                          autoLoad: true,
                          proxy: {
                              username: 'extjscarto',
                              table: 'petroleum_refineries'
                          }
                      }
                  }]

            }]
        }]
    });

});