Ext.define('CartoDb.CartoFilter', {
    extend: 'Ext.util.Filter',

    config: {
        sql: '',
        negate: false
    },

    initConfig: function(config) {
        this.callParent(arguments);
        if (!this.getSql() && !this.getFilterFn()) {
            this.createSql();
        }
    },

    createSql: function() {
        var me = this,
            property = me.getProperty(),
            value = me.getValue(),
            operator = me.getOperator() || '=',
            negate = me.getNegate(),
            caseSensitive = me.caseSensitive;
        
        if (property && value) {
            if (value instanceof RegExp) {
                operator = '~';
                value = value.toString().slice(1);
                while (!value.endsWith('/')) {
                    if (value.slice(-1) === 'i') {
                        caseSensitive = false;
                    }
                    value = value.slice(0,-1);
                }
                if (!caseSensitive) {
                    operator += '*';
                }
                value = value.slice(0,-1);
            } else {
                switch(operator) {
                    case 'like':
                    case '<':
                    case '<=':
                    case '>':
                    case '>=':
                    case '=':
                    case '!=':
                        break;
                    case 'lt':
                        operator = '<';
                        break;
                    case 'lte':
                        operator = '<=';
                        break;
                    case 'gt':
                        operator = '>';
                        break;
                    case 'gte':
                        operator = '>=';
                        break;
                    case 'eq':
                        operator = '='
                        break;
                    case 'in':
                        if(Ext.isArray(value)) {
                            var temp = value.slice();
                            for (var i = 0; i < temp.length; i++) temp[i] = this.wrap(temp[i]);
                            property = 'ARRAY[' + property + ']';
                            operator = '<@';
                            value = 'ARRAY[' + temp + ']';
                        }
                        break;
                    case 'regex':
                        var validRegExp = true;
                        try {
                            new RegExp(value);
                        } catch (e) {
                            validRegExp = false;
                        }
                        if (validRegExp) {
                            operator = caseSensitive ? '~' : '~*';
                        } else {
                            console.error("Invalid Regular Expression '" + value + "'. Skipping.");
                            return;
                        }
                        break;
                    default:
                        console.warn("Unknown operator '" + operator + "'.");
                }
            }
            return (negate ? 'NOT ' : '') + property + operator + me.wrap(value);
        }
    }
});