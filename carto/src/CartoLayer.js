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
        subLayers: []
    },

    isLayer: true,

    createSubLayer: function(subLayer) {
        if (this.getCartoLayer()) {
            this.getCartoLayer().addLayer(subLayer.buildCartoSubLayer());
        } else {
            this.getMap().createCartoLayer(this);
        }
    },

    updateUsername: function(newUsername, oldUsername) {
        if (oldUsername && oldUsername !== newUsername) {
            this.getCartoLayer().remove();
            this.getMap().createCartoLayer(this);
        }
    },

    buildCartoLayer: function() {
        var subLayers = [];
        this.getSubLayers().forEach(function(subLayer) {
            subLayers.push(subLayer.buildCartoSubLayer());
        });
        return {
            id: this.getId(),
            user_name: this.getUsername(),
            type: 'cartodb',
            sublayers: subLayers
        };
    },

    setCartoLayer: function(cartoLayer) {
        this.callParent(arguments);
        if (this.getHidden()) {
            cartoLayer.hide();
        }
        var subLayers = this.getSubLayers();
        for (var i = 0; i < subLayers.length; i++) {
            subLayers[i].setCartoSubLayer(cartoLayer.getSubLayer(i));
        }
    },

    initConfig: function(layer) {
        var me = this.callParent(arguments);
        me.setId(me.layerId || me.id);
        if (layer.subLayers && layer.subLayers.length) {
            layer.subLayers.forEach(function(subLayer, index) {
                subLayer.layer = me;
                layer.subLayers[index] = Ext.create('CartoDb.CartoSubLayer', subLayer);
                me.getMap().addSubLayer(layer.subLayers[index]);
            });
        }
        me.setSubLayers(layer.subLayers || []);
        return me;
    }
});