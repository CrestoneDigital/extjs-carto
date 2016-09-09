Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);


var dataStore = Ext.create('Ext.data.Store',{
    data: [{
        name: 'Petroleum Refineries',
        value: 'petroleum_refineries',
        mapLayer: {
            username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer1',
                      table: 'wildfire'
                  }]
        }
    }]
});


var mapController = Ext.create('Ext.app.ViewController',{
    onLayerAdd: function(combo, record, eOpts){
        this.lookup('map').addLayer(record.data.mapLayer, function(){
            console.log('mapLayerAdded');
        });
        this.lookup('removeButton').enable();
    },
    removeMapLayer: function(button, e, eOpts) {
        this.lookup('map').removeLayerAtIndex(0);
        this.lookup('combo').reset();
        button.disable();
    }
});

/**
 *  
 * Basic map w/toolbar Centered on US. 
 */
Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'fit',
            controller: mapController,
            items: [{
                xtype: "cartoMap",
                center: 'us',
                reference: 'map',
                baseLayerName: 'Dark Matter (lite)'
            }],
            tbar: [{
                xtype: 'combobox',
                reference: 'combo',
                fieldLabel: 'Select Layer',
                displayField: 'name',
                valueField: 'value',
                store: dataStore,
                listeners: {
                    select: 'onLayerAdd'
                },
                width: 350,
                editable: false
            },{
                xtype: 'button',
                text: 'Remove Layer',
                handler: 'removeMapLayer',
                disabled: true,
                reference: 'removeButton'
            }]
        }]
    });
});