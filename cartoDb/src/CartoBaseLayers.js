Ext.define('CartoDb.CartoBaseLayers',{
    
    baseLayers: [{
        name: 'Positron (lite)',
        url: 'http://{s}.basemaps.cartocdn.com/light_nolabels/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    },{
        name: 'Positron',
        url: 'http://{s}.basemaps.cartocdn.com/light_only_labels/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    },{
        name: 'Positron (labels below)',
        url: 'http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'
    }, {
        name: 'Dark Matter (labels below)',
        url: 'http://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Dark Matter',
        url: 'http://{s}.basemaps.cartocdn.com/dark_only_labels/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Dark Matter (lite)',
        url: 'http://{s}.basemaps.cartocdn.com/dark_nolabels/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Carto World Eco',
        url: 'http://{s}.basemaps.cartocdn.com/base-eco/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Carto World Flat Blue',
        url: 'http://{s}.basemaps.cartocdn.com/base-flatblue/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Carto World Midnight Commander',
        url: 'http://{s}.basemaps.cartocdn.com/base-midnight/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }, {
        name: 'Carto World Midnight Commander',
        url: 'http://{s}.basemaps.cartocdn.com/base-antique/{z}/{x}/{y}.png',
        attribution: '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors, &copy; <a href="https://cartodb.com/attributions">CartoDB</a>'        
    }],
    getBaseMap: function(name){
        var baseLayer = null;
        this.baseLayers.forEach(function(item){
            if(item.name === name){
                baseLayer = item;
                
            }
        }.bind(this));
        return baseLayer;
    }


});