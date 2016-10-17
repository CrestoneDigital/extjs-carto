Ext.Loader.setConfig({enabled: true, disableCaching: true});
Ext.Loader.setPath('CartoDb', '../../src');

Ext.require([
    'CartoDb.CartoMap',
    'CartoDb.CartoStore',
    'CartoDb.CartoProxy',
    'CartoDb.CartoBasemaps',
    'Ext.data.Store'
]);

var columnsToIgnore  = ['cartodb_id', 'the_geom', 'the_geom_webmercator'];
var numberTypes      = ['double precision', 'integer', 'number'];

var mapController = Ext.create('Ext.app.ViewController',{
    reset: function(all) {
        if (all) {
            this.lookup('tableBox').clearValue();
            this.getStore('tables').removeAll();
        }
        this.lookup('fieldBox').clearValue();
        this.lookup('numberFieldBox').clearValue();
        this.getStore('columns').removeAll();
    },
    onSelectUsername: function(field, e) {
        var value = field.getValue();
        if (value !== this.getViewModel().get('username')) {
            this.reset(true);
            this.getViewModel().set('username', value);
            this.getStore('tables').getProxy().setUsername(value);
            this.getStore('columns').getProxy().setUsername(value);
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
        this.getViewModel().set('table', value);
        this.getStore('columns').getProxy().setTable(value);
        this.getStore('columns').load();
    }
});

Ext.onReady(function () {
    Ext.QuickTips.init();

    Ext.create('Ext.container.Viewport', {
        layout: 'fit',
        items: [{
            xtype: 'panel',
            layout: {
                type: 'vbox',
                align: 'center',
                pack: 'center'
            },
            controller: mapController,
            viewModel: {
                stores: {
                    tables: {
                        storeId: 'tablesStore',
                        sorters: 'table_name',
                        proxy: {
                            type: 'carto',
                            mode: 'tables'
                        },
                        listeners: {
                            load: 'catchError'
                        }
                    },
                    columns: {
                        storeId: 'columnsStore',
                        sorters: 'column_name',
                        proxy: {
                            type: 'carto',
                            mode: 'columns'
                        },
                        filters: [
                            function(data) {
                                return columnsToIgnore.indexOf(data.get('column_name')) === -1;
                            }
                        ]
                    },
                    numberColumns: {
                        source: '{columns}',
                        filters: [
                            function(data) {
                                return numberTypes.indexOf(data.get('column_type')) > -1;
                            }
                        ]
                    }
                },
                data: {
                    username: null,
                    table: null
                }
            },
            defaults: {
                xtype: 'combobox',
                valueField: 'column_name',
                displayField: 'column_name',
                labelWidth: 200,
                editable: false
            },
            items: [{
                xtype: 'textfield',
                reference: 'usernameField',
                fieldLabel: 'Username',
                editable: true,
                listeners: {
                    blur: 'onSelectUsername'
                }
            }, {
                reference: 'tableBox',
                valueField: 'table_name',
                displayField: 'table_name',
                listeners: {
                    select: 'onSelectTable'
                },
                bind: {
                    fieldLabel: '{username}\'s tables',
                    store: '{tables}'
                }
            }, {
                reference: 'fieldBox',
                bind: {
                    fieldLabel: '{table}\'s fields',
                    store: '{columns}',
                    disabled: '{!table}'
                }
            }, {
                reference: 'numberFieldBox',
                bind: {
                    fieldLabel: '{table}\'s number fields',
                    store: '{numberColumns}',
                    disabled: '{!table}'
                }
            }]
        }]
    });
});