Ext.define('Carto.util.TableCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.sql.CartoTable'
    ],

    isTableCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeTable);
    },

    decodeTable: function(table) {
        if (!table.isCartoTable) {
            table = new Carto.sql.CartoTable(table);
        }
        return table;
    },

    getSql: function() {
        var sql = '';
        this.items.forEach(function(item) {
            sql += item.getSql() + ',';
        });
        return sql.slice(0,-1);
    }
});