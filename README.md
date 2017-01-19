# extjs-carto
Native components for ExtJS to interact with Carto map layers, data and visualizations.


## CartoMap.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`cartoMap` | [L.map] | [L.map] | The leaflet map for this component.
`zoom` | Number | 4 | A zoom value to initialize the `cartoMap` with.
`scrollWheelZoom` | Boolean | true | `true` to allow the map to be scrolled by the mouse wheel.
`basemap` | String<br>Object<br>[L.tileLayer] | 'positronLite' | The basemap to be used for the `cartoMap`.
`bounds` | [LatLngBounds] | null | The bounds of the `cartoMap`.
`minZoom` | Number | 3 | The minimum possible zoom level of the `cartoMap`.
`maxZoom` | Number | 18 | The maximum possible zoom level of the `cartoMap`.
`mapLock` | Boolean | false | `true` for the map to update the filters in every store found in `storesToLock` when the `cartoMap` bounds change.
`layers` | Carto.util.LayerCollection | null | A collection of the layers of the `cartoMap`.
`selection` | [Ext.data.Model] | null | The selected record of the `cartoMap`.
`selectedAction` | String<br>String[] | null | The actions to take when a record is selected.
`stores` | [Ext.data.Store] | null | The stores associated with each subLayer of the `cartoMap`.
`storesToLock` | String[] | null | An array of storeIds to be passed the `cartoMap`'s bounds when `mapLock` is true.

### Instance Properties

Name | Type | Default | Description
--- | --- | --- | ---
`maskWhileLoading` | Boolean | false | `true` to mask the map component while tiles are loading.
`loadingMessage` | String | 'Loading Tiles...' | The message to display while the tiles are loading.

### Binding

The `map`'s selection is two-way bindable, similarly to other Extjs components. This means it plays well with things like `grid`s.

#### Example

```javascript
{
    xtype: 'grid',
    bind: {
        selection: '{selectedItem}',
        store: '{sampleStore}'
    }
}, {
    xtype: 'cartoMap',
    bind: {
        selection: '{selectedItem}'
    },
    basemap: 'darkMatterLite',
    layers: [{
        subLayers: [{
            bind: '{sampleStore}'
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
`groupBy` | [Carto.CartoGroupBy] | null | A groupBy object defining the GROUP BY clause of the `Carto.CartoProxy`'s sql.


## CartoProxy.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---

## CartoGroupBy.js

This is an sql helper object for defining the GROUP BY clause in the sql.

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`fields` | Object[]<br>String[] | null | An array of field configs, in the order they should be presented in the GROUP BY clause.
`countName` | String | 'cnt' | The name of the field that should contain the counts of the different groups.

In addition, the [Carto.CartoGroupBy] object uses optional extra properties of the [Ext.data.field.Field] that are not native.

Name | Type | Default | Description
--- | --- | --- | ---
`property` | String | undefined | Specifies the name of the column for this field, if different from the `name` of the field.
`sql` | String | undefined | Use this to force the query to use this sql for this field. Useful for more complicated queries.
`aggregateType` | String | undefined | An sql function for aggregating on this field. If specified, this field will not be included in the GROUP BY clause.

## Demos

### Basic

* [Visualization of a Map in Ext JS](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/basicMap/basicMap-example1.html)
* [A Map centered on Japan](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/basicMap/basicMap-example2.html)
* [A Map with a simple Carto layer](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/basicMap/basicMap-example3.html)
* [A Map whose layers can be added and removed](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/basicMap/basicMap-example4.html)

### Grid/Map

* [Grid and Map bound to Carto Store](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example1.html)
* [Map with hidden layer and multiple selected actions](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example2.html)
* [Grid locked to Map bounds (with tooltip)](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example3.html)
* [Grid and Map with filter options](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example4.html)
* [Grid and Map with auto filter options](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example5.html)
* [Grid and Map with combo filter](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example6.html)
* [Grid and Map with combo filter](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/gridMap/gridMap-example7.html)

### Carto Account

* [Carto Stores with tables and columns](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/cartoAccount/cartoAccount-example1.html)

### Chart/Map

* [Chart and Map filtered by text input](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/chartMap/chartMap-example1.html)

### Layer Demos

* [Demonstration of multiply layer types (point, polygon, heatmap, torque)](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/layerDemo/layerDemo-example1.html)

### Store Binding

* [Grid and two Maps bound to one Carto Store](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/storeBinding/storeBinding-example1.html)

### Fire Map

* [Wildfire Map with two styled layers](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/fireMap/fireMap-example1.html)
* [Wildfire Map with styled layer and heatmap layer](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/fireMap/fireMap-example3.html)

### [Wildfire Exploration](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/fireMap/fireMap-example2.html)

### [Carto Map Explorer](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/playMap/playMap-example1.html)


[Ext.data.Model]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Model.html
[Ext.data.Store]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Store.html
[L.tileLayer]: http://leafletjs.com/reference.html#tilelayer
[L.map]: http://leafletjs.com/reference.html#map-usage
[LatLngBounds]: http://leafletjs.com/reference.html#latlngbounds
[Carto.CartoGroupBy]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#groupbyjs
[Ext.data.field.Field]: http://docs.sencha.com/extjs/6.2.1/classic/Ext.data.field.Field.html