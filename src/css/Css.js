Ext.define('Carto.css.Css', {
    alias: 'cartocss.shell',

    mixins: [
        'Ext.mixin.Factoryable'
    ],

    factoryConfig: {
        type: 'cartocss',
        defaultType: 'shell'
    },

    config: {
        value: {}
    },

    isCartoCss: true,

    constructor: function(cfg) {
        this.initConfig(cfg);
        return this;
    },

    applyValue: function(newValue, oldValue) {
        if (oldValue) {
            newValue = Ext.apply(oldValue, newValue);
        }
        return newValue;
    },

    updateValue: function(value) {
        this.createCssString();
    },
    
    createCssString: function(obj) {
        var isCase = obj !== undefined,
            obj = isCase ? obj : this.getValue(),
            str = '',
            table, k, i;
        
        if (!obj) {
            return '';
        }
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
                for (i in obj[k]) {
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
                str += this.parseCss(k, true) + ':' + obj[k] + ';';
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

    parseCss: function(str, prefix) {
        return (prefix ? '-' : '') + str.replace(this.cssRegex, this.replaceUppercase);
    },

    replaceUppercase: function(str) {
        return '-' + str.toLowerCase();
    },

    cssRegex: /[A-Z]/g
});