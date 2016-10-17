# extjs-carto
Native components for ExtJS to interact with Carto map layers, data and visualizations.


## CartoMap.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`map` | [L.map] | [L.map] | The leaflet map for this component.
`defaultMapZoom` | Number | 4 | The default zoom level of the `map`.
`scrollWheelZoom` | Boolean | true | `true` to allow the map to be scrolled by the mouse wheel.
`basemap` | String<br>Object<br>[L.tileLayer] | 'positronLite' | The basemap to be used for the `map`.
`bounds` | [LatLngBounds] | null | The bounds of the `map`.
`minZoom` | Number | 3 | The minimum possible zoom level of the `map`.
`maxZoom` | Number | 18 | The maximum possible zoom level of the `map`.
`mapLock` | Boolean | false | `true` for the map to update the filters in every store found in `storesToLock` when the `map` bounds change.
`layers` | Object[] | [] | Objects defining the layers of the `map`.
`selection` | [Ext.data.Model] | null | The selected record of the `map`.
`selectedAction` | String<br>String[] | null | The actions to take when a record is selected.
`stores` | [Ext.data.Store] | null | The stores associated with each subLayer of the `map`.
`storesToLock` | String[] | null | An array of storeIds to be passed the `map`'s bounds when `mapLock` is true.

### Binding

The `map`'s selection is two-way bindable, similarly to other Extjs components. This means it plays well with things like `grid`s.

#### Example

```javascript
{
    xtype: 'grid',
    bind: {
        selection: '{selectedItem}'
    },
    listeners: {
        afterrender: function(){
            this.setStore(Ext.getStore('layer1'));
        }
    }
}, {
    xtype: 'cartoMap',
    bind: {
        selection: '{selectedItem}'
    },
    basemap: 'darkMatterLite',
    layers: [{
        username: 'example_username',
        subLayers: [{
            storeId: 'layer1',
            table: 'example_table'
        }]
    }]
}
```

#### Available Basemaps

* positron
* positronLite
* positronLabelsBelow
* darkMatter
* darkMatterLite
* darkMatterLabelsBelow
* cartoWorldEco
* cartoWorldFlatBlue
* cartoWorldMidnightCommander
* cartoAntique
* toner
* tonerLite
* tonerLabelsBelow
* tonerBackground
* tonerLines
* tonerHybrid
* watercolor

##### Example Usage

```javascript
{
    xtype: 'cartoMap',
    basemap: 'darkMatterLite'
}
```

#### Available Selected Actions

* placeMarker
* panTo

##### Example Usage

```javascript
{
    xtype: 'cartoMap',
    selectedAction: 'panTo'
}
```

```javascript
{
    xtype: 'cartoMap',
    selectedAction: ['panTo', 'placeMarker']
}
```

## CartoStore.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---


## CartoProxy.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---

## Demos

### Basic

* [Visualization of a Map in Ext JS](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/basicMap/basicMap-example1.html)
* [A Map centered on Japan](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/basicMap/basicMap-example2.html)
* [A Map with a simple Carto layer](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/basicMap/basicMap-example3.html)
* [A Map whose layers can be added and removed](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/basicMap/basicMap-example4.html)

### Grid/Map

* [Grid and Map bound to Carto Store](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example1.html)
* [Map with hidden layer and multiple selected actions](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example2.html)
* [Grid locked to Map bounds (with tooltip)](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example3.html)
* [Grid and Map with filter options](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example4.html)
* [Grid and Map with auto filter options](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example5.html)
* [Grid and Map with combo filter](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example6.html)
* [Grid and Map with combo filter](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/gridMap/gridMap-example7.html)

### Carto Account

* [Carto Stores with tables and columns](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/cartoAccount/cartoAccount-example1.html)

### Store Binding

* [Grid and two Maps bound to one Carto Store](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/storeBinding/storeBinding-example1.html)

### [Wildfire Exploration](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/fireMap/fireMap-example2.html)

### [Carto Map Explorer](http://rawgit.com/CrestoneDigital/extjs-carto/master/carto/examples/playMap/playMap-example1.html)


[Ext.data.Model]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Model.html
[Ext.data.Store]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Store.html
[L.tileLayer]: http://leafletjs.com/reference.html#tilelayer
[L.map]: http://leafletjs.com/reference.html#map-usage
[LatLngBounds]: http://leafletjs.com/reference.html#latlngbounds