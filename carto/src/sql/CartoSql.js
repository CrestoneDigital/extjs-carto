Ext.define('CartoDb.sql.CartoSql', {
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