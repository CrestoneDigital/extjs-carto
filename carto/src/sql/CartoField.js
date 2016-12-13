Ext.define('CartoDb.sql.CartoField', {
    extend: 'CartoDb.sql.CartoSql',

    isCartoField: true,

    // In honor of the original intent for these fields, keep it light

    property: null,
    sql: '',

    constructor: function(config) {
        this.callParent([config]);
        if (!this.sql) {
            this.createSql();
        }
    },

    createSql: function() {
        var name = this.getName(),
            property = this.getProperty();
        this.sql = property ? property + ' AS ' + name : name;
    },

    parseSql: function(sql) {
        var parseSql = this.stripEnds(sql).split(/\s/),
            len = parseSql.length;
        if (len > 1) {
            this.setAlias(parseSql[len-1]);
        } else {
            this.setName(parseSql[0]);
        }
    },

    getProperty: function() {
        return this.property;
    },

    getId: function() {
        return this.getAlias() || this.getName();
    },

    singleRegex: /^\w+$/,

    stripEnds: function(str) {
        return str.replace(/^\s+/, '').replace(/\s+$/, '');
    }
});