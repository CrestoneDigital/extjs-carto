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
        'CartoDb.CartoBaseLayers'    
    ],
    config: {
		map: null,
		cartodb: null,
        defaultMapZoom: 4,
        scrollWheelZoom: true,
        baseLayer: null,
        baseLayerName: null,
        bounds: null,
        zoom: null,
        minZoom: 3,
        maxZoom: 18,
        mapLock: false,
        layerItems: [],
        layers: [],
        selection: null,
        selectedAction: undefined,
        stores: null
	},
    
    renderConfig: {
        center: [40, -95]
    },

    publishes: [
        'bounds',
        'baseLayer',
        'center',
        'zoom'
    ],

    twoWayBindable: [
        'selection'
    ],
    
    /**
     * @param  {object} layerData - Contains the url and the attribution data for the base layer
     */
    applyBaseLayerName: function (layerName) {
        var baseLayerData;

        if(this.getMap() && this.getBaseLayer()){
            this.getMap().removeLayer(this.getBaseLayer());
        }
        if(typeof this.getBaseLayerName() === 'object' && this.getBaseLayerName() !== null){
            baseLayerData = layerName;    
        }else{
            baseLayerData = this.mixins['CartoDb.CartoBaseLayers'].getBaseMap(layerName);
        }
        if(this.getMap()){
            this.setBaseLayer(L.tileLayer(baseLayerData.url, {
                attribution: baseLayerData.attribution,
                tms: (baseLayerData.tms) ? baseLayerData.tms : false
            }));
        }
        return layerName;
    },

    applyBaseLayer: function (baseLayer) {
        if(this.getMap() && this.getBaseLayer()){
            this.getMap().removeLayer(baseLayer);
        }
        return baseLayer;
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
    
    // /**
    //  * Called after the baseLayer has been set and the previous layer has been removed. 
    //  * @param  {object} baseLayer
    //  */
    // updateBaseLayerName: function(baseLayer) {
    //     debugger
    //     this.setBaseLayer(baseLayer);
	// 	baseLayer.addTo(this.getMap()).bringToBack();
	// },

    updateBaseLayer: function(baseLayer) {
        // this.setBaseLayer(baseLayer);
        if(baseLayer && this.getMap()){
            baseLayer.addTo(this.getMap()).bringToBack();
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

     /**
     * Called after the baseLayer has been set and the previous layer has been removed. 
     * @param  {object} baseLayer
     */
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
        var baseLayer,
            mapCenter = (typeof this.getCenter() === 'string') ? this.mixins['CartoDb.CountryCodesLatLongISO3166'].codes[this.getCenter()] : (Array.isArray(this.getCenter())) ? this.getCenter() : [0,0];
        
        this.setMap(L.map(this.getId(), {
            scrollWheelZoom: this.getScrollWheelZoom(),
            center:          mapCenter,
            zoom:            this.getDefaultMapZoom(),
            minZoom:        this.getMinZoom(),
            maxZoom:        this.getMaxZoom()
        }));
        if(!this.getBaseLayerName()){
            this.setBaseLayerName('Positron (lite)');
        }
        if(!this.getBaseLayer()){
            this.setBaseLayerName(this.getBaseLayerName());
        }
        this.getMap().addEventListener('moveend', this.publishMapBounds, this);
        // this.getMap().addEventListener('zoomend', this.publishMapBounds, this);
        this.getMap().addEventListener('click', function(e){
            this.fireEvent('mapClicked', this, this.getMap(), e);
        }, this);
        this.fireEvent('mapLoaded');
        var initialLayers = this.getLayerItems();
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

    publishMapBounds: function(event){
        this.setBounds((event) ? event.target.getBounds() : this.getMap().getBounds());
        var center = (event) ? event.target.getCenter() : this.getMap().getCenter();
        this.setCenter([center.lat, center.lng]);
        if(this.getMapLock()) {
            this.updateStoresByBounds();
        }
    },

    updateStoresByBounds: function() {
        if(this.getStores() && this.storesToLock) {
            for(var i = 0; i < this.getStores().length; i++) {
                if(this.storesToLock.indexOf(this.getStores()[i].getStoreId()) > -1) {
                    Ext.apply(this.getStores()[i].getProxy().getWhere(), {
                                bounds: {
                                    type: 'bounds',
                                    bounds: this.getBounds()
                                }
                            }
                    );
                    this.getStores()[i].load();
                }
            }
        }
    },

    resetStores: function() {
        if(this.getStores()) {
            for(var i = 0; i < this.getStores().length; i++) {
                Ext.apply(this.getStores()[i].getProxy().getWhere(), {
                            bounds: {
                                type: 'bounds',
                                bounds: null
                            }
                        }
                )
                this.getStores()[i].load();
            }
        }
    },

    setMapLock: function(mapLock) {
        this.mapLock = mapLock;
        if(mapLock) {
            this.updateStoresByBounds();
        } else {
            this.resetStores();
        }
    },

    addLayer: function(data, callback) {
        this.setStores(this.createDataStores(data));
        this.createLayer(data, function(err, layer){
            if(err) {
                console.log('Error: ' + err);
            }else{
                return callback(null, layer);
            }
        });
    },

    removeLayerAtIndex: function(index, callback) {
        var layer = this.getLayers()[index];
        this.getMap().removeLayer(layer);
        this.getLayers().splice(index,1);
    },

    createLayer: function(data, cb){
        var sublayers = [],
            dataStores = this.getStores();
        dataStores.forEach(function(item, index){
            var sublayer = {sql: item.getCartoSql(true), cartocss: item.getCartoCSS()};
            sublayers.push(sublayer);
        }.bind(this)); 
        cartodb.createLayer(this.getMap(), {
            user_name: data.username,
            type: 'cartodb',
            sublayers: sublayers
        })
        .done(function (layer) {
            this.getLayers().push(layer);
            if(!data.hidden) {
                layer.addTo(this.getMap());
            }
            for(var i = 0; layer.getSubLayerCount() > i; i++){
                layer.getSubLayer(i).store = dataStores[i];
                dataStores[i]._sublayer = layer.getSubLayers(i);
                if(dataStores[i].interactivity){
                    var sublayer = layer.getSubLayer(i);
                    sublayer.setInteraction(dataStores[i].interactivity.enable);
                    sublayer.set({
                        interactivity: 'carto_store_id,' + dataStores[i].interactivity.fields.join(',')
                    });
                    var tooltip = dataStores[i].interactivity.tooltip;
                    if(tooltip && tooltip.enable){
                        this.getMap().viz.addOverlay({
                            type: 'tooltip',
                            layer: sublayer,
                            template: tooltip.html || this.createDefaultTooltip(tooltip.fields || dataStores[i].interactivity.fields, tooltip.mood),
                            position: tooltip.position || 'bottom|right',
                            fields: [this.createFields(dataStores[i].interactivity.fields)]
                        });
                    }
                    sublayer.on('featureClick', this.featureClick.bind(this));
                    sublayer.on('featureOver', this.featureOver.bind(this));
                    sublayer.on('featureOut', this.featureOut.bind(this));
                }
            }
            cb(null, layer);
        }.bind(this))
        .error(function(error) {
            cb(error);
        }.bind(this));

    },

    createDataStores: function(data) {
        var storesArray = [];
        data.subLayers.forEach(function(item, index){
            var storeId = (item.storeId) ? item.storeId : new Date().getTime();
            var username = (data.username) ? data.username : this.getUsername();
            var store = Ext.create("CartoDb.CartoStore",{
                    storeId: storeId,
                    _sublayer: null,
                    style: item.style,
                    // mapLock: item.mapLock,
                    proxy: {
                        type: 'carto',
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
        var featureData = this.getRecord(record.carto_store_id, record.cartodb_id);
        // var dataModel = Ext.create('CartoDb.CartoDataModel', record);
        // dataModel.internalId = dataModel.id;
        this.setSelection(featureData);
        this.fireEvent('recordClicked', this, this.getMap(), featureData, latLng, point, e)
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
        // var store, record;
        // for(var i = 0; i < this.getStores().length; i++) {
        //     store = this.getStores()[i];
        //     for(var j = 0; j < store.getData().length; j++) {
        //         record = store.getData().items[j];
        //         if(record.data.cartodb_id === id) {
        //             return record;
        //         }
        //     }
        // }
        return Ext.getStore(storeId).findRecord('cartodb_id', cartodb_id);
    }

});