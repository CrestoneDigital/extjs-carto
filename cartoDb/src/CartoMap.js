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
        layerItems: [],
        layers: [],
        selection: null
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
        // this.getMap().panTo([record.getData().lat, record.getData().lng]);
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
        this.getMap().addEventListener('zoomend', this.publishMapBounds, this);
        this.fireEvent('mapLoaded');
        var initalLayers = this.getLayerItems();
        if(initalLayers.length > 0){
            initalLayers.forEach(function(item, index){
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
        this.setBounds(event.target.getBounds());
        var center = event.target.getCenter();
        this.setCenter([center.lat, center.lng]);
    },

    addLayer: function(data, callback) {
        var dataStores = this.createDataStores(data);
        this.createLayers(data.username, dataStores, {mapStyle: {type: data.mapStyle} },function(err, layer){
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

    createLayers: function(username, dataStores, options, cb){
        var sublayers = [];
        dataStores.forEach(function(item, index){
            var sublayer = {sql: item.getCartoSql(), cartocss: item.getCartoCSS(options.mapStyle)};
            sublayers.push(sublayer);
        }.bind(this)); 
        cartodb.createLayer(this.getMap(), {
            user_name: username,
            type: 'cartodb',
            sublayers: sublayers
        })
        .addTo(this.getMap())
        .done(function (layer) {
            this.getLayers().push(layer);
            for(var i = 0; layer.getSubLayerCount() > i; i++){
                layer.getSubLayer(i).store = dataStores[i];
                dataStores[i]._subLayer = layer.getSubLayers(i);
                if(dataStores[i].interactivity){
                    var sublayer = layer.getSubLayer(i);
                    sublayer.setInteraction(dataStores[i].interactivity.enable);
                    sublayer.set({
                        interactivity: dataStores[i].interactivity.fields.join(',')
                    });
                    sublayer.on('featureClick', this.featureClick.bind(this));
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
                    tableName: item.tableName,
                    _sublayer: null,
                    proxy: {
                        type: 'carto',
                        username: username,
                        table: item.table
                    }
                });
            if(item.autoLoad) store.load();
            if(item.interactivity) store.interactivity = item.interactivity;
            storesArray.push(store);
        }.bind(this));
        return storesArray;
    },

    featureClick: function(data, data2, data3, data4){
        var dataModel = Ext.create('CartoDb.CartoDataModel', data4);
        dataModel.internalId = dataModel.id;
        debugger
        this.setSelection(dataModel);
    }

});