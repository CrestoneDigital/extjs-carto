Ext.define('CartoDb.CartoLayer', {
    extend: 'Ext.Component',
    xtype: 'cartolayer',
    requires: [
        'CartoDb.CartoSubLayer'
    ],
    config: {
        map: null,
        cartoLayer: null,
        hidden: false,
        username: '',
        subLayers: [],
        mapZIndex: null
    },

    isLayer: true,

    createSubLayer: function(subLayer) {
        subLayer.publishedToLayer = true;
        if (this.getCartoLayer()) {
            this.getCartoLayer().addLayer(subLayer.buildCartoSubLayer());
        } else if (this.allSubLayersReady()) {
            this.getMap().createCartoLayer(this);
        }
    },

    allSubLayersReady: function() {
        var subLayers = this.getSubLayers(),
            subLayer;
        for (subLayer in subLayers) {
            if (!subLayers[subLayer].publishedToLayer) {
                return false;
            }
        }
        return true;
    },

    buildCartoLayer: function() {
        var subLayers = [];
        this.getSubLayers().forEach(function(subLayer) {
            subLayers.push(subLayer.buildCartoSubLayer());
        });
        return {
            id: this.getId(),
            user_name: this.getUsername(),
            tiler_domain: this.useCartoDb ? 'cartodb.com' : 'carto.com',
            type: 'cartodb',
            sublayers: subLayers
        };
    },

    updateCartoLayer: function(cartoLayer) {
        if (this.getHidden()) {
            cartoLayer.hide();
        }
        var subLayers = this.getSubLayers();
        for (var i = 0; i < subLayers.length; i++) {
            subLayers[i].setCartoSubLayer(cartoLayer.getSubLayer(i));
        }
    },

    // constructor: function(cfg) {
    //     console.log(cfg.subLayers);
    //     this.callParent(arguments);
    // },

    initConfig: function(layer) {
        var me = this.callParent(arguments);
        me.setId(me.layerId || me.id);
        if (layer.subLayers && layer.subLayers.length) {
            layer.subLayers.forEach(function(subLayer, index) {
                subLayer.layer = me;
                subLayer = Ext.create('CartoDb.CartoSubLayer', subLayer);
                layer.subLayers[index] = subLayer;
                me.getMap().addSubLayer(subLayer);
                // subLayer.layer = me;
                // layer.subLayers[index] = Ext.create('CartoDb.CartoSubLayer', subLayer);
                // me.getMap().addSubLayer(layer.subLayers[index]);
            });
        }
        me.setSubLayers(layer.subLayers || []);
        return me;
    },

    lookupViewModel: function() {
        return this.getMap().lookupViewModel();
    },

    lookupController: function() {
        return this.getMap().lookupController();
    },

    getRefOwner: function() {
        return this.getMap();
    }
});