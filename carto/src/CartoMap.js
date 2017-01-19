/**
 * 
 */
Ext.define('Carto.CartoMap', {
    extend: 'Ext.Component',
    xtype: 'cartomap',

    requires: [
        'Carto.CartoProxy',
        'Carto.CartoStore'
        // 'Carto.CartoLayer'
    ],

    mixins: [
        'Carto.LeafletFunctionsMixin',
        'Carto.CountryCodesLatLongISO3166',
        // 'Carto.util.LayerCollection',
        'Carto.CartoBasemaps'
    ],

    isMap: true,

    config: {
        /**
         * @cfg {L.map} map
         * 
         * The leaflet map for this component.
         */
		cartoMap: null,

        /**
         * @cfg {Number} defaultMapZoom
         * 
         * The default zoom level of the `map`.
         */
        defaultMapZoom: 4,

        /**
         * @cfg {Boolean} scrollWheelZoom
         * 
         * `true` to allow the map to be scrolled by the mouse wheel.
         */
        scrollWheelZoom: true,

        /**
         * @cfg {String/Object/L.tileLayer} basemap
         * 
         * The basemap to be used for the `map`.
         */
        basemap: null,

        /**
         * @cfg {LatLngBounds} bounds
         * 
         * The bounds of the `map`.
         */
        bounds: null,

        zoom: 4,

        /**
         * @cfg {Number} minZoom
         * 
         * The minimum possible zoom level of the `map`.
         */
        minZoom: 3,

        /**
         * @cfg {Number} maxZoom
         * 
         * The maximum possible zoom level of the `map`.
         */
        maxZoom: 18,

        /**
         * @cfg {Boolean} mapLock
         * 
         * `true` for the map to update the filters in every store found in `storesToLock` when 
         * the `map` bounds change.
         */
        mapLock: false,

        /**
         * @cfg {Object[]} layers
         * 
         * Objects defining the layers of the `map`.
         */
        layers: null,

        /**
         * @cfg {Ext.data.Model} selection
         * 
         * The selected record of the `map`.
         */
        selection: null,

        /**
         * @cfg {String/String[]} selectedAction
         * 
         * The actions to take when a record is selected.
         */
        selectedAction: null,

        /**
         * @cfg {Ext.data.Store[]} stores
         * 
         * The stores associated with each subLayer of the `map`.
         */
        stores: null,

        /**
         * @cfg {String[]} storesToLock
         * 
         * An array of storeIds to be passed the `map`'s bounds when `mapLock` is true.
         * Note that each store's proxy must be of type `carto`.
         */
        storesToLock: null,

        maskWhileLoading: false,

        loadingMessage: 'Loading Tiles...'
	},
    
    renderConfig: {
        center: [40, -95]
    },

    publishes: [
        'bounds',
        'basemap',
        'center',
        'zoom',
        'selection'
    ],

    twoWayBindable: [
        'selection'
    ],

    applyBasemap: function(basemap, oldBasemap) {
        if (basemap) {
            if (typeof basemap === 'string') {
                basemap = this.mixins['Carto.CartoBasemaps'].getBasemapById(basemap);
            } else {
                basemap = basemap.isModel ? basemap.getData() : basemap;
            }
            if (basemap && basemap.url) {
                if (oldBasemap) {
                    this.getCartoMap().removeLayer(oldBasemap);
                }
                return L.tileLayer(basemap.url, {
                    attribution: basemap.attribution || null,
                    tms: basemap.tms || false
                });
            }
        }
    },

    updateBasemap: function(basemap) {
        if (this.getCartoMap()) {
            basemap.addTo(this.getCartoMap()).bringToBack();
        }
    },

    // applySelection: function(record) {
    //     if (record) {
    //         return record;
    //     }
    // },

    applySelectedAction: function(selectedAction) {
        if (typeof selectedAction === 'string') {
            selectedAction = [selectedAction];
        }
        return selectedAction;
    },

    applyLayers: function(layers, layerCollection) {
        if (!layerCollection) {
            layerCollection = Ext.create('Carto.util.LayerCollection', {
                owner: this
            });
        }
        layers = layerCollection.add(layers);
        if (layers) {
            if (!Ext.isArray(layers)) {
                layers = [layers];
            }
            for (var i = 0; i < layers.length; i++) {
                if (layers[i].isLayerGroup) {
                    layerCollection.add(layers[i].getSubLayers().getRange());
                }
            }
        }
        return layerCollection;
    },

    updateSelection: function(selection) {
        var selectedAction = this.getSelectedAction(),
            lat = selection.get('lat'),
            lng = selection.get('lng');
        if (lat && lng && selectedAction) {
            for(var i = 0; i < selectedAction.length; i++) {
                switch (selectedAction[i]) {
                    case 'panTo':
                    this.getCartoMap().panTo([lat, lng]);
                    break;
                    case 'placeMarker':
                    if(this._placedMarker) {
                        this.getCartoMap().removeLayer(this._placedMarker);
                    }
                    this._placedMarker = L.marker([lat,lng]).addTo(this.getCartoMap());
                    break;
                }
            }
        }
        if (this.hasListeners.select) {
            this.fireEvent('select', this, selection);
        }
    },

    // applyBounds: function(data) {
    //     return data;
    // },

    updateBounds: function(data) {
        this.fireEvent('mapBoundsUpdate');
    },

    // updateZoom: function(zoom) {
    //     var map = this.getCartoMap();
    //     if(map){
    //         map.setZoom(zoom);
    //     }
    // },

    setZoom: function(zoom) {
        this.callParent(arguments);
        var map = this.getCartoMap();
        if (map && !this._suppressNextZoom) {
            map.setZoom(zoom);
        }
        this._suppressNextZoom = false;
    },

    // getZoom: function() {
    //     return this.getCartoMap().getZoom();
    // },
    
    applyCenter: function (center) {
        if (typeof center === 'string' && center.length === 2) {
            return this.mixins['Carto.CountryCodesLatLongISO3166'].codes[center];
        } else if (Ext.isArray(center) && center.length === 2) {
            return center;
        }
    },

    updateCenter: function(center) {
        var map = this.getCartoMap();
        if(map){
            map.panTo(center);
        }
	},

    constructor: function(config) {
        this.zIndex = 0;
        this.callParent(arguments);
    },

    // beforeRender: function() {
    //     this.callParent(arguments);
    //     var layers = this.getLayers();
    //     if (layers) {
    //         layers.each(function(layer) {
    //             layer.beforeRender();
    //         });
    //     }
    // },

    // onRender: function() {
    //     this.callParent(arguments);
    //     var layers = this.getLayers();
    //     if (layers) {
    //         layers.each(function(layer) {
    //             layer.onRender(this);
    //         });
    //     }
    // },

	/**
	 * @param  {} t
	 * @param  {} eOpts
	 */
	afterRender: function(t, eOpts){
        var me = this,
            mapCenter = (typeof me.getCenter() === 'string') ? me.mixins['Carto.CountryCodesLatLongISO3166'].codes[me.getCenter()] : (Array.isArray(me.getCenter())) ? me.getCenter() : [0,0],
            map;
        
        me.setCartoMap(L.map(me.getId(), {
            scrollWheelZoom: me.getScrollWheelZoom(),
            center:          mapCenter,
            zoom:            me.getDefaultMapZoom(),
            minZoom:        me.getMinZoom(),
            maxZoom:        me.getMaxZoom()
        }));
        map = me.getCartoMap();
        if(!me.getBasemap()){
            me.setBasemap('positronLite');
        } else {
            me.getBasemap().addTo(me.getCartoMap()).bringToBack();
        }
        me.getCartoMap().addEventListener('move', me.passEventAlong, me);
        me.getCartoMap().addEventListener('moveend', me.passEventAlong, me);
        me.getCartoMap().addEventListener('moveend', me.publishMapBounds, me);
        // me.getCartoMap().addEventListener('zoomend', me.publishMapBounds, me);
        me.getCartoMap().addEventListener('click', function(e){
            me.fireEvent('mapClicked', me, me.getCartoMap(), e);
        }, me);
        me.getCartoMap().addEventListener('zoomend', function(e) {
            me._suppressNextZoom = true;
            me.setZoom(e.target.getZoom());
        });
        me.fireEvent('mapLoaded', me);
        // var initialLayers = me.getLayers();
        // if(initialLayers.length){
        //     initialLayers.forEach(function(item, index){
        //         initialLayers[index] = me.createLayer(item);
        //     });
        // }
        me.flushSchedule();
    },

    addLayer: function(layer) {
        this.setLayers(layer);
    },

    removeLayer: function(layer, destroy) {
        var layers = this.getLayers(),
            subLayers;
        layer = this.getLayer(layer);
        if (layer) {
            if (layer.isLayerContainer) {
                subLayers = layer.getSubLayers();
                if (subLayers) {
                    layers.remove(subLayers.getRange());
                }
            }
            layers.remove(layer);
            layer.remove(destroy);
        }
    },

	/**
	 * @param  {} w
	 * @param  {} h
	 * @param  {} oW
	 * @param  {} oH
	 */
	onResize: function(w, h, oW, oH){
		this.getCartoMap().invalidateSize();
	},

    passEventAlong: function(event) {
        var e = event.type;
        if (this.hasListener(e)) {
            this.fireEvent(e, this, event.target);
        }
    },
    
    /**
     * Publishes the map's bounds to the viewModel, and updates the stores that are locked to the map.
     * @param  {Event} event
     */
    publishMapBounds: function(event){
        this.setBounds((event) ? event.target.getBounds() : this.getCartoMap().getBounds());
        var center = (event) ? event.target.getCenter() : this.getCartoMap().getCenter();
        this.setCenter([center.lat, center.lng]);
        if(this.getMapLock()) {
            this.updateStoresByBounds();
        }
    },

    /**
     * Adds the map's bounds into each store that is locked to the map.
     * 
     * Note that only stores with a `carto` proxy can lock to a CartoMap.
     */
    updateStoresByBounds: function() {
        if(this.getStoresToLock()) {
            var store;
            for(var i = 0; i < this.getStoresToLock().length; i++) {
                if(store = Ext.getStore(this.getStoresToLock()[i])) {
                    Ext.apply(store.getProxy().getWhere(), {
                        bounds: {
                            type: 'bounds',
                            bounds: this.getBounds()
                        }
                    });
                    store.load();
                }
            }
        }
    },
    
    /**
     * Removes the map's bounds from each store that is locked to the map.
     */
    resetStores: function() {
        if(this.getStoresToLock()) {
            var store;
            for(var i = 0; i < this.getStoresToLock().length; i++) {
                if(store = Ext.getStore(this.getStoresToLock()[i])) {
                    Ext.apply(store.getProxy().getWhere(), {
                        bounds: {
                            type: 'bounds',
                            bounds: null
                        }
                    });
                    store.load();
                }
            }
        }
    },

    updateMapLock: function(mapLock) {
        if(mapLock) {
            this.updateStoresByBounds();
        } else {
            this.resetStores();
        }
    },

    /**
     * Adds a layer to the map.
     * @param  {object} data
     * @param  {function} callback
     */
    // addLayer: function(data, callback) {
    //     this.setStores(this.createDataStores(data));
    //     this.createLayer(data, function(err, layer){
    //         if(err) {
    //             console.log('Error: ' + err);
    //         }else{
    //             return callback ? callback(null, layer) : null;
    //         }
    //     });
    // },

    // addSubLayer: function(subLayer) {
    //     this.setSubLayers(subLayer);
    //     // this.getSubLayerMap()[subLayer.subLayerId] = subLayer;
    // },

    // getSubLayer: function(subLayerId) {
    //     var subLayers = this.getSubLayers();
    //     return subLayers ? subLayers.get(subLayerId) : null;
    // },

    getLayer: function(layer) {
        if (layer && layer.isLayer) {
            return layer;
        } else if (typeof layer === 'string') {
            return this.getLayers().get(layer);
        } else {
            return null;
        }
    },

    /**
     * Removes a subLayer from the map based on the subLayer's id.
     * @param  {} subLayerId
     */
    // removeSubLayer: function(subLayer, destroy) {
    //     var subLayers = this.getSubLayers();
        
    //     if (subLayers) {
    //         if (typeof subLayer === 'string') {
    //             subLayer = subLayers.removeByKey(subLayer);
    //         } else {
    //             subLayers.remove(subLayer);
    //         }
    //     }
    //     if (subLayer && subLayer.isSubLayer) {
    //         subLayer.remove();
    //         if (destroy) {
    //             subLayer.destroy();
    //         }
    //     }
    //     return subLayer;
    // },

    validateOrder: function() {
        var layers = this.getLayers(),
            valid = true,
            zIndex, diff;
        if (layers && layers.length > 1) {
            layers.each(function(layer, idx) {
                zIndex = layer.getMapZIndex();
                if (zIndex !== idx) {
                    valid = false;
                }
            });
        }
        if (!valid) {
            this.orderLayers();
        }
        return valid;
    },

    orderLayers: function() {
        // TODO: Figure out why cartodb.js is broken
        // var layers = this.getLayers();
        // layers.forEach(function(layer, idx) {
        //     debugger
        //     layer.getCartoLayer().setZIndex(idx);
        //     layer.setMapZIndex(idx);
        // });
    },

    /**
     * Removes a layer from the map based on the layer's index.
     * @param  {integer} index
     * @param  {function} callback
     */
    // removeLayerAtIndex: function(index, callback) {
    //     var layer = this.getLayers()[index];
    //     if (layer) {
    //         this.getCartoMap().removeLayer(layer);
    //         this.getLayers().splice(index,1);
    //     }
    // },

    /**
     * Creates the map layers based on the initial config.
     * @param  {object} data
     * @param  {function} cb
     */
    createCartoLayer: function(layer) {
        var me = this,
            map = this.getCartoMap();
        
        if (map) {
            cartodb.createLayer(map, layer.buildCartoLayer(), me.cartoOptions || {})
            .addTo(map)
            .done(function(cartoLayer) {
                layer = me.getLayer(cartoLayer.model.attributes.ext_id);
                layer.setMapZIndex(me.zIndex++);
                layer.setCartoLayer(cartoLayer);
                cartoLayer.on('loading', function() {
                    me.loading = true;
                    if (me.getMaskWhileLoading()) {
                        me.mask(me.getLoadingMessage());
                    }
                    layer.fireEvent('beforeload', layer, me);
                });
                cartoLayer.on('load', function() {
                    delete me.loading;
                    if (me.getMaskWhileLoading()) {
                        me.unmask();
                    }
                    layer.fireEvent('load', layer, me);
                });
                me.fireEvent('layercreated', me, layer);
                if (me.zIndex === me.getLayers().length) {
                    me.validateOrder();
                }
            })
            .error(function(error) {
                console.error(error);
            });
        } else {
            me.schedule(layer);
        }
    },

    schedule: function(layer) {
        if (this._needsRendering) {
            this._needsRendering.push(layer);
        } else {
            this._needsRendering = [layer];
        }
    },

    flushSchedule: function() {
        var toRend = this._needsRendering,
            i, len;
        if (toRend && toRend.length) {
            for (i = 0, len = toRend.length; i < len; i++) {
                this.createCartoLayer(toRend.splice(0,1)[0]);
            }
        }
    },

    doDestroy: function() {
        delete this._needsRendering;

        var layers = this.getLayers();
        if (layers) {
            layers.each(function(layer) {
                layer.destroy();
            });
        }
    }

});