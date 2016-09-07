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
        'CartoDb.CartoStore'    
    ],
    config: {
		map: null,
		cartodb: null,
        defaultMapZoom: 4,
        scrollWheelZoom: true,
        baseLayer: null,
        bounds: null,
        zoom: null,
        minZoom: 3,
        maxZoom: 18,
        layerItems: [],
        layers: []
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
    
    /**
     * @param  {object} layerData - Contains the url and the attribution data for the base layer
     */
    applyBaseLayer: function (layerData) {
        if(this.getBaseLayer()){
            this.getMap().removeLayer(this.getBaseLayer());
        }
        return L.tileLayer(layerData.url, {
			attribution: layerData.attribution,
			tms: (layerData.tms) ? layerData.tms : false
		});
    },
    
    /**
     * Called after the baseLayer has been set and the previous layer has been removed. 
     * @param  {object} baseLayer
     */
    updateBaseLayer: function(baseLayer) {
		baseLayer.addTo(this.getMap()).bringToBack();
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
        var mapCenter = (typeof this.getCenter() === 'string') ? this.mixins['CartoDb.CountryCodesLatLongISO3166'].codes[this.getCenter()] : (Array.isArray(this.getCenter())) ? this.getCenter() : [0,0];
        this.setMap(L.map(this.getId(), {
            scrollWheelZoom: this.getScrollWheelZoom(),
            center:          mapCenter,
            zoom:            this.getDefaultMapZoom(),
            minZoom:        this.getMinZoom(),
            maxZoom:        this.getMaxZoom()
        }));

        this.setBaseLayer({
            url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
            attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
        });
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
        this.createLayers(data.username, dataStores, function(err, layer){
            if(err) {
                console.log('Error: ' + err);
            }else{
                return callback(null, layer);
            }
        });
    },

    createLayers: function(username, dataStores, cb){
        var sublayers = [];
        dataStores.forEach(function(item, index){
            var sublayer = {sql: item.getCartoSql(), cartocss: item.getCartoCSS()};
            sublayers.push(sublayer);
        }.bind(this));
        // if(layerData.subLayers && layerData.subLayers.length > 0){
        //     layerData.subLayers.forEach(function(item){
        //         sublayers.push({sql: this.mixins['CartoDb.CartoSqlMixin'].sqlBuilder(item.sqlData), cartocss: item.cartocss});
        //     }.bind(this));
        // }else{
        //     sublayers.push({sql: this.mixins['CartoDb.CartoSqlMixin'].sqlBuilder(layerData.layerSql), cartocss: layerData.layerCartocss});
        // }  
        cartodb.createLayer(this.getMap(), {
            user_name: username,
            type: 'cartodb',
            sublayers: sublayers
        })
        .addTo(this.getMap())
        .done(function (layer) {
            this.getLayers().push(layer);
            for(var i = 0; layer.getSubLayerCount() > i; i++){
                layer.getSubLayers(i).store = dataStores[i];
                dataStores[i]._subLayer = layer.getSubLayers(i);
            }
            cb(null, layer);

            // var self =  this.layer[0]

            // layer.getSubLyers.forEach(function( rec, idx ) {
            //   self.layer.subLayers[idx]._sublayer = rec;
            // });
            
            // sublayer.setInteraction(true);
            // sublayer.set({
            //     //TODO 1: checking what interactivity is set to shows these fields are correctly set. For whatever reason, the date fields are not returned. ???
            //     interactivity: "cartodb_id, project__1, start_date, end_date, project_st"
            // });
            
            // me.cursorChange(sublayer); // this never worked

            // sublayer.on('featureClick', function(e, pos, latlng, data, subLayerIndex) {
            //     //TODO 2: click on a construction project ... data is returning without start and end dates !!!!!

            //     // me.getCrashData(data.start_date, data.end_date);  // TODO 3: this can be called once the dates are there ????
            // });
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
            storesArray.push(
                Ext.create("CartoDb.CartoStore",{
                    storeId: storeId,
                    tableName: item.tableName,
                    _sublayer: null,
                    proxy: {
                        type: 'carto',
                        username: username,
                        table: item.table
                    }
                })
            );
        }.bind(this));

        return storesArray;
    }
});