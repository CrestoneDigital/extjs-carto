/**
 * 
 */
Ext.define('CartoDb.CartoMap', {
    extend: 'Ext.Component',
    xtype: 'cartomap',
    mixins: [
        'CartoDb.LeafletFunctionsMixin',
        'CartoDb.CartoProxy',
        'CartoDb.CountryCodesLatLongISO3166',
        'CartoDb.CartoStore',
        'CartoDb.CartoLayer',
        'CartoDb.CartoBasemaps'
    ],
    config: {
        /**
         * @cfg {L.map} map
         * 
         * The leaflet map for this component.
         */
		map: null,

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
        layers: [],

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
        storesToLock: null
	},
    
    renderConfig: {
        center: [40, -95]
    },

    publishes: [
        'bounds',
        'basemap',
        'center',
        'zoom'
    ],

    twoWayBindable: [
        'selection'
    ],

    applyBasemap: function(basemap, oldBasemap) {
        if (basemap) {
            if (typeof basemap === 'string') {
                basemap = this.mixins['CartoDb.CartoBasemaps'].getBasemapById(basemap);
            } else {
                basemap = basemap.isModel ? basemap.getData() : basemap;
            }
            if (basemap && basemap.url) {
                if (oldBasemap) {
                    this.getMap().removeLayer(oldBasemap);
                }
                return L.tileLayer(basemap.url, {
                    attribution: basemap.attribution || null,
                    tms: basemap.tms || false
                });
            }
        }
    },

    updateBasemap: function(basemap) {
        if (this.getMap()) {
            basemap.addTo(this.getMap()).bringToBack();
        }
    },

    applySelection: function(record) {
        if (record) {
            return record;
        }
    },

    updateSelection: function(record) {
        var selectedAction;
        if (record.getData().lat && record.getData().lng && (selectedAction = this.getSelectedAction())) {
            if(typeof selectedAction === 'string') {
                this.setSelectedAction(selectedAction = [selectedAction]);
            }
            for(var i = 0; i < selectedAction.length; i++) {
                switch (selectedAction[i]) {
                    case 'panTo':
                    this.getMap().panTo([record.getData().lat, record.getData().lng]);
                    break;
                    case 'placeMarker':
                    if(this._placedMarker) {
                        this.getMap().removeLayer(this._placedMarker);
                    }
                    this._placedMarker = L.marker([record.getData().lat,record.getData().lng]).addTo(this.getMap());
                    break;
                }
            }
        }
    },

    // applyBounds: function(data) {
    //     return data;
    // },

    updateBounds: function(data) {
        this.fireEvent('mapBoundsUpdate');
    },
    
    // applyMapCenter: function (coordinates) {
    //     var returnValue = false;
    //     if(this.getMapCenter() && this.getMapCenter() !== coordinates){
    //         returnValue = coordinates;
    //     }
    //     debugger
    //     return returnValue;
    // },

    // updateMapCenter: function(coordinates) {
    //     var map = this.getMap();
    //     if(map){
    //         debugger
    //     }
	// },
	/**
	 * @param  {} t
	 * @param  {} eOpts
	 */
	afterRender: function(t, eOpts){
        var me = this,
            mapCenter = (typeof me.getCenter() === 'string') ? me.mixins['CartoDb.CountryCodesLatLongISO3166'].codes[me.getCenter()] : (Array.isArray(me.getCenter())) ? me.getCenter() : [0,0];
        
        me._subLayers = {};
        me.setMap(L.map(me.getId(), {
            scrollWheelZoom: me.getScrollWheelZoom(),
            center:          mapCenter,
            zoom:            me.getDefaultMapZoom(),
            minZoom:        me.getMinZoom(),
            maxZoom:        me.getMaxZoom()
        }));
        if(!me.getBasemap()){
            me.setBasemap('positronLite');
        } else {
            me.getBasemap().addTo(me.getMap()).bringToBack();
        }
        me.getMap().addEventListener('moveend', me.publishMapBounds, me);
        // me.getMap().addEventListener('zoomend', me.publishMapBounds, me);
        me.getMap().addEventListener('click', function(e){
            me.fireEvent('mapClicked', me, me.getMap(), e);
        }, me);
        me.fireEvent('mapLoaded');
        var initialLayers = me.getLayers();
        if(initialLayers.length){
            initialLayers.forEach(function(item, index){
                initialLayers[index] = me.createLayer(item);
            });
        }
    },

    createLayer: function(config) {
        config.map = this;
        return Ext.create('CartoDb.CartoLayer', config);
    },

    addLayer: function(layer) {
        if (!layer.isLayer) {
            layer = this.createLayer(layer);
        }
        this.getLayers().push(layer);
    },

    removeLayer: function(layerId) {
        var layer = this.getLayer(layerId);
        if (layer && layer.getCartoLayer()) {
            layer.getCartoLayer().remove();
        }
    },

	/**
	 * @param  {} w
	 * @param  {} h
	 * @param  {} oW
	 * @param  {} oH
	 */
	onResize: function(w, h, oW, oH){
		this.getMap().invalidateSize();
	},
    
    /**
     * Publishes the map's bounds to the viewModel, and updates the stores that are locked to the map.
     * @param  {Event} event
     */
    publishMapBounds: function(event){
        this.setBounds((event) ? event.target.getBounds() : this.getMap().getBounds());
        var center = (event) ? event.target.getCenter() : this.getMap().getCenter();
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

    addSubLayer: function(subLayer) {
        this._subLayers[subLayer.subLayerId] = subLayer;
    },

    getSubLayer: function(subLayerId) {
        return this._subLayers[subLayerId];
    },

    getLayer: function(layerId) {
        return this.layers[Ext.Array.pluck(this.layers, 'id').indexOf(layerId)];
    },

    /**
     * Removes a subLayer from the map based on the subLayer's id.
     * @param  {} subLayerId
     */
    removeSubLayer: function(subLayerId) {
        var subLayer;
        if (typeof subLayerId === 'string') {
            subLayer = this.getSubLayer(subLayerId);
            if (subLayer) {
                subLayer.remove();
            }
        }
    },

    /**
     * Removes a layer from the map based on the layer's index.
     * @param  {integer} index
     * @param  {function} callback
     */
    // removeLayerAtIndex: function(index, callback) {
    //     var layer = this.getLayers()[index];
    //     if (layer) {
    //         this.getMap().removeLayer(layer);
    //         this.getLayers().splice(index,1);
    //     }
    // },

    /**
     * Creates the map layers based on the initial config.
     * @param  {object} data
     * @param  {function} cb
     */
    createCartoLayer: function(layer) {
        var me = this;
        cartodb.createLayer(me.getMap(), layer.buildCartoLayer())
        .addTo(me.getMap())
        .done(function(cartoLayer) {
            me.getLayer(cartoLayer.options.id).setCartoLayer(cartoLayer);
        })
        .error(function(error) {
            console.error(error);
        });
    },

});