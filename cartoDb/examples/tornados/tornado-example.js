Ext.Loader.setConfig({enabled: true, disableCaching: true});
//Ext.Loader.setPath('CartoDb', '../../src/');

Ext.require([
//    'BarChart'
]);

Ext.onReady(function () {
//    Ext.QuickTips.init();

    Ext.create('Ext.data.Store', {
        storeId: 'tornadosStore',
        remoteFilter: true,
        remoteSort: true,
        // sorters: 'city',
        sorters: [{
            property: 'st',
            direction: 'ASC'
        }],
        proxy: {
            type: 'carto',
            username: 'extjscarto',
            table: 'tornados'
        },
        autoLoad: true
    });
    
    
//    Ext.define('RoadExplorer.store.RoadData', {
//        extend: 'Ext.data.Store',
//
//        alias: 'store.roadData',
//
//        fields: ['name', 'value'],
//            data: [{
//                name: 'Mon',
//                value: 39
//            }, {
//                name: 'Tues',
//                value: 22
//            }, {
//                name: 'Weds',
//                value: 14
//            }, {
//                name: 'Thurs',
//                value: 10
//            }, {
//                name: 'Fri',
//                value: 30
//            }, {
//                name: 'Sat',
//                value: 6
//            }, {
//                name: 'Sun',
//                value: 2
//            }],
//
//        proxy: {
//            type: 'memory',
//            reader: {
//                type: 'json'
//            }
//        }
//    });

    Ext.define('RoadExplorer.view.graph.BarChart', {
        extend: 'Ext.chart.CartesianChart',
        xtype: 'barChart',
        label: {
            display: 'insideStart',
            orientation: 'vertical'
        },
        axes: [{
            type: 'numeric',
            position: 'top',
            fields: 'mag'
//            fields: 'value'
        }, {
            type: 'category',
            position: 'left',
            fields: 'st'
//            fields: 'name'
        }],
        series: {
            type: 'bar',
            subStyle: {
                fill: ['#C8DCF1'],
                stroke: '#5CA6DB'
            },
            xField: 'st',
            yField: 'mag',
//            xField: 'name',
//            yField: 'value',
            tooltip: {
                trackMouse: true,
                renderer: function (tooltip, record, item) {
//                    tooltip.setHtml(item.record.get('name') + ': ' + item.record.get('value'));
                }
            }
        }
    });
    
    Ext.create('Ext.container.Viewport', {
        layout: 'border',
        frame: true,
        bodyBorder: true,
        defaults: {
            collapsible: false,
            split: true,
//            bodyPadding: 10
       },
       items: [{
            title: 'United States - Tornados',
            region: 'center',
//            html: 'This is CenterPanel',
            headerPosition: 'top',
            xtype: 'barChart',
            title: 'Crashes by Day of Week',
            flipXY: true,
//            store: {
//               type: 'roadData'
//            }
            store: Ext.data.StoreManager.lookup('tornadosStore')
        },{
            title: 'East Panel',
            region: 'east',
            html: 'This is EastPanel',
            headerPosition: 'left',
            width: 400
        }]
    });

});