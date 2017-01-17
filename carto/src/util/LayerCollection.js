Ext.define('Carto.util.LayerCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.CartoLayer'
    ],

    isLayerCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeLayer);
    },

    decodeLayer: function(layer) {
        var owner = this.getOwner();
        if (!layer.isLayer) {
            if (owner && owner.isMap) {
                layer.map = owner;
            }
            layer = Ext.create('Carto.CartoLayer', layer);
        } else if (owner && owner.isMap) {
            layer.setMap(owner);
        }
        return layer;
    },

    getOwner: function() {
        return this.owner;
    }
});