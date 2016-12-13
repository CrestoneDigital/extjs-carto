Ext.define('CartoDb.sql.CartoSql', {
    isCartoSql: true,

    config: {
        sql: ''
    },

    constructor: function(config) {
        this.initConfig(config);
        this.initSql(this.getSql());
        return this;
    },

    initConfig: function(config) {
        config = this.decode(config);
        return this.callParent([config]);
    },

    initSql: function() {
        this.initSql = Ext.emptyFn;
    },

    decode: function(config) {
        return config;
    }
});