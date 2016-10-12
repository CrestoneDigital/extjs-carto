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


## CartoStore.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---


## CartoProxy.js

### Configs

Name | Type | Default | Description
--- | --- | --- | ---



[Ext.data.Model]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Model.html
[Ext.data.Store]: http://docs.sencha.com/extjs/6.2.0/classic/Ext.data.Store.html
[L.tileLayer]: http://leafletjs.com/reference.html#tilelayer
[L.map]: http://leafletjs.com/reference.html#map-usage
[LatLngBounds]: http://leafletjs.com/reference.html#latlngbounds