Ext.define('Carto.layer.LayerBase', {
    extend: 'Carto.AbstractLayer',

    mixins: [
        'Ext.mixin.Factoryable'
    ],

    isLayer: true,

    factoryConfig: {
        defaultType: 'cartodb',
        type: 'layer'
    },

    config: {
        map: null
    },

    getRefOwner: function() {
        return this.getMap();
    }
});