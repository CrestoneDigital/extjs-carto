Ext.define('Carto.layer.Torque', {
    extend: 'Carto.layer.LayerBase',
    alias: 'layer.torque',

    mixins: [
        'Carto.mixin.DataContainingLayer'
    ],

    defaultBindProperty: 'store',

    twoWayBindable: [
        'selection'
    ],

    create: function() {
        this.getMap().createCartoLayer(this);
    },

    buildCartoLayer: function() {
        return {
            type: this.getType(),
            user_name: this.getUsername(),
            options: {
                ext_id: this.getId(),
                query: this.getSql(),
                cartocss: this.getCss(),
                table_name: this.getTable()
            }
        };
    },

    updateCartoLayer: function(cartoLayer) {
        this.callParent(arguments);
        this.mixins.dataContainingLayer.updateCartoLayer.call(this, cartoLayer);
    }
});