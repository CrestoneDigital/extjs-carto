Ext.define('Carto.sublayer.CartoDb', {
    extend: 'Carto.sublayer.SubLayerBase',
    alias: 'sublayer.cartodb',

    buildCartoSubLayer: function() {
        return {
            type: this.getType(),
            sql: this.getSql(),
            cartocss: this.getCss()
        };
    },

    updateCartoLayer: function(cartoLayer) {
        this.callParent(arguments);
        this.mixins.dataContainingLayer.updateCartoLayer.call(this, cartoLayer);
    }
});