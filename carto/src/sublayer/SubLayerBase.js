Ext.define('Carto.sublayer.SubLayerBase', {
    extend: 'Carto.AbstractLayer',

    mixins: [
        'Carto.mixin.DataContainingLayer',
        'Ext.mixin.Factoryable'
    ],

    isSubLayer: true,

    defaultBindProperty: 'store',

    twoWayBindable: [
        'selection'
    ],

    factoryConfig: {
        defaultType: 'cartodb',
        type: 'sublayer'
    },

    config: {
        layer: null
    },

    create: function() {
        this.getLayer().createCartoSubLayer(this);
    },

    updateUsername: function(username, oldUsername) {
        var layer = this.getLayer();
        if (username && layer) {
            layer.setUsername(username);
        }
    },

    updateLayer: function(layer, oldLayer) {
        if (layer) {
            var username = this.getUsername();
            if (username) {
                layer.setUsername(username);
            }
        }
    },

    getRefOwner: function() {
        return this.getLayer();
    },

    getMap: function() {
        return this.getLayer().getMap();
    }
});