Ext.define('CartoDb.CartoSqlMixin', {

    requires: [
        'CartoDb.CartoGroupBy'
    ],
     
     /**
     * @param  {} table
     */
    sqlBuilder: function (table, params) {
        var sql = 'Select * FROM ' + table + ' Where 1 = 1 ';
        sql += this.whereClauseBuilder(params);
        return sql;
    },

     /**
     * @param  {} table
     */
    sqlBuilder2_0: function (params, options) {
        // debugger
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

        // var sql = 'SELECT ' + fields + ' FROM ' + params.table + ' WHERE 1 = 1 ';
        // sql += this.whereClauseBuilder2_0(params);
        // sql += this.getFilter(params);
        // sql += this.getBounds(params);
        // sql += this.getOrder(params);
        // sql += this.getPaging(params);
        var sql = 'SELECT ' + fields + ' FROM ' + params.table + ' Where 1=1 ';
        sql += this.whereClauseBuilder3_0(params.where);
        sql += this.getFilter(params);
        sql += this.getGroupByIfExists(groupBy);
        // sql += this.getBounds(params);
        sql += this.getOrder(params);
        sql += this.getPaging(params);
        return sql;
    },

    getTablesSql: "SELECT CDB_UserTables('public') AS table_name",
    getColumnsSql: "SELECT column_name, CDB_ColumnType('{{table_name}}', column_name) AS column_type FROM CDB_ColumnNames('{{table_name}}') AS column_name",

    getFilter: function(params) {
        var str = '';
        var tmpAr = (typeof params.filter === 'string') ? Ext.JSON.decode(params.filter) : params.filter;
        if (tmpAr && tmpAr.length > 0) {
            tmpAr.forEach(function(rec) {
                if (rec.property && rec.value) {
                    var operator = (rec.operator) ? rec.operator : '=';
                    switch(operator) {
                        case 'like':
                            str += ' AND ' + rec.property + ' ' + operator + " '" + rec.value + "%' ";
                            break;
                        case '=':
                            str += ' AND ' + rec.property + ' ' + operator + " '" + rec.value + "' ";
                            break;
                        case 'lt':
                            if(typeof rec.value === 'string'){
                                str += ' AND ' + rec.property + '::date  ' + " < '" + rec.value + "'";
                            }else{
                                str += ' AND ' + rec.property + ' ' + " < " + rec.value;
                            }       
                            break;
                        case 'gt':
                            if(typeof rec.value === 'string'){
                                str += ' AND ' + rec.property + '::date  ' + " > '"  + rec.value + "'::date";
                            }else{
                                str += ' AND ' + rec.property + ' ' + " > "  + rec.value;
                            }
                            break;
                        case 'eq':
                            if(typeof rec.value === 'string'){
                                str += ' AND ' + rec.property + '::date  ' + " = '"  + rec.value + "'::date";
                            }else{
                                str += ' AND ' + rec.property + ' ' + " = "  + rec.value;
                            }
                            break;
                        case 'in':
                            if(Ext.isArray(rec.value)) {
                                var temp = rec.value.slice();
                                for (var i = 0; i < temp.length; i++) temp[i] = this.wrap(temp[i]);
                                str += ' AND ARRAY[' + rec.property + '] <@ ARRAY[' + temp.join(',') + ']';
                            }
                            break;
                            // return '1'
                    }
                } else if (rec.property && rec.operator) {
                    switch (rec.operator) {
                        case 'notnull':
                            str += ' AND ' + rec.property + ' IS NOT NULL';
                            break;
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
        // debugger
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

    whereClauseBuilder3_0: function(where, prefix) {
        var wheres = this.whereClauseLoop(where, prefix);
        if (wheres.length > 0) {
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
                wheres.push(pref + check + " = " + this.wrap(obj));
            } else if (obj instanceof Array && obj.length > 0) {
                var temp = obj.slice();
                for (var i = 0; i < temp.length; i++) temp[i] = this.wrap(temp[i]);
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
                    wheres.push(pref + check + ' >= ' + this.wrap(obj.start));
                }
                if (obj.end) {
                    wheres.push(pref + check + ' <= ' + this.wrap(obj.end));
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
    wrap: function(obj) {
        return (typeof obj === 'string') ? "'" + obj + "'" : obj;
    },
    
    verifyGroupBy: function(){
        return true;
    },

    verifyOrderBy: function(){
        return true;
    },

    // createGroupBy: function(group) {
    //     // if (!group || group.isGroupBy) {
    //     //     return group;
    //     // }
    //     // if (typeof group === 'string' || Ext.isArray(group)) {
    //     //     group = {fields: group};
    //     // }
    //     // var fields = group.fields = Ext.isArray(group.fields) ? group.fields : [group.fields],
    //     //     field, selectSql = '', groupBySql = '';
    //     // for (var i = 0; i < fields.length; i++) {
    //     //     field = new Ext.data.field.Field(fields[i]);
    //     //     if (!field.property) {
    //     //         field.sql = this.wrapAggregate(field);
    //     //     } else {
    //     //         field.sql = this.wrapAggregate(field) + ' AS ' + field.name;
    //     //     }
    //     //     selectSql += field.sql + ',';
    //     //     if (!field.aggregateType) {
    //     //         groupBySql += field.name + ',';
    //     //     }
    //     //     fields[i] = field;
    //     // }
    //     // group.selectSql = selectSql.slice(0,-1);
    //     // group.groupBySql = groupBySql.slice(0,-1);
    //     // group.isGroupBy = true;
    //     // return group;
    // },

    // wrapAggregate: function(field) {
    //     if (field.aggregateType) {
    //         field.aggregateType = field.aggregateType.toUpperCase();
    //         if (this.allowedAggregateTypes.indexOf(field.aggregateType) === -1) {
    //             console.warn("Unknown aggregate type '" + field.aggregateType + "'. Skipping.");
    //             field.aggregateType = null;
    //         } else {
    //             return field.aggregateType + '(' + (field.property || field.name) + ')';
    //         }
    //     }
    //     return field.property || field.name;
    // },

    // allowedAggregateTypes: ['AVG', 'SUM', 'COUNT', 'MIN', 'MAX', 'STDDEV']
});