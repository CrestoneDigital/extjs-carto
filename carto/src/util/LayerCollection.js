Ext.define('Carto.util.LayerCollection', {
    extend: 'Ext.util.Collection',

    requires: [
        'Carto.LayerManager',
        'Carto.layer.LayerGroup',
        'Carto.layer.Torque'
    ],

    isLayerCollection: true,

    constructor: function(config) {
        this.callParent([config]);
        this.setDecoder(this.decodeLayer);
    },

    decodeLayer: function(layer) {
        var owner = this.getOwner();
        if (!layer.isLayer && owner && owner.isMap) {
            layer.map = owner;
        }
        return Carto.LayerManager.lookupLayer(layer);
    },

    getOwner: function() {
        return this.owner;
    }
});