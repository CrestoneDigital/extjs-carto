Ext.define('CartoDb.CartoSubLayer', {
    extend: 'Ext.Component',
    xtype: 'cartoSubLayer',
    config: {
        sql: undefined,
        css: undefined,
        store: undefined
    },
    twoWayBindable: [
        'store'
    ]
});