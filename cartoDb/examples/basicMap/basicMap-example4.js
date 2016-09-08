Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);


var layerStore = Ext.create('Ext.data.Store',{
    data: [{
        name: 'Petroleum Refineries',
        value: 'petroleum_refineries'
    }]
});



/**
 *  
 * Basic map Centered on US with a starter layer
 */
Ext.onReady(function () {
    Ext.QuickTips.init();




    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'fit',
            items: [{
                xtype: "cartoMap",
                center: 'us'
            }],
            tbar: [{
                xtype: 'button',
                text: 'Add Layer'
            },{
                xtype: 'combobox',
                fieldLabel: 'Layers',
                displayField: 'name',
                valueField: 'value',
                store: layerStore,
                listeners: {
                    select: function(combo, record, eOpts) {
    debugger
                    },
                    scope: this
                }
            }]
        }]
    });
});