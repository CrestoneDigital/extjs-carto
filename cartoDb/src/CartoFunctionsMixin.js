Ext.define('CartoDb.CartoMap', {
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],

    createLayer: function(layerData, cb){
        var sublayers = [];
        
        if(layerData.subLayers && layerData.subLayers.length > 0){
            layerData.subLayers.forEach(function(item){
                sublayers.push({sql: this.mixins['CartoDb.CartoSqlMixin'].sqlBuilder(item.sqlData), cartocss: item.cartocss});
            }.bind(this));
        }else{
            sublayers.push({sql: this.mixins['CartoDb.CartoSqlMixin'].sqlBuilder(layerData.layerSql), cartocss: layerData.layerCartocss});
        }  

        cartodb.createLayer(layerData.map, {
            user_name: layerData.user_name,
            type: 'cartodb',
            sublayers: sublayers
        })
        .addTo(layerData.map)
        .done(function (layer) {
            var layerObj = {};
            layerObj[layerData.name] = layer;
            this.layers.push(layerObj);
            cb(null, layerObj);
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

});