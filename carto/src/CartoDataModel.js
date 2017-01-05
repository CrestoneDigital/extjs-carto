Ext.define('Carto.CartoDataModel', {
    extend: 'Ext.data.Model',
    idProperty: 'cartodb_id',
    fields: [
        'site_name', 'company', 'state', 'total_oper', 'cartodb_id'
        //   'corporatio', 'created_at',
        //   'dataperiod', 'source', 'the_geom',  'the_geom_webmercator',  'updated_at'
    ]
});