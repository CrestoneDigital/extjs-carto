Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
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

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            controller: mapController,
            items: [{
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
    });
});