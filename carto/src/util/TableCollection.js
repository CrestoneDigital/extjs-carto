<<<<<<< HEAD
Ext.define('Carto.util.TableCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.sql.CartoTable'
=======
Ext.define('CartoDb.util.TableCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'CartoDb.sql.CartoTable'
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
    ],

    isTableCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeTable);
    },

    decodeTable: function(table) {
        if (!table.isCartoTable) {
<<<<<<< HEAD
            table = new Carto.sql.CartoTable(table);
=======
            table = new CartoDb.sql.CartoTable(table);
>>>>>>> a9c1ae3784a060adeb2dde7ac8146ea0d7c88ef2
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