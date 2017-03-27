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

## Layers

Layers are a combination of data (from SQL) and styling (from CartoCSS) that render the map.
Carto has multiple different types of layers (see the [demo][Layer Demos] for some examples), but there are some configs common to them all.

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`cartoLayer` | Layer | null | The underlying Layer object.
`layerId` | String | Auto-generated id | The key by which this layer can be retrieved, removed, etc.
`username` | String | '' | The username for the associated carto account.
`table` | String | '' | The table that this layer draws from.
`hidden` | Boolean | false | Set to `true` to hide this layer.
`mapZIndex` | Number | null | Defines the order that the layers are rendered on the `map`.

## Layer Groups

Carto can combine multiple layers into one layer group that is created and rendered as one layer, rather than multiple.

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`subLayers` | Carto.util.SubLayerCollection | null | The collection of [Carto.sublayer.SubLayerBase] objects associated with this layer group.

## SubLayers

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`layer` | [Carto.layer.LayerGroup] | null | The [Carto.layer.LayerGroup] that owns this subLayer.

See also: [Carto.mixin.DataContainingLayer]

## Torque Layers

Torque layers combine with [Carto.css.Torque][CartoCSS] to create powerful layer objects that can accomplish much more than traditional map layers.

See also: [Carto.mixin.DataContainingLayer]

##### Example Usage

```javascript
{
    xtype: 'cartoMap',
    layers: [{
        type: 'torque',
        css: {
            type: 'torque' // or heatmap, torquecat
        },
        ...
    }]
}
```

## DataContainingLayer.js

Most layers (like [Carto.layer.Torque] and [Carto.sublayer.SubLayerBase]) contain data.
This mixin defines the SQL, CartoCss, and store functionality for layers that render data.

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`store` | [Carto.CartoStore] | null | A [Carto.CartoStore] associated with this layer. If defined, it will create the SQL for this layer.
`sql` | String | '' | SQL for this layer to use when it is created.
`css` | Object<br>String<br>String[] | [Carto.css.Point][CartoCSS] | The CartoCSS definition for this layer.
`selection` | [Ext.data.Model] | null | The layer's current selected record.
`interactivity` | Object | null | Use `enable: true` to enable interactity on this layer.

## CartoCSS

CartoCSS defines how a layer is styled on the map.
There are multiple types that are available to be used as-is or extended as appropriate.

Name | Type | Description
--- | --- | ---
`point` | Carto.css.Point | A generic point-based style.
`line` | Carto.css.Line | A generic line-based style.
`polygon` | Carto.css.Polygon | A generic polygon-based style.
`intensity` | Carto.css.Intensity | Point style with multiplying effect.
`heatmap` | Carto.css.HeatMap | Torque style with multiplying effect.
`torque` | Carto.css.Torque | Torque style for showing time-based effects.
`torquecat` | Carto.css.TorqueCat | Torque style with added categorical grouping.

##### Example Usage

```javascript
{
    css: {
        type: 'point',
        // the value config will extend, not overwrite
        value: {
            markerColor: 'blue'
        }
    }
}
```

## CartoStore.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`groupBy` | [Carto.CartoGroupBy] | null | A groupBy object defining the GROUP BY clause of the `Carto.CartoProxy`'s SQL.


## CartoProxy.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---

## CartoGroupBy.js

This is an SQL helper object for defining the GROUP BY clause in the SQL.

### Configs

Name | Type | Default | Description
--- | --- | --- | ---
`fields` | Object[]<br>String[] | null | An array of field configs, in the order they should be presented in the GROUP BY clause.
`countName` | String | 'cnt' | The name of the field that should contain the counts of the different groups.

In addition, the [Carto.CartoGroupBy] object uses optional extra properties of the [Ext.data.field.Field] that are not native.

Name | Type | Default | Description
--- | --- | --- | ---
`property` | String | undefined | Specifies the name of the column for this field, if different from the `name` of the field.
`sql` | String | undefined | Use this to force the query to use this SQL for this field. Useful for more complicated queries.
`aggregateType` | String | undefined | An SQL function for aggregating on this field. If specified, this field will not be included in the GROUP BY clause.

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

* [Demonstration of multiple layer types (point, polygon, heatmap, torque)](http://rawgit.com/CrestoneDigital/extjs-carto/master/examples/layerDemo/layerDemo-example1.html)

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
[Carto.CartoGroupBy]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#cartogroupbyjs
[Carto.sublayer.SubLayerBase]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#sublayers
[Ext.data.field.Field]: http://docs.sencha.com/extjs/6.2.1/classic/Ext.data.field.Field.html
[Carto.layer.LayerGroup]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#layer-groups
[Carto.mixin.DataContainingLayer]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#datacontaininglayerjs
[Layer Demos]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#layer-demos
[CartoCSS]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#cartocss
[Carto.CartoStore]: https://github.com/CrestoneDigital/extjs-carto/blob/master/README.md#cartostorejs

# Presentations

{::nomarkdown}
<iframe src="//www.slideshare.net/slideshow/embed_code/key/1lsa3afC6oglIL" width="595" height="485" frameborder="0" marginwidth="0" marginheight="0" scrolling="no" style="border:1px solid #CCC; border-width:1px; margin-bottom:5px; max-width: 100%;" allowfullscreen> </iframe> <div style="margin-bottom:5px"> <strong> <a href="//www.slideshare.net/senchainc/senchacon-2016-integrating-geospatial-maps-big-data-using-cartodb-via-ext-js-components-michael-giddens" title="SenchaCon 2016: Integrating Geospatial Maps &amp; Big Data Using CartoDB via Ext JS Components - Michael Giddens" target="_blank">SenchaCon 2016: Integrating Geospatial Maps &amp; Big Data Using CartoDB via Ext JS Components - Michael Giddens</a> </strong> from <strong><a target="_blank" href="//www.slideshare.net/senchainc">Sencha</a></strong> </div>
{:/}
