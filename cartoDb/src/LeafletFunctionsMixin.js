Ext.define('CartoDb.LeafletFunctionsMixin', {
    /**
     * @param  {integer} lat
     * @param  {integer} lng
     * @param  {integer} zoom
     */
    panTo: function(lat, lng, zoom) {
		this.getMap().setView([lat,lng], zoom || 10);
	},
    
    /**
     * @param  {} bounds
     * @param  {} options
     */
    fitBounds: function(bounds, options) {
        this.getMap().fitBounds(bounds, options);
    },

    /**
     * @param  {} num
     * @param  {} options
     */
    setZoom: function(num, options) {
        this.getMap().setZoom(num, options);
    },
    
    
    /**
     * @param  {} num
     * @param  {} options
     */
    zoomIn: function(num, options) {
        this.getMap().zoomIn(num, options);
    },
    
    
    /**
     * @param  {} num
     * @param  {} options
     */
    zoomOut: function(num, options) {
        this.getMap().zoomOut(num, options);
    },
    
    /**
     * @param  {} latLngBounds
     */
    setMaxBounds: function(latLngBounds) {
        this.getMap().setMaxBounds(latLngBounds);
    },
    /**
     */
    remove: function() {
        this.getMap().remove();
    },
    /**
     */
    getCenter: function() {
        return this.getMap().getCenter();
    },
    /**
     */
    getZoom: function() {
        return this.getMap().getZoom();
    },
    /**
     */
    getMinZoom: function() {
        return this.getMap().getMinZoom();
    },
    /**
     */
    getMaxZoom: function() {
        return this.getMap().getMaxZoom();
    },
    /**
     */
    getBounds: function() {
        return this.getMap().getBounds();
    },
    /**
     * @param  {} latLngBounds
     * @param  {} inside
     */
    getBoundsZoom: function(latLngBounds, inside) {
        return this.getMap().getBoundsZoom(latLngBounds, inside);
    },
    /**
     */
    getSize: function() {
        return this.getMap().getSize();
    },
    /**
     */
    getPixelBounds: function() {
        return this.getMap().getPixelBounds();
    },
    /**
     */
    getPixelOrigin: function() {
        return this.getMap().getPixelOrigin();
    }

 
});