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
    }    
});