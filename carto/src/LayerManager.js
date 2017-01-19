Ext.define('Carto.LayerManager', {

    // requires: [
    //     'Carto.CartoLayerBase',
    //     'Carto.CartoLayerContainer',
    //     'Carto.CartoSubLayer',
    //     'Carto.CartoLayer'
    // ],

    singleton: true,

    lookupLayer: function(layer, defaultType) {
        if (!layer.isLayer) {
            if (!layer.type && layer.hasOwnProperty('subLayers')) {
                layer.type = 'layergroup';
            }
            layer = Ext.Factory.layer(layer);
        }
        return layer;
    },

    lookupSubLayer: function(subLayer, defaultType) {
        if (!subLayer.isSubLayer) {
            if (!subLayer.type && defaultType) {
                subLayer.type = defaultType;
            }
            subLayer = Ext.Factory.sublayer(subLayer, defaultType);
        }
        return subLayer;
    }
});