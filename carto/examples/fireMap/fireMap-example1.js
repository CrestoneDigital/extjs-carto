Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('Carto', '../../src/');

Ext.require([
    'Carto.CartoMap',
    'Ext.data.Store'
]);

var dataTextStore = Ext.create('Ext.data.Store',{
    data: [{
        title: 'Federal Fire Occurrence',
        total: '694,294',
        natural: '287,674 natural',
        human: '380,984 human',
        fromYear: '1980',
        toYear: '2013'
    }]
});
var txtTpl = new Ext.XTemplate(
    '<tpl for=".">',
        '<h2>{title}</h2>',
        '<p>Explore <span class="count-style fire-count">{total}</span> (<span class="count-style natural-count">{natural}</span>, <span class="count-style human-count">{human}</span>) fire records collected by Federal land management agencies for fires that occurred from {fromYear} through {toYear} in the United States.</p>',
    '</tpl>'
);

var flag = false

var dataStore = Ext.create('Ext.data.Store',{
    data: [{
        name: 'Fire Map',
        value: 0,
        mapLayer: {
            layerId: 'fireLayer',
            subLayers: [{
                store: {
                    autoLoad: true,
                    proxy: {
                        username: 'crestonedigital',
                        table: 'wildfire'
                    }
                },
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
    },{
        name: 'Causes Map',
        value: 1,
        mapLayer: {
            layerId: 'causesLayer',
            subLayers: [{
                store: {
                    autoLoad: true,
                    proxy: {
                        username: 'crestonedigital',
                        table: 'wildfire'
                    }
                },
                style: {
                    css: ['#wildfire {'+
                            'marker-fill-opacity: 0.9;'+
                            'marker-line-color: #000;'+
                            'marker-line-width: 0;'+
                            'marker-line-opacity: 0;'+
                            'marker-placement: point;'+
                            'marker-type: ellipse;'+
                            'marker-width: 6;'+
                            'marker-allow-overlap: true;'+
                    '}'+
                    '#wildfire[cause="Human"] {'+
                            'marker-fill: #1F78B4;'+
                    '}'+
                    '#wildfire[cause="Natural"] {'+
                            'marker-fill: #B2DF8A;'+
                    '}'+
                    '#wildfire [zoom <18]{'+
                        'marker-fill-opacity: 0.7;'+
                    '}'+
                    '#wildfire [zoom <9]{'+
                        'marker-fill-opacity: 0.4;'+
                        'marker-width: 5;'+
                    '}'+
                    '#wildfire [zoom <8]{'+
                        'marker-fill-opacity: 0.2;'+
                        'marker-width: 4;'+
                    '}'+
                    '#wildfire [zoom <7]{'+
                        'marker-fill-opacity: 0.08;'+
                        'marker-width: 3;'+
                    '}'+
                    '#wildfire [zoom <6]{'+
                        'marker-fill-opacity: 0.07;'+
                        'marker-width: 2;'+
                    '}'+
                    '#wildfire [zoom <5]{'+
                        'marker-width: 1;'+
                    '}'].join(' ')
                }
            }]
        }
    }]
});


var mapController = Ext.create('Ext.app.ViewController',{
    onLayerAdd: function(tag, newRecord, oldRecord){
        if (newRecord.length > oldRecord.length) {
            this.lookup('map').addLayer(dataStore.data.items[newRecord[newRecord.length - 1]].get('mapLayer'));
        } else {
            this.lookup('map').removeLayer(dataStore.data.items[oldRecord[oldRecord.length - 1]].get('mapLayer').layerId);
        }
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
                xtype: "cartomap",
                center: 'us',
                reference: 'map',
                basemap: 'darkMatterLite'
            }],
            tbar: [{
                xtype: 'tagfield',
                reference: 'layers',
                fieldLabel: 'Select Layer',
                displayField: 'name',
                valueField: 'value',
                store: dataStore,
                listeners: {
                    change: 'onLayerAdd'
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