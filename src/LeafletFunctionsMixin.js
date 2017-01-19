Ext.define('Carto.LeafletFunctionsMixin', {
    /**
     * @param  {integer} lat
     * @param  {integer} lng
     * @param  {integer} zoom
     */
    panTo: function(lat, lng, zoom) {
		this.getCartoMap().setView([lat,lng], zoom || 10);
	},
    
    /**
     * @param  {} bounds
     * @param  {} options
     */
    fitBounds: function(bounds, options) {
        this.getCartoMap().fitBounds(bounds, options);
    },

    setZoom: function(zoom, options) {
        this.getCartoMap().setZoom(zoom, options);
    },
    
    /**
     * @param  {} num
     * @param  {} options
     */
    zoomIn: function(num, options) {
        this.getCartoMap().zoomIn(num, options);
    },
    
    /**
     * @param  {} num
     * @param  {} options
     */
    zoomOut: function(num, options) {
        this.getCartoMap().zoomOut(num, options);
    },
    
    /**
     * @param  {} latLngBounds
     */
    setMaxBounds: function(latLngBounds) {
        this.getCartoMap().setMaxBounds(latLngBounds);
    },

    /**
     */
    remove: function() {
        this.getCartoMap().remove();
    },
    /**
     */
    getCenter: function() {
        return this.getCartoMap().getCenter();
    },
    /**
     */
    getZoom: function() {
        return this.getCartoMap().getZoom();
    },
    /**
     */
    getMinZoom: function() {
        return this.getCartoMap().getMinZoom();
    },
    /**
     */
    getMaxZoom: function() {
        return this.getCartoMap().getMaxZoom();
    },
    /**
     */
    getBounds: function() {
        return this.getCartoMap().getBounds();
    },
    /**
     * @param  {} latLngBounds
     * @param  {} inside
     */
    getBoundsZoom: function(latLngBounds, inside) {
        return this.getCartoMap().getBoundsZoom(latLngBounds, inside);
    },
    /**
     */
    getSize: function() {
        return this.getCartoMap().getSize();
    },
    /**
     */
    getPixelBounds: function() {
        return this.getCartoMap().getPixelBounds();
    },
    /**
     */
    getPixelOrigin: function() {
        return this.getCartoMap().getPixelOrigin();
    }

 
});