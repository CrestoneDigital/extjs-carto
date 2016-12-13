Ext.define('CartoDb.sql.CartoFrom', {
    extend: 'CartoDb.sql.CartoSql',

    requires: [
        'CartoDb.util.TableCollection'
    ],

    isCartoFrom: true,

    config: {
        tables: null
    },

    decode: function(config) {
        if (!config.tables) {
            config = {tables: config};
        }
        if (!Ext.isArray(config.tables)) {
            config.tables = [config.tables];
        }
        return config;
    },

    isMulti: function() {
        return this.getTables().length > 1;
    },

    applyTables: function(tables, tableCollection) {
        if (!tableCollection) {
            tableCollection = Ext.create('CartoDb.util.TableCollection');
        }
        tableCollection.add(tables);
        return tableCollection;
    },

    createSql: function(sql) {
        this.setSql(this.getTables().getSql());
    }
});