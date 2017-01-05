<<<<<<< HEAD
Ext.define('Carto.sql.CartoFrom', {
    extend: 'Carto.sql.CartoSql',

    requires: [
        'Carto.util.TableCollection'
=======
Ext.define('CartoDb.sql.CartoFrom', {
    extend: 'CartoDb.sql.CartoSql',

    requires: [
        'CartoDb.util.TableCollection'
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
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
<<<<<<< HEAD
            tableCollection = Ext.create('Carto.util.TableCollection');
=======
            tableCollection = Ext.create('CartoDb.util.TableCollection');
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
        }
        tableCollection.add(tables);
        return tableCollection;
    },

    createSql: function(sql) {
        this.setSql(this.getTables().getSql());
    }
});