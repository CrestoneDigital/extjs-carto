Ext.define('CartoDb.sql.CartoTable', {
    extend: 'CartoDb.sql.CartoSql',

    isCartoTable: true,

    config: {
        name: '',
        alias: ''
    },

    decode: function(config) {
        if (typeof config === 'string') {
            config = {name: config};
        }
        return config;
    },

    initSql: function(sql) {
        if (!sql) {
            var name = this.getName(),
                alias = this.getAlias();
            this.setSql(name + (alias ? ' AS ' + alias : ''));
        }
    },

    getIdentifier: function() {
        return this.getAlias() || this.getName();
    }
});