Ext.define('Carto.util.SubLayerCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.CartoSubLayer'
    ],

    isSubLayerCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeSubLayer);
    },

    decodeSubLayer: function(subLayer) {
        var owner = this.getOwner();
        if (!subLayer.isSubLayer) {
            if (owner && owner.isLayer) {
                subLayer.layer = owner;
            }
            subLayer = Ext.create('Carto.CartoSubLayer', subLayer);
        } else if (owner && owner.isLayer) {
            subLayer.setLayer(owner);
        }
        return subLayer;
    },

    getOwner: function() {
        return this.owner;
    }
});