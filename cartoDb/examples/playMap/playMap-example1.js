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

var simplePointCss =    '#table {\n' +
                        '   marker-fill-opacity: 0.9;\n' +
                        '   marker-line-color: #FFF;\n' +
                        '   marker-line-width: 1.5;\n' +
                        '   marker-line-opacity: 1;\n' +
                        '   marker-placement: point;\n' +
                        '   marker-type: ellipse;\n' +
                        '   marker-width: 10;\n' +
                        '   marker-fill: #FF6600;\n' +
                        '   marker-allow-overlap: true;\n' +
                        '}';
var simpleLineCss =     '#table {\n' +
                        '  line-color: #FFF;\n' +
                        '  line-width: 0.5;\n' +
                        '  line-opacity: 1;\n' +
                        '}';
var simplePolygonCss =  '#table {\n' +
                        '  polygon-fill: #FF6600;\n' +
                        '  polygon-opacity: 0.7;\n' +
                        '  line-color: #FFF;\n' +
                        '  line-width: 0.5;\n' +
                        '  line-opacity: 1;\n' +
                        '}';
var toIgnore = ['cartodb_id', 'the_geom', 'the_geom_webmercator'];

var mapController = Ext.create('Ext.app.ViewController',{
    init: function() {
        // var totalsStore = Ext.create('CartoDb.CartoStore', {
        //     storeId: 'totalsStore',
        //     proxy: {
        //         type: 'carto',
        //         table: 'wildfire',
        //         username: 'crestonedigital',
        //         groupBy: 'cause'
        //     },
        //     listeners: {
        //         load: {
        //             fn: 'updateData',
        //             scope: this
        //         }
        //     },
        //     autoLoad: true
        // });
        this.stores = [
            Ext.getStore('tableStore'),
            Ext.create('CartoDb.CartoStore', {
                storeId: 'columnsStore',
                proxy: {
                    type: 'carto',
                    username: 'crestonedigital',
                    mode: 'columns'
                },
                listeners: {
                    load: {
                        fn: 'addFilters',
                        scope: this
                    }
                }
            })
        ];
    },
    setByStr: function(str, value, load) {
        for (var i = 0; i < this.stores.length; i++) {
            this.stores[i].getProxy()[str](value);
            if (load) this.stores[i].load();
        }
    },
    onSelectUsername: function(field, e) {
        var value = field.getValue();
        this.setByStr('setUsername', value, false);
        this.lookup('tableBox').clearValue();
        this.getViewModel().set('username', value);
    },
    onSelectTable: function(combo, record) {
        var value = record.get('table'),
            map = this.lookup('map');
        this.setByStr('setTable', value, true);
        this.getViewModel().set('table', value);
        map.removeLayerAtIndex(0);
        map.addLayer({
            username: this.getViewModel().get('username'),
            subLayers: [{
                storeId: 'layer1',
                table: value
            }]
        });
    },
    addFilters: function(store, records) {
        var filtersView = this.lookup('filtersView'),
            table = this.getViewModel().get('table'),
            username = this.getViewModel().get('username'),
            column;
        filtersView.removeAll();
        for (var i = 0; i < records.length; i++) {
            column = records[i].get('column');
            if (toIgnore.indexOf(column) === -1) {
                filtersView.add(Ext.create('Ext.form.field.Tag', {
                    reference: 'carto-filter-' + i,
                    fieldLabel: column,
                    valueField: column,
                    displayField: column,
                    store: {
                        type: 'CartoStore',
                        sorters: column,
                        proxy: {
                            type: 'carto',
                            table: table,
                            username: username,
                            groupBy: column,
                            limit: 500
                        }
                    }
                }));
            }
        }
    },
    onApplyCss: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(this.lookup('cssEditor').getValue());
    },
    // updateData: function(store, records) {
    //     data = {};
    //     for (var i = 0; i < records.length; i++) {
    //         var cause = records[i].get('cause') || 'Unknown';
    //         data[cause] = records[i].get('cnt');
    //     }
    //     this.lookup('summaryview').setData(data);
    // },
    // onAbout: function() {
    //     Ext.create('Ext.window.Window', {
    //         title: 'About Project',
    //         html: aboutHtml,
    //         modal: true,
    //         width: 898,
    //         height: 298,
    //         padding: 15,
    //         bodyCls: 'about'
    //     }).show();
    // },
    // showAllFires: function() {
    //     Ext.getStore('layer1').getSubLayer().setCartoCSS(allFiresCss);
    // },
    // showCauseOfFires: function() {
    //     Ext.getStore('layer1').getSubLayer().setCartoCSS(causeOfFiresCss);
    // },
    onFilterChange: function(field, newValue, oldValue) {
        var filter = field.getReference(),
            property = field.valueField,
            stores = [Ext.getStore('layer1')],
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

var mapViewModel = Ext.create('Ext.app.ViewModel', {
    formulas: {
        cssChoice: {
            bind: '{cssOptions.value}',
            get: function(value) {
                switch (value) {
                    case 0: return simplePointCss;
                    case 1: return simpleLineCss;
                    case 2: return simplePolygonCss;
                    default: return '';
                }
            }
        }
    },
    data: {
        username: 'crestonedigital',
        table: null
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
            viewModel: mapViewModel,
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [{
                    xtype: "cartoMap",
                    center: 'us',
                    reference: 'map',
                    baseLayerName: 'Dark Matter (lite)'
                    // bind: {
                    //     mapLock: '{mapLock.checked}',
                    // },
                    // storesToLock: ['firesStats', 'totalsStore'],
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
                bind: {
                    disabled: '{!table}',
                },
                split: true,
                width: '25%',
                region: 'west',
                items: [{
                    reference: 'filtersView',
                    title: 'Filters',
                    margin: 10,
                    scrollable: true,
                    layout: {
                        type: 'vbox',
                        align: 'center'
                    },
                    defaults: {
                        width: '100%',
                        listeners: {
                            change: 'onFilterChange'
                        }
                    }
                }, {
                    title: 'CartoCSS',
                    height: '100%',
                    tbar: ['->', {
                        xtype: 'segmentedbutton',
                        reference: 'cssOptions',
                        items: [{
                            text: 'Point',
                            pressed: true
                        }, {
                            text: 'Line'
                        }, {
                            text: 'Polygon'
                        }]
                    }, '->'],
                    items: [{
                        xtype: 'textareafield',
                        reference: 'cssEditor',
                        bind: {
                            value: '{cssChoice}'
                        },
                        height: '100%',
                        width: '100%'
                    }],
                    bbar: [{
                        text: 'CartoCSS Docs',
                        iconCls: 'x-fa fa-book',
                        handler: function() {
                            window.open('https://carto.com/docs/carto-engine/cartocss/', '_blank');
                        }
                    }, '->', {
                        text: 'Apply CSS',
                        handler: 'onApplyCss'
                    }]
                }, {
                    // xtype: 'cartesian',
                    xtype: 'grid',
                    columns: [
                        {text: 'Year', dataIndex: 'year', align: 'end', width: 65},
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
                    // tbar: ['->', {
                    //     xtype: 'segmentedbutton',
                    //     items: [{
                    //         text: 'Acres'
                    //     }, {
                    //         text: 'Fires'
                    //     }]
                    // }, '->'],
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
                            type: 'carto',
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
                                transform: function(data) {
                                    var acres = Ext.Array.pluck(data.rows, 'sum'),
                                        avg = jStat.mean(acres),
                                        dev = jStat.stdev(acres, true);

                                    return data.rows.map(function(row) {
                                        var sig = Math.floor(Math.abs((row.sum - avg)/dev));
                                        row.sig = (isNaN(sig)) ? 0 : sig;
                                        return row;
                                    });
                                }
                            }
                        }
                    }
                }]
            }],
            tbar: [{
                xtype: 'textfield',
                reference: 'usernameField',
                fieldLabel: 'Username',
                value: 'crestonedigital',
                listeners: {
                    blur: 'onSelectUsername'
                }
            }, {
                xtype: 'combobox',
                reference: 'tableBox',
                fieldLabel: 'Table',
                valueField: 'table',
                displayField: 'table',
                editable: false,
                listeners: {
                    select: 'onSelectTable'
                },
                store: {
                    storeId: 'tableStore',
                    sorters: 'table',
                    proxy: {
                        type: 'carto',
                        mode: 'tables',
                        username: 'crestonedigital'
                    }
                }
            }, '->', {
                xtype: 'button',
                text: 'About',
                iconCls: 'x-fa fa-question',
                handler: 'onAbout'
            }]
        }]
    });
});