Ext.define('CartoDb.CartoLayer', {
    extend: 'Ext.Component',
    xtype: 'cartoLayer',
    requires: [
        'CartoDb.CartoSubLayer'
    ],
    config: {
        map: null,
        cartoLayer: null,
        username: '',
        subLayers: []
    },

    createSubLayer: function(subLayer) {
        if (this.getCartoLayer()) {
            this.getCartoLayer().addLayer(subLayer.buildCartoSubLayer());
        } else {
            this.getMap().createLayer(this);
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
        var subLayers = this.getSubLayers();
        for (var i = 0; i < subLayers.length; i++) {
            subLayers[i].setCartoSubLayer(cartoLayer.getSubLayer(i));
        }
    },

    initConfig: function(layer) {
        var me = this;
        me.callParent(arguments);
        if (layer.subLayers && layer.subLayers.length) {
            layer.subLayers.forEach(function(subLayer, index) {
                subLayer.layer = me;
                layer.subLayers[index] = Ext.create('CartoDb.CartoSubLayer', subLayer);//Ext.ComponentManager.create(subLayer, 'cartoSubLayer');
                me.getMap().addSubLayer(layer.subLayers[index]);
            });
        }
        me.setSubLayers(layer.subLayers || []);
    }
});