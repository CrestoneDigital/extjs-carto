/**
 * 
 */
Ext.define('CartoDb.CartoMap', {
    extend: 'Ext.Component',
    xtype: 'cartoMap',
    mixins: [
        'CartoDb.LeafletFunctionsMixin',
        'CartoDb.CartoProxy',
        'CartoDb.CountryCodesLatLongISO3166',
        'CartoDb.CartoStore',
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
        if (basemap && this.getMap()) {
            if (typeof basemap === 'string') {
                basemap = this.mixins['CartoDb.CartoBasemaps'].getBaseMap(basemap);
            } else {
                basemap = basemap.isModel ? basemap.getData() : basemap;
            }
            if (basemap && basemap.url) {
                if (oldBasemap) {
                    this.getMap().removeLayer(oldBasemap);
                }
                return L.tileLayer(basemap.url, {
                    attribution: basemap.attribution,
                    tms: basemap.tms || false
                });
            }
        }
    },

    updateBasemap: function(basemap) {
        basemap.addTo(this.getMap()).bringToBack();
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
        var mapCenter = (typeof this.getCenter() === 'string') ? this.mixins['CartoDb.CountryCodesLatLongISO3166'].codes[this.getCenter()] : (Array.isArray(this.getCenter())) ? this.getCenter() : [0,0];
        
        this.setMap(L.map(this.getId(), {
            scrollWheelZoom: this.getScrollWheelZoom(),
            center:          mapCenter,
            zoom:            this.getDefaultMapZoom(),
            minZoom:        this.getMinZoom(),
            maxZoom:        this.getMaxZoom()
        }));
        if(!this.getBasemap()){
            this.setBasemap('positronLite');
        }
        this.getMap().addEventListener('moveend', this.publishMapBounds, this);
        // this.getMap().addEventListener('zoomend', this.publishMapBounds, this);
        this.getMap().addEventListener('click', function(e){
            this.fireEvent('mapClicked', this, this.getMap(), e);
        }, this);
        this.fireEvent('mapLoaded');
        var initialLayers = this.getLayers();
        if(initialLayers.length > 0){
            initialLayers.forEach(function(item, index){
                this.addLayer(item, function(err, layer){
                    if(err){
                        console.log('err');
                    }else{
                        console.log('success');
                    }
                });
            }.bind(this));
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
    addLayer: function(data, callback) {
        this.setStores(this.createDataStores(data));
        this.createLayer(data, function(err, layer){
            if(err) {
                console.log('Error: ' + err);
            }else{
                return callback ? callback(null, layer) : null;
            }
        });
    },

    /**
     * Removes a subLayer from the map based on the subLayer's storeId.
     * @param  {} storeId
     */
    removeSubLayer: function(storeId) {
        if (typeof storeId === 'string') {
            var store = Ext.getStore(storeId);
            if (store) {
                store.destroy();
            }
        }
    },

    /**
     * Removes a layer from the map based on the layer's index.
     * @param  {integer} index
     * @param  {function} callback
     */
    removeLayerAtIndex: function(index, callback) {
        var layer = this.getLayers()[index];
        if (layer) {
            this.getMap().removeLayer(layer);
            this.getLayers().splice(index,1);
        }
    },

    /**
     * Creates the map layers based on the initial config.
     * @param  {object} data
     * @param  {function} cb
     */
    createLayer: function(data, cb){
        var subLayers = [],
            dataStores = this.getStores();
        dataStores.forEach(function(item, index){
            var subLayer = {sql: item.getCartoSql(true), cartocss: item.getCartoCSS()};
            subLayers.push(subLayer);
        }.bind(this));
        cartodb.createLayer(this.getMap(), {
            user_name: data.username,
            type: 'cartodb',
            sublayers: subLayers
        })
        .done(function (layer) {
            this.getLayers().push(layer);
            if(!data.hidden) {
                layer.addTo(this.getMap());
            }
            for(var i = 0; layer.getSubLayerCount() > i; i++){
                layer.getSubLayer(i).store = dataStores[i];
                dataStores[i]._subLayer = layer.getSubLayer(i);
                if(dataStores[i].interactivity){
                    var subLayer = layer.getSubLayer(i);
                    subLayer.setInteraction(dataStores[i].interactivity.enable);
                    subLayer.set({
                        interactivity: 'carto_store_id,cartodb_id' + ((dataStores[i].interactivity.fields) ? ',' + dataStores[i].interactivity.fields.join(',') : '')
                    });
                    var tooltip = dataStores[i].interactivity.tooltip;
                    if(tooltip && tooltip.enable){
                        this.getMap().viz.addOverlay({
                            type: 'tooltip',
                            layer: subLayer,
                            template: tooltip.html || this.createDefaultTooltip(tooltip.fields || dataStores[i].interactivity.fields, tooltip.mood),
                            position: tooltip.position || 'bottom|right',
                            fields: [this.createFields(dataStores[i].interactivity.fields)]
                        });
                    }
                    subLayer.on('featureClick', this.featureClick.bind(this));
                    subLayer.on('featureOver', this.featureOver.bind(this));
                    subLayer.on('featureOut', this.featureOut.bind(this));
                }
            }
            cb(null, layer);
        }.bind(this))
        .error(function(error) {
            cb(error);
        }.bind(this));

    },

    /**
     * Creates the data stores associated with each subLayer.
     * @param  {object} data
     */
    createDataStores: function(data) {
        var storesArray = [];
        if (storesArray.length > 0) {
            for (var i = 0; i < storesArray.length; i++) {
                if (typeof storesArray[i] === 'string') {
                    storesArray[i] = Ext.getStore(storesArray[i]);
                }
            }
        }
        data.subLayers.forEach(function(item, index){
            var storeId = (item.storeId) ? item.storeId : new Date().getTime();
            var username = (data.username) ? data.username : this.getUsername();
            var store = Ext.create("CartoDb.CartoStore",{
                    storeId: storeId,
                    _subLayer: null,
                    style: item.style,
                    proxy: {
                        username: username,
                        enableLatLng: item.enableLatLng || false,
                        table: item.table
                    }
                });
            // if(item.transform) store.proxy.reader.transform = item.transform;
            if(item.transform) store.proxy.reader.setConfig('transform', item.transform);
            if(item.autoLoad) store.load();
            if(item.interactivity) store.interactivity = item.interactivity;
            storesArray.push(store);
        }.bind(this));
        return storesArray;
    },

    featureClick: function(e, latLng, point, record){
        var selection = this.getRecord(record.carto_store_id, record.cartodb_id);
        this.setSelection(selection);
        this.fireEvent('select', this, this.getMap(), selection, latLng, point, e);
    },

    featureOver: function() {
        if (!this._cursor && $('.leaflet-container').css('cursor') != 'pointer' ) {
            this._cursor = $('.leaflet-container').css('cursor');
        }
        $('.leaflet-container').css('cursor','pointer');
    },

    featureOut: function() {
        $('.leaflet-container').css('cursor',this._cursor);
    },

    /**
     * @param  {String[]} fields
     * @param  {String} mood - Can be either 'dark' or 'light'.
     */
    createDefaultTooltip: function(fields, mood) {
        var html = '<div class="cartodb-tooltip-content-wrapper ' + (mood || 'light') + '"><div class="cartodb-tooltip-content">';
        for(var i = 0; i < fields.length; i++){
            html += '<h4>' + fields[i] + '</h4><p>{{' + fields[i] + '}}</p>';
        }
        return html + '</div></div>';
    },

    createFields: function(fields) {
        var obj = {};
        for(var i = 0; i < fields.length; i++){
            obj[fields[i]] = fields[i];
        }
        return obj;
    },

    getRecord: function(storeId, cartodb_id) {
        return Ext.getStore(storeId).findRecord('cartodb_id', cartodb_id);
    }

});