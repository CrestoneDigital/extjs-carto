Ext.define('Carto.CartoCss', {
    isCartoCss: true,

    constructor: function(cfg) {
        cfg = cfg || {};
        if (Ext.isArray(cfg)) {
            cfg = cfg.join('');
        }
        if (typeof cfg === 'string') {
            this.cssString = cfg;
        } else {
            var type = cfg.type;
            if (type) {
                cfg = Ext.apply({}, cfg, this.cssTypes[type]);
                delete cfg.type;
            }
            this.css = cfg;
            // this.callParent([cfg]);
            this.createCssString();
        }
        return this;
    },
    
    createCssString: function(obj) {
        var isCase = !!obj,
            obj = obj || this.css,
            str = '',
            table, k, i;
        if (obj.Map) {
            str += this.createTorqueString(obj.Map);
        }
        if (isCase) {
            str += '[' + obj.condition + ']{';
        } else {
            table = 'layer';
            str += '#' + table + '{';
        }
        for (k in obj) {
            if (k === 'case') {
                if (!Ext.isArray(obj[k])) {
                    obj[k] = [obj[k]];
                }
                for (var i in obj[k]) {
                    str += this.createCssString(obj[k][i]);
                }
            } else if (k === 'condition' || k === 'Map') {

            } else {
                str += this.parseCss(k) + ':' + obj[k] + ';';
            }
        }
        str += '}';
        if (!isCase) {
            this.cssString = str;
        }
        return str;
    },

    createTorqueString: function(obj) {
        var str = '',
            k;
        if (obj) {
            str += 'Map{';
            for (k in obj) {
                str += '-' + this.parseCss(k) + ':' + obj[k] + ';';
            }
            str += '}';
        }
        return str;
    },

    set: function(attr, value, suppressed) {
        if (typeof attr === 'string') {
            if (value === undefined) {
                delete this.css[attr];
            } else {
                this.css[attr] = value;
            }
        } else {
            for (var k in attr) {
                this.set(k, attr[k], true);
            }
            suppressed = value;
        }
        if (!suppressed) {
            this.createCssString();
        }
    },

    addCase: function(caseObj) {
        var css = this.css;
        if (!css.case) {
            css.case = [];
        }
        css.case.push(caseObj);
        this.css = css;
        this.createCssString();
    },

    removeCase: function(condition) {
        var cssCase = this.css.case;
        if (cssCase) {
            for (var i = 0; i < cssCase.length; i++) {
                if (cssCase[i].condition === condition) {
                    cssCase.splice(i, 1);
                    this.createCssString();
                    break;
                }
            }
        }
    },

    getCssString: function() {
        return this.cssString;
    },

    parseCss: function(str) {
        return str.replace(this.cssRegex, this.replaceUppercase);
    },

    replaceUppercase: function(str) {
        return '-' + str.toLowerCase();
    },

    cssRegex: /[A-Z]/g,

    cssTypes: {
        point: {
            markerLineColor: '#FFF',
            markerLineWidth: '1.5',
            markerLineOpacity: '1',
            markerFillOpacity: '0.9',
            markerPlacement: 'point',
            markerType: 'ellipse',
            markerFill: '#FF6600',
            markerWidth: '10',
            markerAllowOverlap: true
        },
        line: {
            lineColor: '#FFF',
            lineWidth: '1',
            lineOpacity: '0.5',
            lineCompOp: 'soft-light'
        },
        polygon: {
            polygonFill: '#374C70',
            polygonOpacity: '0.9',
            polygonGamma: '0.5',
            lineColor: '#FFF',
            lineWidth: '1',
            lineOpacity: '0.5',
            lineCompOp: 'soft-light'
        },
        intensity: {
            markerFill: '#FFCC00',
            markerWidth: '10',
            markerLineColor: '#FFF',
            markerLineWidth: '1',
            markerLineOpacity: '1',
            markerFillOpacity: '0.9',
            markerCompOp: 'multiply',
            markerType: 'ellipse',
            markerPlacement: 'point',
            markerAllowOverlap: true,
            markerClip: false,
            markerMultiPolicy: 'largest'
        },
        heatmap: {
            Map: {
                torqueFrameCount: 1,
                torqueAnimationDuration: 10,
                torqueTimeAttribute: '"contrdated"',
                torqueAggregationFunction: '"count(cartodb_id)"',
                torqueResolution: 8,
                torqueDataAggregation: 'linear'
            },

            imageFilters: 'colorize-alpha(blue, cyan, lightgreen, yellow , orange, red)',
            markerFile: 'url(http://s3.amazonaws.com/com.cartodb.assets.static/alphamarker.png)',
            markerFillOpacity: '0.4*[value]',
            markerWidth: 35,
            case: [{
                condition: 'frame-offset=1',
                markerWidth: 37,
                markerFillOpacity: 0.2,
            }, {
                condition: 'frame-offset=2',
                markerWidth: 39,
                markerFillOpacity: 0.1
            }]
        }
    }
});