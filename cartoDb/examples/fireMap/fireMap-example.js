Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'Ext.data.Store'
]);


var dataStore = Ext.create('Ext.data.Store',{
    data: [{
        name: 'Fire Map',
        value: 'fire_map',
        mapLayer: {
            username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer1',
                      table: 'wildfire',
                      style: {
                          css: ['#wildfire{',
                                    'marker-fill-opacity: 0.05;',
                                    'marker-line-color: #FFF;',
                                    'marker-line-width: 0.0;',
                                    'marker-line-opacity: 1;',
                                    'marker-placement: point;',
                                    'marker-type: ellipse;',
                                    'marker-width: 6;',
                                    'marker-fill: #FF5C00;',
                                    'marker-allow-overlap: true;',
                                '}',
                                '#wildfire [zoom <18]{',
                                    'marker-fill-opacity: 0.7;',
                                '}',
                                '#wildfire [zoom <9]{',
                                    'marker-fill-opacity: 0.4;',
                                    'marker-width: 5;',
                                '}',
                                '#wildfire [zoom <8]{',
                                    'marker-fill-opacity: 0.2;',
                                    'marker-width: 4;',
                                '}',
                                '#wildfire [zoom <7]{',
                                    'marker-fill-opacity: 0.08;',
                                    'marker-width: 3;',
                                '}',
                                '#wildfire [zoom <6]{',
                                    'marker-fill-opacity: 0.07;',
                                    'marker-width: 2;',
                                '}',
                                '#wildfire [zoom <5]{',
                                    'marker-width: 1;',
                                '}'].join(' ')
                      }
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