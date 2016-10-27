Ext.define('CartoDb.CartoSqlMixin', {

    requires: [
        'CartoDb.CartoGroupBy'
    ],

    /**
     * Builds the sql statement for Carto.
     * @param  {Object} params
     * @param  {Object} options
     */
    sqlBuilder: function (params, options) {
        var fields,
            groupBy = this.getGroupBy();
        if (groupBy) {
            if (!groupBy.isGroupBy) {
                groupBy = Ext.create('CartoDb.CartoGroupBy', params.groupBy);
                this.setGroupBy(groupBy);
            }
            fields = groupBy.getSelectSql() + ',COUNT(*) AS cnt';
        } else {
            fields = '*';
        }
        if (Ext.isArray(params.select)) {
            fields = params.select.join(',');
        }
        if (params.enableLatLng) {
            fields += ',ST_Y(the_geom) AS lat,ST_X(the_geom) AS lng';
        }
        if (options && options.extraSelect) {
            fields += ',' + options.extraSelect.join(',');
        }
        var sql = 'SELECT ' + fields + ' FROM ' + params.table + ' Where 1=1 ';
        sql += (options && options.isMap) ? '' : this.whereClauseBuilder(params.where);
        sql += this.getFilter(params);
        sql += this.getGroupByIfExists(groupBy);
        // sql += this.getBounds(params);
        sql += (options && options.isMap) ? '' : this.getOrder(params);
        sql += this.getPaging(params);
        return sql;
    },

    getTablesSql: "SELECT CDB_UserTables('public') AS table_name",
    getColumnsSql: "SELECT column_name, CDB_ColumnType('{{table_name}}', column_name) AS column_type FROM CDB_ColumnNames('{{table_name}}') AS column_name",

    /**
     * Creates the filter sql to be applied to the WHERE clause.
     * @param  {Object} params
     */
    getFilter: function(params) {
        var str = '',
            tmpAr = (typeof params.filter === 'string') ? Ext.JSON.decode(params.filter) : params.filter,
            property,
            value,
            operator;
        if (tmpAr && tmpAr.length > 0) {
            tmpAr.forEach(function(rec) {
                property = rec.getProperty();
                value = rec.getValue();
                operator = rec.getOperator();
                if (property && value) {
                    if (value instanceof RegExp) {
                        str += ' AND ' + property + " ~* '" + value.toString().slice(1,-1) + "'";
                    } else {
                        var operator = (operator) ? operator : '=';
                        switch(operator) {
                            case 'like':
                                str += ' AND ' + property + ' ' + operator + " '" + value + "%' ";
                                break;
                            case '=':
                                str += ' AND ' + property + ' ' + operator + " '" + value + "' ";
                                break;
                            case 'lt':
                                if(typeof value === 'string'){
                                    str += ' AND ' + property + '::date  ' + " < '" + value + "'";
                                }else{
                                    str += ' AND ' + property + ' ' + " < " + value;
                                }       
                                break;
                            case 'gt':
                                if(typeof value === 'string'){
                                    str += ' AND ' + property + '::date  ' + " > '"  + value + "'::date";
                                }else{
                                    str += ' AND ' + property + ' ' + " > "  + value;
                                }
                                break;
                            case 'eq':
                                if(typeof value === 'string'){
                                    str += ' AND ' + property + '::date  ' + " = '"  + value + "'::date";
                                }else{
                                    str += ' AND ' + property + ' ' + " = "  + value;
                                }
                                break;
                            case 'in':
                                if(Ext.isArray(value)) {
                                    var temp = value.slice();
                                    for (var i = 0; i < temp.length; i++) temp[i] = this.wrapString(temp[i]);
                                    str += ' AND ARRAY[' + property + '] <@ ARRAY[' + temp.join(',') + ']';
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
                                    str += ' AND ' + property + " ~* '" + value + "'";
                                } else {
                                    console.error("Invalid Regular Expression '" + value + "'. Skipping.");
                                }
                                break;
                            default:
                                console.warn("Unknown operator '" + operator + "'. Skipping.");
                        }
                    }
                } else if (property && operator && !rec.getDisableOnEmpty()) {
                    switch (operator) {
                        case 'notnull':
                            str += ' AND ' + property + ' IS NOT NULL';
                            break;
                        default:
                            console.warn("Unknown operator '" + operator + "'. Skipping.")
                    }
                }
                return '';
            }.bind(this));
        }
        return str;
    },

    getBounds: function(params) {
        var str = '';
        if (params.enableBounds && params.bounds){
            str = 'AND (the_geom && ST_MakeEnvelope(' + params.bounds._northEast.lng + ',' + 
                                                         params.bounds._northEast.lat + ',' + 
                                                         params.bounds._southWest.lng + ',' + 
                                                         params.bounds._southWest.lat + ', 4326)) ';
        }
        return str;
    },

    getGroupByIfExists: function(group) {
        if (group) {
            return ' GROUP BY ' + group.getGroupBySql(); 
        }
        return '';
    },

    getOrder: function(params) {
        var str = '';
        var tmpAr = Ext.JSON.decode(params.sort);
        if (tmpAr && tmpAr.length > 0) {
            str += ' ORDER BY';
            str += tmpAr.map(function(rec) {
                return ' ' + rec.property + ' ' + rec.direction;
            }).join(',');
        }
        return str;
    },

    getPaging: function( params ) {
        var str = '';
        if (params.limit) {
            str += ' LIMIT ' + params.limit
        }
        if (params.start) {
            str += ' OFFSET ' + params.start
        }
        return str; 
    },

    /**
     * Builds the WHERE clause.
     * @param  {Object} where - The config specifying the form of each WHERE statement.
     * @param  {String} prefix - The table prefix to be prepended to each WHERE statement.
     */
    whereClauseBuilder: function(where, prefix) {
        var wheres = this.whereClauseLoop(where, prefix);
        if (wheres.length) {
            return ' AND ' + wheres.join(' AND ');
        } else {
            return '';
        }
    },

    whereClauseLoop: function(params, prefix) {
        var wheres = [],
            pref = (prefix) ? prefix + '.' : '',
            obj;
        for (var check in params) {
            if (!(obj = params[check])) continue;
            if (['string','number'].indexOf(typeof obj) > -1) {
                wheres.push(pref + check + " = " + this.wrapString(obj));
            } else if (obj instanceof Array && obj.length > 0) {
                var temp = obj.slice();
                for (var i = 0; i < temp.length; i++) temp[i] = this.wrapString(temp[i]);
                wheres.push("ARRAY[" + pref + check + "] <@ ARRAY[" + temp.join(",") + "]");
            } else if (obj.type) {
                this.whereByType(wheres, check, obj, pref);
            }
        }
        return wheres;
    },

    whereByType: function(wheres, check, obj, pref) {
        switch (obj.type) {
            case 'static':
                if (obj.text) {
                    wheres.push(obj.text);
                }
                break;
            case 'range':
                if (obj.start) {
                    wheres.push(pref + check + ' >= ' + this.wrapString(obj.start));
                }
                if (obj.end) {
                    wheres.push(pref + check + ' <= ' + this.wrapString(obj.end));
                }
                break;
            case 'bounds':
                if (obj.bounds) {
                    wheres.push('(' + pref + 'the_geom && ST_MakeEnvelope(' +
                        obj.bounds._northEast.lng + ',' + 
                        obj.bounds._northEast.lat + ',' + 
                        obj.bounds._southWest.lng + ',' + 
                        obj.bounds._southWest.lat + ',4326))');
                }
                break;
        }
    },
    wrapString: function(obj) {
        return (typeof obj === 'string') ? "'" + obj + "'" : obj;
    },
    
    verifyGroupBy: function(){
        return true;
    },

    verifyOrderBy: function(){
        return true;
    }
});