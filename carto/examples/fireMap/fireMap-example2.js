Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src');

Ext.require([
    'CartoDb.CartoMap',
    'CartoDb.CartoStore',
    'CartoDb.CartoProxy',
    'Ext.data.Store'
    // 'Ext.chart.CartesianChart',
    // 'Ext.chart.axis.Numeric',
    // 'Ext.chart.axis.Category',
    // 'Ext.chart.series.Bar'
]);
var aboutHtml = ['<div class="about-style"><p>Data provided by <a href="http://wildfire.cr.usgs.gov/firehistory/index.html" target="_blank">The USGS Federal Fire Occurrence Website</a>.',
'The Federal Fire Occurrence Website is an official government website that provides users with the ability to query, research and download wildland fire occurrence data. The Federal Fire Occurrence Website is an official Department of the Interior Website provided by the United States Geological Survey.<br>',
'Wildfire data avaliable at <a href="http://wildfire.cr.usgs.gov/firehistory/data.html" target="_blank">http://wildfire.cr.usgs.gov/firehistory/data.html</a>.</p>',
'<p><img class="header_logo pull-left" height="90" width="163" src="http://www.crestonedigital.com/resources/images/crestone-digital-logo-white-lg.jpg">Being based in Colorado means that we deal with forest fires on an annual basis. Here at Crestone Digital we wanted to tell more with the data that is being collected and allow others to explore our countries histories wildfires. With CartoDB we have been able to leverage real time filters and statistics with ~700k incidents. Crestone Digital is a full service software solutions provider for all industries and would love to work on your next project. <a href="http://www.crestonedigital.com/" target="_blank">Visit our website to learn more</a>.</p></div>'].join('');
var allFiresCss = ['#wildfire{',
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
                    '}'].join(' ');
var causeOfFiresCss = ['#wildfire {'+
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
                        '}'].join(' ');

var mapController = Ext.create('Ext.app.ViewController',{
    init: function() {
        var totalsStore = Ext.create('CartoDb.CartoStore', {
            storeId: 'totalsStore',
            proxy: {
                table: 'wildfire',
                username: 'crestonedigital',
                groupBy: 'cause'
            },
            listeners: {
                load: {
                    fn: 'updateData',
                    scope: this
                }
            },
            autoLoad: true
        });
    },
    updateData: function(store, records) {
        data = {};
        for (var i = 0; i < records.length; i++) {
            var cause = records[i].get('cause') || 'Unknown';
            data[cause] = records[i].get('cnt');
        }
        this.lookup('summaryview').setData(data);
    },
    onAbout: function() {
        Ext.create('Ext.window.Window', {
            title: 'About Project',
            html: aboutHtml,
            modal: true,
            width: 898,
            height: 298,
            padding: 15,
            bodyCls: 'about'
        }).show();
    },
    onStatsToggle: function(seg, button, isPressed) {
        if (isPressed) {
            var store = Ext.getStore('firesStats');
            store.getProxy().getReader().propertyToAggregateOn = button.agg;
            store.load();
        }
    },
    showAllFires: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(allFiresCss);
    },
    showCauseOfFires: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(causeOfFiresCss);
    },
    onFilterChange: function(field, newValue, oldValue) {
        var filter = field.getReference(),
            property = field.valueField,
            stores = [Ext.getStore('layer1'), Ext.getStore('firesStats'), Ext.getStore('totalsStore')],
            containsFilter = newValue.length > 0;
        for (var i = 0; i < stores.length; i++) {
            stores[i].removeFilter(filter, containsFilter);
            if (containsFilter) {
                stores[i].addFilter(new Ext.util.Filter({
                    id: filter,
                    property: property,
                    value: newValue,
                    operator: 'in'
                }));
            }
        }
    }
});

var mapViewModel = Ext.create('Ext.app.ViewModel');

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            controller: mapController,
            viewModel: mapViewModel,
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [{
                    xtype: "cartoMap",
                    center: 'us',
                    reference: 'map',
                    basemap: 'darkMatterLite',
                    bind: {
                        mapLock: '{mapLock.checked}',
                    },
                    storesToLock: ['firesStats', 'totalsStore'],
                    layers: [{
                        username: 'crestonedigital',
                        subLayers: [{
                            storeId: 'layer1',
                            table: 'wildfire',
                            style: {
                                css: allFiresCss
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
                }, '->', {
                    xtype: 'checkbox',
                    reference: 'mapLock',
                    fieldLabel: 'Show statistics in map frame',
                    labelWidth: 170
                }]
            }, {
                xtype: 'tabpanel',
                split: true,
                width: '25%',
                region: 'east',
                items: [{
                    title: 'Summary',
                    reference: 'summaryview',
                    padding: 15,
                    tpl: new Ext.XTemplate('<div class="count-style"><p>Explore ',
                    '{[this.showTotals(values.Human, values.Natural, values.Unknown)]} ',
                    '{[this.showIfExists(values.Human, values.Natural)]}',
                    'fire records collected by Federal land management agencies for fires that occurred from 1980 through 2013 in the United States.</p>',
                    '<p>Legend:',
                    '<br><span style="background-color:white;">|x_i - x̅| < s</span>',
                    '<br><span style="background-color:#ffff99;">s ≤ |x_i - x̅| < 2s</span>',
                    '<br><span style="background-color:#ff9933;">2s ≤ |x_i - x̅| < 3s</span>',
                    '<br><span style="background-color:#ff6666; color:white;">3s ≤ |x_i - x̅|</span>',
                    '</p>',
                    {
                        showTotals: function(human, natural, unknown) {
                            var total = 0;
                            total += human || 0;
                            total += natural || 0;
                            total += unknown || 0;
                            return '<span class="fire-count">' + Ext.util.Format.number(total, '0,000') + '</span>'
                        },
                        showIfExists: function(human, natural) {
                            var humanStr = '<span class="human-count">' + Ext.util.Format.number(human, '0,000') + ' human</span>';
                            var naturalStr = '<span class="natural-count">' + Ext.util.Format.number(natural, '0,000') + ' natural</span>';
                            if (human && natural) {
                                return '(' + naturalStr + ', ' + humanStr + ') ';
                            } else if (human) {
                                return '(' + humanStr + ') ';
                            } else if (natural) {
                                return '(' + naturalStr + ') ';
                            } else {
                                return '';
                            }
                        }
                    }
                    )
                }, {
                    // xtype: 'cartesian',
                    xtype: 'grid',
                    columns: [
                        {text: 'Year', dataIndex: 'year', width: 65},
                        {text: 'Number of Fires', dataIndex: 'cnt', align: 'end', xtype: 'numbercolumn', format: '0,000', flex: 1},
                        {text: 'Total Acres', dataIndex: 'sum', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1},
                        {text: 'Average Acres', dataIndex: 'avg', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1}
                    ],
                    title: 'Statistics',
                    viewConfig: {
                        stripeRows: false,
                        getRowClass: function(record) {
                            switch (record.get('sig')) {
                                case 0: return 'white-row';
                                case 1: return 'yellow-row';
                                case 2: return 'orange-row';
                                default: return 'red-row';
                            }
                        }
                    },
                    tbar: ['->', {
                        xtype: 'segmentedbutton',
                        items: [{
                            text: 'Acres',
                            agg: 'sum',
                            pressed: true
                        }, {
                            text: 'Fires',
                            agg: 'cnt',
                        }],
                        listeners: {
                            toggle: 'onStatsToggle'
                        }
                    }, '->'],
                    store: {
                        type: 'CartoStore',
                        autoLoad: true,
                        storeId: 'firesStats',
                        filters: [{
                            property: 'year_',
                            operator: 'notnull'
                        }],
                        // groupBy: [{
                        //     property: 'year_',
                        //     name: 'year'
                        // }, {
                        //     property: 'totalacres',
                        //     name: 'acres',
                        //     aggregateType: 'sum'
                        // }],
                        sorters: {
                            property: 'year',
                            direction: 'desc'
                        },
                        proxy: {
                            table: 'wildfire',
                            username: 'crestonedigital',
                            groupBy: [{
                                property: 'year_',
                                name: 'year'
                            }, {
                                property: 'totalacres',
                                name: 'sum',
                                aggregateType: 'sum'
                            }, {
                                property: 'totalacres',
                                name: 'avg',
                                aggregateType: 'avg'
                            }, {
                                property: 'totalacres',
                                name: 'min',
                                aggregateType: 'min'
                            }, {
                                property: 'totalacres',
                                name: 'max',
                                aggregateType: 'max'
                            }, {
                                property: 'totalacres',
                                name: 'dev',
                                aggregateType: 'stddev'
                            }],
                            reader: {
                                propertyToAggregateOn: 'sum',
                                transform: function(data) {
                                    var acres = Ext.Array.pluck(data.rows, this.propertyToAggregateOn),
                                        avg = jStat.mean(acres),
                                        dev = jStat.stdev(acres, true);

                                    return data.rows.map(function(row) {
                                        var sig = Math.floor(Math.abs((row[this.propertyToAggregateOn] - avg)/dev));
                                        row.sig = (isNaN(sig)) ? 0 : sig;
                                        return row;
                                    }.bind(this));
                                }
                            }
                        }
                    }
                    // axes: [{
                    //     type: 'numeric',
                    //     position: 'left',
                    //     title: {
                    //         text: 'Sample Values',
                    //         fontSize: 15
                    //     },
                    //     fields: 'value'
                    // }, {
                    //     type: 'category',
                    //     position: 'bottom',
                    //     title: {
                    //         text: 'Sample Values',
                    //         fontSize: 15
                    //     },
                    //     fields: 'name'
                    // }],
                    // series: {
                    //     type: 'bar',
                    //     // subStyle: {
                    //     //     fill: ['#388FAD'],
                    //     //     stroke: '#1F6D91'
                    //     // },
                    //     xField: 'name',
                    //     yField: 'value'
                    // }
                }, {
                    title: 'Filters',
                    margin: 10,
                    layout: {
                        type: 'vbox',
                        // pack: 'center',
                        align: 'center'
                    },
                    defaults: {
                        xtype: 'tagfield',
                        // flex: 1,
                        width: '100%',
                        listeners: {
                            change: 'onFilterChange'
                        }
                    },
                    items: [{
                        reference: 'stateFilter',
                        fieldLabel: 'State',
                        valueField: 'state',
                        displayField: 'state',
                        store: {
                            type: 'CartoStore',
                            storeId: 'statesStore',
                            sorters: 'state',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'state'
                            }
                        }
                    }, {
                        reference: 'sizeFilter',
                        fieldLabel: 'Size Class',
                        valueField: 'sizeclass',
                        displayField: 'sizeclass',
                        store: {
                            type: 'CartoStore',
                            storeId: 'sizeStore',
                            sorters: 'sizeclass',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'sizeclass'
                            }
                        }
                    }, {
                        reference: 'fireTypeFilter',
                        fieldLabel: 'Fire Type',
                        valueField: 'firetype',
                        displayField: 'firetype',
                        store: {
                            type: 'CartoStore',
                            storeId: 'fireTypeStore',
                            sorters: 'firetype',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'firetype'
                            }
                        }
                    }, {
                        reference: 'protectionTypeFilter',
                        fieldLabel: 'Protection Type',
                        valueField: 'protection',
                        displayField: 'protection',
                        store: {
                            type: 'CartoStore',
                            storeId: 'protectionTypeStore',
                            sorters: 'protection',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'protection'
                            }
                        }
                    }, {
                        reference: 'specificCauseFilter',
                        fieldLabel: 'Specific Cause',
                        valueField: 'speccause',
                        displayField: 'speccause',
                        store: {
                            type: 'CartoStore',
                            storeId: 'specificCauseStore',
                            sorters: 'speccause',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'speccause'
                            }
                        }
                    }, {
                        reference: 'statisticalCauseFilter',
                        fieldLabel: 'Statistical Cause',
                        valueField: 'statcause',
                        displayField: 'statcause',
                        store: {
                            type: 'CartoStore',
                            storeId: 'statisticalCauseStore',
                            sorters: 'statcause',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'statcause'
                            }
                        }
                    }, {
                        reference: 'yearFilter',
                        fieldLabel: 'Year',
                        valueField: 'year_',
                        displayField: 'year_',
                        store: {
                            type: 'CartoStore',
                            storeId: 'yearStore',
                            sorters: 'year_',
                            proxy: {
                                table: 'wildfire',
                                username: 'crestonedigital',
                                groupBy: 'year_'
                            }
                        }
                    }]
                }]
            }],
            tbar: [{
                xtype: 'label',
                html: '<h1>Federal Fire Occurrences</h1>'
            }, '->', {
                xtype: 'button',
                text: 'About',
                iconCls: 'x-fa fa-question',
                handler: 'onAbout'
            }]
        }]
    });
});