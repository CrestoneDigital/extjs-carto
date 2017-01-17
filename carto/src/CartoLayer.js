Ext.define('Carto.CartoLayer', {
    // extend: 'Ext.Component',
    xtype: 'cartolayer',
    requires: [
        // 'Carto.util.SubLayerCollection',
        'Carto.CartoSubLayer'
    ],

    mixins: [
        'Ext.mixin.Inheritable',
        'Ext.mixin.Observable',
        'Ext.mixin.Bindable'
    ],
    config: {
        map: null,
        cartoLayer: null,
        hidden: false,
        username: '',
        subLayers: null,
        mapZIndex: null,
        type: 'cartodb'
    },

    isLayer: true,

    constructor: function(config) {
        config = config || {};

        if (config.initialConfig) {
            config = config.initialConfig;
        }

        this.initialConfig = config;

        if (config.layerId) {
            this.setId(config.layerId);
        }

        this.getId();
        this.initConfig(config);
        if (this.lookupViewModel()) {
            this.initBindable();
        }
        var map = this.getMap();
        if (map && map.rendered) {
            this.onRender(map);
        }
        delete this.layerId;
        return this;
    },

    beforeInitConfig: function() {
        this.mixins.observable.constructor.call(this);
    },

    createCartoSubLayer: function(subLayer) {
        subLayer.publishedToLayer = true;
        if (this.getCartoLayer()) {
            this.getCartoLayer().addLayer(subLayer.buildCartoSubLayer());
        } else if (this.allSubLayersReady()) {
            this.getMap().createCartoLayer(this);
        }
    },

    allSubLayersReady: function() {
        var subLayers = this.getSubLayers(),
            allReady = true;
        if (subLayers) {
            subLayers.each(function(subLayer) {
                if (!subLayer.publishedToLayer) {
                    allReady = false;
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
                type: this.getType()
                // sublayers: subLayerArr
            },
            torqueLayer;
        if (subLayers) {
            subLayers.each(function(subLayer) {
                if (subLayer.getType() === 'torque') {
                    torqueLayer = subLayer.buildCartoSubLayer();
                } else {
                    subLayerArr.push(subLayer.buildCartoSubLayer());
                }
            });
        }
        if (torqueLayer) {
            delete ret.type;
            Ext.apply(torqueLayer.options, ret);
            return torqueLayer;
        } else {
            ret.sublayers = subLayerArr;
            return ret;
        }
    },

    updateMap: function(map, oldMap) {
        // this.onInheritedAdd();
        var subLayers = this.getSubLayers();
        if (subLayers && map) {
            map.addSubLayer(subLayers.getRange());
        }
    },

    updateCartoLayer: function(cartoLayer) {
        if (this.getHidden()) {
            cartoLayer.hide();
        }
        var subLayers = this.getSubLayers();
        if (subLayers) {
            subLayers.each(function(subLayer, index) {
                subLayer.setCartoSubLayer(cartoLayer.getSubLayer(index));
            });
        }
    },

    remove: function(destroy) {
        var cartoLayer = this.getCartoLayer();
        if (cartoLayer) {
            cartoLayer.remove();
        }
        if (destroy) {
            this.destroy();
        }
    },

    initInheritedState: function(inheritedState) {
        this.mixins.bindable.initInheritedState.call(this, inheritedState);
    },

    applySubLayers: function(subLayers, subLayerCollection) {
        var map = this.getMap();
        if (!subLayerCollection) {
            subLayerCollection = Ext.create('Carto.util.SubLayerCollection', {
                owner: this
            });
        }
        subLayers = subLayerCollection.add(subLayers);
        if (subLayers) {
            if (!Ext.isArray(subLayers)) {
                subLayers = [subLayers];
            }
            subLayers.forEach(function(subLayer) {
                subLayer.setLayer(this);
                if (map) {
                    map.addSubLayer(subLayer);
                }
            }.bind(this));
        }
        return subLayerCollection;
    },

    beforeRender: function() {
        this.initBindable();
        var subLayers = this.getSubLayers();
        if (subLayers) {
            subLayers.each(function(subLayer) {
                subLayer.beforeRender(this);
            });
        }
    },

    onRender: function(map) {
        this.rendered = true;
        var subLayers = this.getSubLayers();
        if (subLayers) {
            subLayers.each(function(subLayer) {
                subLayer.onRender(this);
            });
        }
    },

    destroy: function() {
        if (!this.hasListeners.beforedestroy || this.fireEvent('beforedestroy', this) !== false) {
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = true;
            
            var subLayers = this.getSubLayers();
            if (subLayers) {
                subLayers.each(function(subLayer) {
                    subLayer.destroy();
                });
            }

            this.removeBindings();
    
            this.destroyBindable();
 
            // We need to defer clearing listeners until after doDestroy() completes, 
            // to let the interested parties fire events until the very end. 
            this.clearListeners();
 
            // isDestroying added for compat reasons 
            this.isDestroying = this.destroying = false;
 
            this.callParent(); // Ext.Base 
        }
    },

    getRefOwner: function() {
        return this.getMap();
    }
});