/**
 * 
 */
Ext.define('CartoDb.CartoMap', {
    extend: 'Ext.Component',
    xtype: 'cartoMap',
    mixins: [
        'CartoDb.CountryCodesMixin',
        'CartoDb.LeafletFunctionsMixin',
        'CartoDb.CartoProxy'    
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
        maxZoom: 18
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

        var mapCenter = (typeof this.getCenter() === 'string') ? this.mixins['CartoDb.CountryCodesMixin'][this.getCenter()] : (Array.isArray(this.getCenter())) ? this.getCenter() : [0,0];
    
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
        // layerDetails.map = this.getMap();
        // layerDetails.user_name = (data.layerDetails.user_name) ? data.layerDetails.user_name : this.getUserName();
        // this.createLayer(data.layerDetails, function(err, layer){
        //     if(err){
        //         console.log(err);
        //         callback("Error Creating Layer: " + err);
        //     }else{
        //         // if(data.enableStore){
        //             this.createDataStore({data: data, layer: layer});
        //         // }else{
        //         //     callback(null, layer);
        //         // }
        //     }
        // }.bind(this));

        var dataStores = this.createDataStores(data);
        this.createLayers(data.username, dataStores, function(err, layer){
            if(err) {
                console.log('Error: ' + err);
            }else{
                return layer;
            }
        });
    },

    createDataStore: function(data) {
        var storesArray = [];
        data.subLayers.forEach(function(item, index){
            var storeId = (item.storeId) ? item.storeId : new Date().getTime();
            var username = (data.accountName) ? data.accountName : this.getUserName();
            storesArray.push(
                Ext.create("Ext.data.Store",{
                    storeId: storeId,
                    tableName: item.tableName,
                    _sublayer: null
                })
            );
        }.bind(this));

        return storesArray;

        // if(data.data.layerDetails.sublayers && data.data.layerDetails.sublayers.length > 0){
        //     for(var i = 0; data.data.layerDetails.sublayers.length > i; i++){
        //         if(data.data.layerDetails.sublayers[i].enableStore){
        //             var storeId = (data.data.layerDetails.sublayers[i].reference) ? 
        //                             data.data.layerDetails.sublayers[i].reference : new Date().getTime();
        //             var username = (data.data.layerDetails.sublayers[i].username) ? 
        //                             data.data.layerDetails.sublayers[i].username : this.getUserName();
        //             var store = Ext.create('Ext.data.Store', {
        //                 storeId: storeId,
        //                 proxy: {
        //                     type: 'carto',
        //                     username: username,
        //                     sql: data.data.layerDetails.sublayers[i].sql
        //                 }
        //             });
        //             data.layers.getSubLayer(i).store = store;
        //             if(data.data.layerDetails.sublayers[i].autoLoad) store.load();
        //         }
        //     }
        //     cb(null, dataStores);
        // }else{
        //      if(data.data.enableStore){
        //         var storeId = (data.data.reference) ? data.data.reference : new Date().getTime();
        //         var username = (data.data.username) ? data.data.username : this.getUserName();
        //         var store = Ext.create('Ext.data.Store',{
        //             storeId: storeId,
        //             proxy: {
        //                 type: 'carto',
        //                 username: username,
        //                 sql: data.data.sql
        //             }
        //         });
        //         if(item.autoLoad) store.load();
        //         data.layers.getSubLayer(0).store = store;
        //     }
        // }
    }
});