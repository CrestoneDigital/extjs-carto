Ext.define('Carto.CartoCss', {
    isCartoCss: true,

    constructor: function(cfg) {
        if (typeof cfg === 'string') {
            this.cssString = cfg;
        } else {
            var cfg = cfg || {},
                type = cfg.type;
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
            table, str, k, i;
        if (isCase) {
            str = '[' + obj.condition + ']{';
        } else {
            table = 'layer';
            str = '#' + table + '{';
        }
        for (k in obj) {
            if (k === 'case') {
                if (!Ext.isArray(obj[k])) {
                    obj[k] = [obj[k]];
                }
                for (var i in obj[k]) {
                    str += this.createCssString(obj[k][i]);
                }
            } else if (k === 'condition') {

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
        }
    }
});