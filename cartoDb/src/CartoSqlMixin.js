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
    sqlBuilder2_0: function (params) {
        debugger;
        var fields = '*';
        if (Ext.isArray(params.select)) {
            fields = params.select.join(',');
        }

        var sql = 'SELECT ' + fields + ' FROM ' + params.table + ' WHERE 1 = 1 ';
        sql += this.whereClauseBuilder2_0(params);
        return sql;
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
        // if(params.start){
        //     sql += " AND start_date <= '" + params.end + "' ";
        // }
        // if(params.end){
        //     sql += " AND end_date <= '" + params.end + "' ";
        // }
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
        if(params.mapLock && params.bounds){
            sql += 'AND (the_geom && ST_MakeEnvelope(' + params.bounds._northEast.lng + ',' + 
                                                         params.bounds._northEast.lat + ',' + 
                                                         params.bounds._southWest.lng + ',' + 
                                                         params.bounds._southWest.lat + ', 4326)) ';
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
        if(groupBy && typeof groupBy === 'string'){
            sql += " Group By " + groupBy;
        }
        if(orderBy && typeof orderBy === 'object'){
            sql += ' Order By ' + orderBy.field + " " + orderBy.dir;
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
            if(this.verifyGroupBY()){
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
    
    
    verifyGroupBY: function(){
        return true;
    },


    verifyOrderBy: function(){
        return true;
    }
});