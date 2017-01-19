Ext.define('Carto.util.SubLayerCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.LayerManager',
        'Carto.sublayer.CartoDb'
    ],

    isSubLayerCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeSubLayer);
    },

    decodeSubLayer: function(subLayer) {
        var owner = this.getOwner();
        if (!subLayer.isSubLayer && owner && owner.isLayer) {
            subLayer.layer = owner;
        }
        return Carto.LayerManager.lookupSubLayer(subLayer, 'cartodb');
    },

    getOwner: function() {
        return this.owner;
    }
});