Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
    'CartoDb.CartoMap',
    'CartoDb.CartoStore'
]);


Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            viewModel: {
                data: {
                    filterCombo: {
                        selection: {
                            author_gender: null
                        }
                    },
                    filterField: {
                        value: ''
                    }
                },
                stores: {
                    layer: {
                        type: 'carto',
                        storeId: 'layer',
                        autoLoad: true,
                        filters: [{
                            property: 'author_gender',
                            value: '{filterCombo.selection.author_gender}',
                            disableOnEmpty: true
                        }, {
                            property: 'text',
                            value: '{filterField.value}',
                            operator: 'regex',
                            disableOnEmpty: true
                        }],
                        proxy: {
                            username: 'extjscarto',
                            table: 'starwars'
                        }
                    },
                    chart: {
                        type: 'carto',
                        storeId: 'chart',
                        autoLoad: true,
                        filters: [{
                            property: 'author_gender',
                            value: '{filterCombo.selection.author_gender}',
                            disableOnEmpty: true
                        }, {
                            property: 'text',
                            value: '{filterField.value}',
                            operator: 'regex',
                            disableOnEmpty: true
                        }],
                        proxy: {
                            groupBy: 'sentiment',
                            username: 'extjscarto',
                            table: 'starwars'
                        }
                    },
                    combo: {
                        type: 'carto',
                        storeId: 'combo',
                        autoLoad: true,
                        proxy: {
                            groupBy: 'author_gender',
                            username: 'extjscarto',
                            table: 'starwars'
                        }
                    }
                }
            },
            tbar: [{
                xtype: 'combo',
                reference: 'filterCombo',
                fieldLabel: 'Author Gender',
                forceSelection: true,
                bind: {
                    store: '{combo}'
                },
                displayField: 'author_gender',
                valueField: 'author_gender'
            }, {
                xtype: 'textfield',
                reference: 'filterField',
                publishes: ['value'],
                fieldLabel: 'Keyword'
            }],
            items: [{
                xtype: "cartomap",
                region: 'center',
                center: 'us',
                layers: [{
                    subLayers: [{
                        bind: '{layer}',
                        interactivity: {
                            enable: true,
                            tooltip: {
                                enable: true
                            },
                            fields: ['text']
                        },
                        style: {
                            css:    "#layer {" +
                                    "  marker-line-width: 1;" +
                                    "  marker-line-color: #FFF;" +
                                    "  marker-line-opacity: 1;" +
                                    "  marker-width: 7;" +
                                    "  marker-fill: gray;" +
                                    "  marker-fill-opacity: 0.9;" +
                                    "  marker-allow-overlap: true;" +
                                    "}" +
                                    "#layer [sentiment = 'pos'] {" +
                                    "   marker-fill: blue;" +
                                    "}" +
                                    "#layer [sentiment = 'neg'] {" +
                                    "   marker-fill: red;" +
                                    "}"
                        }
                    }]
                }]
            }, {
                xtype: 'cartesian',
                region: 'west',
                split: true,
                width: '30%',
                bind: '{chart}',
                axes: [{
                    type: 'numeric',
                    position: 'left',
                    title: {
                        text: 'Number',
                        fontSize: 15
                    },
                    fields: 'cnt'
                }, {
                    type: 'category',
                    position: 'bottom',
                    title: {
                        text: 'Sentiment',
                        fontSize: 15
                    },
                    fields: 'sentiment'
                }],
                series: {
                    type: 'bar',
                    renderer: function(sprite, config, rendererData, index) {
                        return {
                            fillStyle: (index === 0) ? 'gray' : (index === 1) ? 'blue' : 'red'
                        };
                    },
                    subStyle: {
                        stroke: '#1F6D91'
                    },
                    xField: 'sentiment',
                    yField: 'cnt'
                }
            }]
        }]
    });
});