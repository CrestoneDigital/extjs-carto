/**
 * 
 */
Ext.define('CartoDb.CartoMap', {
    extend: 'Ext.Component',
    xtype: 'cartoMap',
    mixins: [
        'CartoDb.CountryCodesMixin',
        'CartoDb.LeafletFunctionsMixin'    
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
    }
});