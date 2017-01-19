Ext.define('Carto.layer.LayerGroup', {
    extend: 'Carto.layer.LayerBase',
    alias: 'layer.layergroup',

    requires: [
        'Carto.util.SubLayerCollection'
    ],

    isLayerGroup: true,

    config: {
        subLayers: null
    },

    createCartoSubLayer: function(subLayer) {
        if (this.isCreating) {
            return;
        }
        this.isCreating = true;
        if (this.getCartoLayer()) {
            this.getCartoLayer().addLayer(subLayer.buildCartoLayer());
        } else if (this.allSubLayersReady()) {
            this.getMap().createCartoLayer(this);
        }
        delete this.isCreating;
    },

    allSubLayersReady: function() {
        var subLayers = this.getSubLayers(),
            allReady = true;
        if (subLayers) {
            subLayers.each(function(subLayer) {
                if (!subLayer.isReadyToBuild()) {
                    allReady = false;
                    return false;
                }
            });
        } else {
            allReady = false;
        }
        return allReady;
    },

    buildCartoLayer: function() {
        var subLayerArr = [],
            subLayers = this.getSubLayers(),
            ret = {
                ext_id: this.getId(),
                user_name: this.getUsername(),
                tiler_domain: this.useCartoDb ? 'cartodb.com' : 'carto.com',
                type: this.getType(),
                sublayers: subLayerArr
            };
        if (subLayers) {
            subLayers.each(function(subLayer) {
                subLayerArr.push(subLayer.buildCartoSubLayer());
            });
        }
        return ret;
    },

    updateMap: function(map, oldMap) {
        var subLayers = this.getSubLayers();
        if (subLayers && map) {
            map.addSubLayer(subLayers.getRange());
        }
    },

    updateCartoLayer: function(cartoLayer) {
        this.callParent(arguments);
        var subLayers = this.getSubLayers();
        if (subLayers) {
            subLayers.each(function(subLayer, index) {
                subLayer.setCartoLayer(cartoLayer.getSubLayer(index));
            });
        }
    },

    applySubLayers: function(subLayers, subLayerCollection) {
        var map = this.getMap();
        if (!subLayerCollection) {
            subLayerCollection = Ext.create('Carto.util.SubLayerCollection', {
                owner: this
            });
        }
        subLayers = subLayerCollection.add(subLayers);
        if (subLayers && map) {
            map.addLayer(subLayers);
        }
        return subLayerCollection;
    },

    doDestroy: function() {
        var subLayers = this.getSubLayers();
        if (subLayers) {
            subLayers.each(function(subLayer) {
                subLayer.destroy();
            });
        }
    }
});