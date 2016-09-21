Ext.define('CartoDb.CartoSqlMixin', {
     
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
        var fields = '*';
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
        var sql = 'SELECT ' + fields + ' FROM ' + params.table;
        sql += this.whereClauseBuilder3_0(params.where);
        // console.log(sql);
        return sql;
    },

    getFilter: function(params) {
        var str = '';
        var tmpAr = Ext.JSON.decode(params.filter);
        if (tmpAr && tmpAr.length > 0) {
            tmpAr.forEach(function(rec) {
                if (rec.property && rec.operator && rec.value) {
                    switch(rec.operator) {
                        case 'like':
                            str += ' AND ' + rec.property + ' ' + rec.operator + " '" + rec.value + "%' ";
                        case '=':
                            return '1'
                    }
                }
                return '';
            });
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
     * @param  {} params
     * @param  {} noNull
     * @param  {} groupBy
     */
    whereClauseBuilder: function (params, noNull, groupBy, orderBy) {
        var sql = '';
        if(params.start && params.end){
            sql += " AND start_date <= '" + params.end + "' AND end_date >= '" + params.start + "' ";
        }else if(params.end){
            sql += " AND start_date <= '" + params.end + "' ";
        }else if(params.start){
            sql += " AND end_date >= '" + params.start + "' ";
        }

        if(params.type && params.type.length > 0){
            sql += "AND (";
            var typesArray = [];
            params.type.forEach(function(item) {
                typesArray.push(" project__1 = '" + item + "' ");    
            }, this);
            sql += typesArray.join(' OR ');
            sql += ")";
        }
        if(params.region && params.region.length > 0){
            sql += "AND (";
            var regionArray = [];
            params.region.forEach(function (item) {
                regionArray.push(" project_co = '" + item + "' ");    
            });
            sql += regionArray.join(' OR ');
            sql += ")";
        }

        if(noNull && noNull.length > 0 ){
            sql += "AND (";
            var noNullArray = [];
            noNull.forEach(function (item) {
                noNullArray.push("'" + item + "' IS NOT NULL ");    
            });
            sql += noNullArray.join(' AND ');
            sql += ")";
        }
        return sql;
    },


    whereClauseBuilder2_0: function(params) {
        var whereClause = '';
        

        if(params.start && params.end){
            whereClause += " AND start_date <= '" + params.end + "' AND end_date >= '" + params.start + "' ";
        }else if(params.end){
            whereClause += " AND start_date <= '" + params.end + "' ";
        }else if(params.start){
            whereClause += " AND end_date >= '" + params.start + "' ";
        }
        if(params.type && params.type.length > 0){
            whereClause += "AND (";
            var typesArray = [];
            params.type.forEach(function(item) {
                typesArray.push(" project__1 = '" + item + "' ");    
            }, this);
            whereClause += typesArray.join(' OR ');
            whereClause += ")";
        }
        if(params.region && params.region.length > 0){
            whereClause += "AND (";
            var regionArray = [];
            params.region.forEach(function (item) {
                regionArray.push(" project_co = '" + item + "' ");    
            });
            whereClause += regionArray.join(' OR ');
            whereClause += ")";
        }
        if(params.mapLock && params.bounds){
            whereClause += 'AND (the_geom && ST_MakeEnvelope(' + params.bounds._northEast.lng + ',' + 
                                                         params.bounds._northEast.lat + ',' + 
                                                         params.bounds._southWest.lng + ',' + 
                                                         params.bounds._southWest.lat + ', 4326)) ';
        }
        if(params.noNull && params.noNull.length > 0 ){
            whereClause += "AND (";
            var noNullArray = [];
            noNull.forEach(function (item) {
                noNullArray.push("'" + item + "' IS NOT NULL ");    
            });
            whereClause += noNullArray.join(' AND ');
            whereClause += ")";
        }
        if(params.groupBy) {
            if(this.verifyGroupBy()){
                whereClause += ' GROUP BY ' + params.groupBy[0] + " ";
            }
        }
        if(params.orderBy) {
            if(this.verifyOrderBy()){
                whereClause += ' ORDER BY ' + params.orderBy.items[0] + " " + params.orderBy.direction;
            }
        }
        return whereClause;

    },

    whereClauseBuilder3_0: function(where, prefix) {
        var wheres = this.whereClauseLoop(where, prefix);
        if (wheres.length > 0) {
            return ' WHERE ' + wheres.join(' AND ');
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
    }
});