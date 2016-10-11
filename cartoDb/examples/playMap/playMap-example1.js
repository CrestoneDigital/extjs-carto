Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src');

Ext.require([
    'CartoDb.CartoMap',
    'CartoDb.CartoStore',
    'CartoDb.CartoProxy',
    'CartoDb.CartoBasemaps',
    'Ext.data.Store'
]);
var aboutHtml = ['<div class="about-style"><p>Data provided by <a href="http://wildfire.cr.usgs.gov/firehistory/index.html" target="_blank">The USGS Federal Fire Occurrence Website</a>.',
'The Federal Fire Occurrence Website is an official government website that provides users with the ability to query, research and download wildland fire occurrence data. The Federal Fire Occurrence Website is an official Department of the Interior Website provided by the United States Geological Survey.<br>',
'Wildfire data avaliable at <a href="http://wildfire.cr.usgs.gov/firehistory/data.html" target="_blank">http://wildfire.cr.usgs.gov/firehistory/data.html</a>.</p>',
'<p><img class="header_logo pull-left" height="90" width="163" src="http://www.crestonedigital.com/resources/images/crestone-digital-logo-white-lg.jpg">Being based in Colorado means that we deal with forest fires on an annual basis. Here at Crestone Digital we wanted to tell more with the data that is being collected and allow others to explore our countries histories wildfires. With CartoDB we have been able to leverage real time filters and statistics with ~700k incidents. Crestone Digital is a full service software solutions provider for all industries and would love to work on your next project. <a href="http://www.crestonedigital.com/" target="_blank">Visit our website to learn more</a>.</p></div>'].join('');

var simplePointCss   =    '#table {\n   marker-fill-opacity: 0.9;\n   marker-line-color: #FFF;\n   marker-line-width: 1.5;\n   marker-line-opacity: 1;\n   marker-placement: point;\n   marker-type: ellipse;\n   marker-width: 10;\n   marker-fill: #FF6600;\n   marker-allow-overlap: true;\n}';
var simpleLineCss    =     '#table {\n  line-color: #FFF;\n  line-width: 0.5;\n  line-opacity: 1;\n}';
var simplePolygonCss =  '#table {\n  polygon-fill: #FF6600;\n  polygon-opacity: 0.7;\n  line-color: #FFF;\n  line-width: 0.5;\n  line-opacity: 1;\n}';
var columnsToIgnore  = ['cartodb_id', 'the_geom', 'the_geom_webmercator'];
var numberTypes      = ['double precision', 'integer', 'number'];

var mapController = Ext.create('Ext.app.ViewController',{
    init: function() {
        this.lookup('basemapBox').setStore(new Ext.data.Store({
            data: CartoDb.CartoBasemaps.prototype.basemaps
        }));
    },
    initViewModel: function() {
        this.stores = [this.getStore('tables'), this.getStore('columns'), this.getStore('stats')];
        this.boxes  = [this.lookup('fieldBox'), this.lookup('sumBox'), this.lookup('avgBox'), this.lookup('minBox'), this.lookup('maxBox')];
    },
    reset: function(all) {
        if (all) {
            this.lookup('tableBox').clearValue();
            this.getStore('tables').removeAll();
        }
        for (var i in this.boxes) {
            this.boxes[i].clearValue();
        }
        this.lookup('filtersView').removeAll();
        this.filtersAdded = false;
        this.lookup('map').removeLayerAtIndex(0);
        this.lookup('cssOptions').setValue(simplePointCss);
        this.lookup('cssEditor').setValue(simplePointCss);
        this.getStore('columns').removeAll();
        this.getStore('stats').removeAll();
        this.getStore('stats').getProxy().setGroupBy(null);
    },
    setByStr: function(str, value) {
        for (var i = 0; i < this.stores.length; i++) {
            this.stores[i].getProxy()[str](value);
        }
    },
    onSelectUsername: function(field, e) {
        this.getStore('basemaps').setData(CartoDb.CartoBasemaps.prototype.basemaps);
        var value = field.getValue();
        if (value !== this.getViewModel().get('username')) {
            this.reset(true);
            this.setByStr('setUsername', value);
            this.getViewModel().set('username', value);
            this.getStore('tables').load();
        }
    },
    catchError: function(store, records, successful) {
        if (!successful) {
            Ext.Msg.alert('Error', 'There was a problem loading your tables. Please check your username.', Ext.emptyFn);
        }
    },
    onSelectTable: function(combo, record) {
        var value = record.get('table_name');
        this.reset(false);
        this.setByStr('setTable', value);
        this.getViewModel().set('table', value);
        this.lookup('map').addLayer({
            username: this.getViewModel().get('username'),
            subLayers: [{
                storeId: 'layer1',
                table: value
            }]
        });
        this.getStore('columns').load();
    },
    onSelectColumn: function(combo, record) {
        var value = record.get('column_name'),
            store = this.getStore('stats'),
            box = combo.getReference().replace(/Box/, '');
        store.getProxy().addGroupByField({
            property: value,
            name: box,
            aggregateType: box === 'field' ? null : box
        });
        store.load();
    },
    addFilters: function(store, records) {
        var filtersView = this.lookup('filtersView'),
            table = this.getViewModel().get('table'),
            username = this.getViewModel().get('username'),
            column;
        if (!this.filtersAdded) {
            for (var i = 0; i < records.length; i++) {
                column = records[i].get('column_name');
                if (columnsToIgnore.indexOf(column) === -1) {
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
            this.filtersAdded = true;
        }
    },
    onApplyCss: function() {
        Ext.getStore('layer1').getSubLayer().setCartoCSS(this.lookup('cssEditor').getValue());
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
    onFilterChange: function(field, newValue, oldValue) {
        var filter = field.getReference(),
            property = field.valueField,
            stores = [Ext.getStore('layer1'), this.getStore('stats')],
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

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: 'border',
            controller: mapController,
            viewModel: {
                stores: {
                    tables: {
                        storeId: 'tablesStore',
                        sorters: 'table_name',
                        proxy: {
                            type: 'carto',
                            mode: 'tables',
                            username: 'crestonedigital'
                        },
                        listeners: {
                            load: 'catchError'
                        }
                    },
                    columns: {
                        storeId: 'columnsStore',
                        proxy: {
                            type: 'carto',
                            username: 'crestonedigital',
                            mode: 'columns'
                        },
                        filters: [
                            function(data) {
                                return columnsToIgnore.indexOf(data.get('column_name')) === -1;
                            }
                        ],
                        listeners: {
                            load: 'addFilters'
                        }
                    },
                    numberColumns: {
                        source: '{columns}',
                        filters: [
                            function(data) {
                                return numberTypes.indexOf(data.get('column_type')) > -1;
                            }
                        ]
                    },
                    stats: {
                        type: 'CartoStore',
                        storeId: 'statsStore',
                        sorters: 'field',
                        listeners: {
                            beforeload: function(store, operation) {
                                return !!store.getProxy().getGroupBy();
                            }
                        },
                        proxy: {
                            type: 'carto',
                            username: 'crestonedigital',
                            reader: {
                                transform: function(data) {
                                    var cnt = Ext.Array.pluck(data.rows, 'cnt'),
                                        avg = jStat.mean(cnt),
                                        dev = jStat.stdev(cnt, true);

                                    return data.rows.map(function(row) {
                                        var sig = Math.floor(Math.abs((row.cnt - avg)/dev));
                                        row.sig = (isNaN(sig)) ? 0 : sig;
                                        return row;
                                    });
                                }
                            }
                        }
                    }
                },
                data: {
                    username: 'crestonedigital',
                    table: null
                }
            },
            items: [{
                xtype: 'panel',
                region: 'center',
                layout: 'fit',
                items: [{
                    xtype: "cartoMap",
                    center: 'us',
                    reference: 'map',
                    bind: {
                        basemap: '{basemapBox.selection}',
                        mapLock: '{mapLock.checked}',
                    },
                    storesToLock: ['statsStore'],
                }],
                tbar: [{
                    xtype: 'combobox',
                    reference: 'basemapBox',
                    width: 375,
                    fieldLabel: 'Basemap',
                    valueField: 'itemId',
                    displayField: 'name'
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
                            value: simplePointCss,
                            pressed: true
                        }, {
                            text: 'Line',
                            value: simpleLineCss
                        }, {
                            text: 'Polygon',
                            value: simplePolygonCss
                        }]
                    }, '->'],
                    items: [{
                        xtype: 'textareafield',
                        reference: 'cssEditor',
                        ui: 'carto-editor-cls',
                        bind: {
                            value: '{cssOptions.value}'
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
                    xtype: 'grid',
                    columns: [
                        {text: 'Column', dataIndex: 'field', align: 'end', flex: 1},
                        {text: 'Count', dataIndex: 'cnt', align: 'end', xtype: 'numbercolumn', format: '0,000', flex: 1},
                        {text: 'Sum', dataIndex: 'sum', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1},
                        {text: 'Average', dataIndex: 'avg', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1},
                        {text: 'Min', dataIndex: 'min', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1},
                        {text: 'Max', dataIndex: 'max', align: 'end', xtype: 'numbercolumn', format: '0,000.00', flex: 1}
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
                    bind: {
                        store: '{stats}'
                    },
                    tbar: ['->', {
                        xtype: 'checkbox',
                        reference: 'mapLock',
                        fieldLabel: 'Show statistics in map frame',
                        labelWidth: 170
                    }]
                }]
            }],
            tbar: {
                defaults: {
                    xtype: 'combobox',
                    valueField: 'column_name',
                    displayField: 'column_name',
                    labelWidth: 65,
                    editable: false,
                    listeners: {
                        select: 'onSelectColumn'
                    }
                },
                items: [{
                    xtype: 'textfield',
                    reference: 'usernameField',
                    fieldLabel: 'Username',
                    value: 'crestonedigital',
                    editable: true,
                    listeners: {
                        blur: 'onSelectUsername'
                    }
                }, {
                    reference: 'tableBox',
                    fieldLabel: 'Table',
                    valueField: 'table_name',
                    displayField: 'table_name',
                    listeners: {
                        select: 'onSelectTable'
                    },
                    bind: {
                        store: '{tables}'
                    }
                }, {
                    reference: 'fieldBox',
                    fieldLabel: 'Column',
                    bind: {
                        store: '{columns}',
                        disabled: '{!table}'
                    }
                }, {
                    reference: 'sumBox',
                    fieldLabel: 'Sum',
                    bind: {
                        store: '{numberColumns}',
                        disabled: '{!table}'
                    }
                }, {
                    reference: 'avgBox',
                    fieldLabel: 'Average',
                    bind: {
                        store: '{numberColumns}',
                        disabled: '{!table}'
                    }
                }, {
                    reference: 'minBox',
                    fieldLabel: 'Min',
                    bind: {
                        store: '{numberColumns}',
                        disabled: '{!table}'
                    }
                }, {
                    reference: 'maxBox',
                    fieldLabel: 'Max',
                    bind: {
                        store: '{numberColumns}',
                        disabled: '{!table}'
                    }
                }, '->', {
                    xtype: 'button',
                    text: 'About',
                    iconCls: 'x-fa fa-question',
                    handler: 'onAbout'
                }]
            }
        }]
    });
});