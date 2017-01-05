<<<<<<< HEAD
Ext.define('Carto.sql.CartoSql', {
=======
Ext.define('CartoDb.sql.CartoSql', {
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
    isCartoSql: true,

    config: {
        sql: '',
        hardcoded: false
    },

    constructor: function(config) {
        this.initConfig(config);
        var sql = this.getSql();
        if (sql) {
            this.setHardcoded(true);
            this.parseSql(sql);
        } else {
            this.createSql();
        }
        return this;
    },

    initConfig: function(config) {
        config = this.decode(config);
        return this.callParent([config]);
    },

    parseSql: Ext.emptyFn,
    createSql: Ext.emptyFn,

    decode: function(config) {
        return config;
    },

    stripEnds: function(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    }
});