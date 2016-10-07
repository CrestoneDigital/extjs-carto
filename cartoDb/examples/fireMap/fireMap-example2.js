Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
<<<<<<< HEAD
    'Ext.data.Store',
    'Ext.chart.CartesianChart',
    'Ext.chart.axis.Numeric',
    'Ext.chart.axis.Category',
    'Ext.chart.series.Bar'
]);

var mapController = Ext.create('Ext.app.ViewController',{
    onAbout: function() {
        console.log('about');
    },
    showAllFires: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(['#wildfire{',
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
        );
    },
    showCauseOfFires: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(['#wildfire{',
                                                            'marker-fill-opacity: 0.05;',
                                                            'marker-line-color: #FFF;',
                                                            'marker-line-width: 0.0;',
                                                            'marker-line-opacity: 1;',
                                                            'marker-placement: point;',
                                                            'marker-type: ellipse;',
                                                            'marker-width: 6;',
                                                            'marker-fill: #00FF00;',
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
        );
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();

=======
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
//};

var flag = false

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
    },{
        name: 'Causes Map',
        value: 'causes_map',
        mapLayer: {
            username: 'crestonedigital',
                  subLayers: [{
                      storeId: 'layer2',
                      table: 'wildfire',
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
/*
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
    },
*/
    customFn: function(container, button, pressed) {
        if(flag) {
            this.lookup('map').removeLayerAtIndex(0);
            flag = false;
        }
        switch(button.itemId) {
            case 'allfires':
                var storeItem = dataStore.getData().items[0];
                this.lookup('map').addLayer(storeItem.data.mapLayer, function(){
                    console.log('mapLayerAdded');
                    flag = true;
                });
                break;
            case 'causes':
                var storeItem = dataStore.getData().items[1];
                this.lookup('map').addLayer(storeItem.data.mapLayer, function(){
                    console.log('mapLayerAdded');
                    flag = true;
                });
                break;
        }
    }
    
});


/**
 *  
 * Basic map w/toolbar Centered on US. 
 */
Ext.onReady(function () {
    Ext.QuickTips.init();
>>>>>>> 9a88ff883f7f82de4c7d54316a05ad86db8d481d
    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            controller: mapController,
            items: [{
<<<<<<< HEAD
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [{
                    xtype: "cartoMap",
                    center: 'us',
                    reference: 'map',
                    baseLayerName: 'Dark Matter (lite)',
                    layerItems: [{
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
                    }]
                }],
                tbar: [{
                    xtype: 'segmentedbutton',
                    items: [{
                        text: 'All Fires',
                        handler: 'showAllFires',
                        pressed: true
                    }, {
                        text: 'Cause',
                        handler: 'showCauseOfFires'
                    }]
                }]
            }, {
                xtype: 'tabpanel',
                width: '25%',
                region: 'east',
                items: [{
                    title: 'Timeline'
                }, {
                    title: 'Statistics',
                    tbar: ['->', {
                        xtype: 'segmentedbutton',
                        items: [{
                            text: 'Acres'
                        }, {
                            text: 'Fires'
                        }]
                    }, '->'],
                    xtype: 'cartesian',
//    renderTo: document.body,
//    width: 600,
//    height: 400,
   store: {
       fields: ['name', 'value'],
       data: [{
           name: 'metric one',
           value: 10
       }, {
           name: 'metric two',
           value: 7
       }, {
           name: 'metric three',
           value: 5
       }, {
           name: 'metric four',
           value: 2
       }, {
           name: 'metric five',
           value: 27
       }]
   },
   axes: [{
       type: 'numeric',
       position: 'left',
       title: {
           text: 'Sample Values',
           fontSize: 15
       },
       fields: 'value'
   }, {
       type: 'category',
       position: 'bottom',
       title: {
           text: 'Sample Values',
           fontSize: 15
       },
       fields: 'name'
   }],
   series: {
       type: 'bar',
       subStyle: {
           fill: ['#388FAD'],
           stroke: '#1F6D91'
       },
       xField: 'name',
       yField: 'value'
   }
                }, {
                    title: 'Filters'
                }]
            }],
            tbar: [{
                xtype: 'label',
                html: '<h2>Federal Fire Occurrences</h2>'
            }, '->', {
                xtype: 'button',
                text: 'About',
                handler: 'onAbout'
            }]
        }]
=======
                region: 'center',
                xtype: "cartoMap",
                center: 'us',
                reference: 'map',
                baseLayerName: 'Dark Matter (lite)'
            }, {
                xtype: "panel",
                region: 'east',
                width: 300,
                bodyPadding: 3,
                layout: {
                    type: 'vbox',
                    pack: 'start',
                    align: 'stretch'
                },
                items: [{
                        xtype: 'dataview',
                        itemSelector: 'div',
                        tpl: txtTpl,
                        store: dataTextStore
                     }, {
                        xtype: 'panel',
                        title: 'Filters',
                        flex: 1,
                        bodyPadding: 10,
                        margin: '0 0 10 0',
                        fullscreen: true,
                        items: [{
                            xtype: 'combobox',
                            reference: 'combo1',
                            fieldLabel: 'Select1',
                            displayField: 'name',
                            valueField: 'value',
                            store: dataStore,
                            listeners: {
                                select: 'onLayerAdd'
                            },
//                            width: 350,
                            editable: false
                        },{
                            xtype: 'combobox',
                            reference: 'combo2',
                            fieldLabel: 'Select2',
                            displayField: 'name',
                            valueField: 'value',
                            store: dataStore,
                            listeners: {
                                select: 'onLayerAdd'
                            },
//                            width: 350,
                            editable: false
                        }]
                         
                    }]
            }],
            tbar: [/*{
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
            },*/{
                xtype: 'segmentedbutton',
                allowMultiple: false,
                allowToggle: true,
                items: [{
                    text: 'All Fires',
                    id:'searchButton',
                    itemId: 'allfires',
                    handler: 'customFn',
//                    pressed: true
                }, {
                    text: 'Causes',
                    handler: 'customFn',
                    itemId: 'causes'
                }],
                listeners: {
                    toggle: 'customFn',
                    afterRender: function() {
                    }
                }
            }]
        }],
        listeners: {
            afterrender: function() {
//                console.log("In Fn", Ext.get(''));
                Ext.get('searchButton').dom.click();
               
            }
        }
>>>>>>> 9a88ff883f7f82de4c7d54316a05ad86db8d481d
    });
});