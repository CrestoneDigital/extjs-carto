Ext.define('Carto.CartoProxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.carto',

    requires: [
        'Carto.sql.CartoTable'
    ],
    mixins: [
        'Carto.CartoSqlMixin'
    ],
    alternateClassName: ['Carto.CartoProxy.CartoAjax'],

    reader: {
        type: 'json',
        rootProperty: 'rows',
        totalProperty: 'total_rows'
    },

    config: {
        url: "https://{{account}}.carto.com/api/v2/sql",
        apiKey: null,
        table: '',
        select: '',
        join: [],
        where: {},
        groupBy: null,
        orderBy: '',
        username: '',
        mode: null,
        sqlCacheBuster: false,
        mapLock: false,
        enableData: true,
        enableBounds: false,
        enableLatLng: false,
        limit: null,
        subLayers: []
    },

    /**
     * @private
     * Copy any sorters, filters etc into the params so they can be sent over the wire
     */
    getParams: function(operation) {
        if (!operation.isReadOperation) {
            return {};
        }
 
        var me = this,
            params = {},
            grouper = operation.getGrouper(),
            sorters = operation.getSorters(),
            filters = operation.getFilters(),
            page = operation.getPage(),
            start = operation.getStart(),
            limit = operation.getLimit(),
            simpleSortMode = me.getSimpleSortMode(),
            simpleGroupMode = me.getSimpleGroupMode(),
            pageParam = me.getPageParam(),
            startParam = me.getStartParam(),
            limitParam = me.getLimitParam(),
            groupParam = me.getGroupParam(),
            groupDirectionParam = me.getGroupDirectionParam(),
            sortParam = me.getSortParam(),
            filterParam = me.getFilterParam(),
            directionParam = me.getDirectionParam(),
            hasGroups, index;
 
        if (pageParam && page) {
            params[pageParam] = page;
        }
 
        if (startParam && (start || start === 0)) {
            params[startParam] = start;
        }
 
        if (limitParam && limit) {
            params[limitParam] = limit;
        }
 
        hasGroups = groupParam && grouper;
        if (hasGroups) {
            // Grouper is a subclass of sorter, so we can just use the sorter method 
            if (simpleGroupMode) {
                params[groupParam] = grouper.getProperty();
                params[groupDirectionParam] = grouper.getDirection();
            } else {
                params[groupParam] = me.encodeSorters([grouper], true);
            }
        }
 
        if (sortParam && sorters && sorters.length > 0) {
            if (simpleSortMode) {
                index = 0;
                // Group will be included in sorters, so grab the next one 
                if (sorters.length > 1 && hasGroups) {
                    index = 1;
                }
                params[sortParam] = sorters[index].getProperty();
                params[directionParam] = sorters[index].getDirection();
            } else {
                params[sortParam] = me.encodeSorters(sorters);
            }
 
        }

        if (filterParam && filters && filters.length > 0) {
            // We do not want to send the filters as a parameter, as they will be added into the query
            params.filter = filters;
        }
 
        return params;
    },

    joinTable: function(joinTable) {
        if (!joinTable.table.isCartoTable) {
            joinTable.table = Ext.create('Carto.sql.CartoTable', joinTable.table);
        }
        this.getJoin().push(joinTable);
    },

    removeJoin: function(joinName) {
        var join = this.getJoin(),
            j;
        for (var i in join) {
            j = join[i];
            if (j.table.getId() === joinName) {
                delete join.splice(i, 1);
            }
        }
    },

    /**
     * Adds a field to the proxy's {@link Carto.CartoGroupBy}. This will create a groupBy object if one does not exist.
     * @param  {Ext.data.field.Field/Object} field
     */
    addGroupByField: function(field) {
        var groupBy = this.getGroupBy();
        if (!groupBy) {
            groupBy = Ext.create('Carto.CartoGroupBy', field);
        } else {
            groupBy.addField(field);
        }
        this.setGroupBy(groupBy);
    },

    addSubLayer: function(subLayer, load) {
        subLayer.setTable(this.getTable().getId());
        subLayer.getLayer().setUsername(this.getUsername());
        this.subLayers.push(subLayer);
        if (load && this._cachedSql) {
            subLayer.create(this._cachedSql);
        }
    },

    setSql: function(sql) {
        this.sql = sql;
    },

    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will add the
     * cache-buster param to the end of the url. Subclasses may need to perform additional modifications to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var url = this.getUrl();
        if (this.useCartoDb) {
            url = "https://{{account}}.cartodb.com/api/v2/sql";
        }
        url = url.replace(/{{account}}/, this.getUsername());
        if (this.getNoCache()) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", this.getCacheString(), Ext.Date.now()));
        }
        return url;
    },

    /**
     * Creates an {@link Ext.data.Request Request} object from {@link Ext.data.operation.Operation Operation}.
     *
     * This gets called from doRequest methods in subclasses of Server proxy.
     * 
     * @param {Ext.data.operation.Operation} operation The operation to execute
     * @return {Ext.data.Request} The request object
     */
    buildRequest: function(operation) {
        var me = this,
            subLayers = this.getSubLayers(),
            sqlParams = Ext.apply(me.getParams(operation), this.getCurrentConfig()),
            request, operationId, idParam, sql;
        switch (this.getMode()) {
            case 'tables': sql = this.getTablesSql; break;
            case 'columns': sql = this.getColumnsSql.replace(/{{table_name}}/g, this.getTable()); break;
            default: sql = this.sql ? this.sqlFormatter(this.sql, sqlParams) : this.sqlBuilder(sqlParams);
        }
        var params = {
            q: sql
        };
        if (this.getApiKey()) {
            params.api_key = this.getApiKey();
        }
        if (subLayers.length) {
            sql = this.sql ? sql : this.sqlBuilder(sqlParams, {isMap: true});
            if (sql !== me._cachedSql) {
                subLayers.forEach(function(subLayer) {
                    subLayer.create(sql);
                });
            }
        }
        me._cachedSql = sql;

        // Set up the entity id parameter according to the configured name.
        // This defaults to "id". But TreeStore has a "nodeParam" configuration which
        // specifies the id parameter name of the node being loaded.
        operationId = operation.getId();
        idParam = me.getIdParam();
        if (operationId !== undefined && params[idParam] === undefined) {
            params[idParam] = operationId;
        }
        request = new Ext.data.Request({
            params: params,
            action: operation.getAction(),
            records: operation.getRecords(),
            url: operation.getUrl(),
            operation: operation,
            // this is needed by JsonSimlet in order to properly construct responses for
            // requests from this proxy
            proxy: me
        });
        request.setUrl(me.buildUrl(request));
        /*
         * Save the request on the Operation. Operations don't usually care about Request and Response data, but in the
         * ServerProxy and any of its subclasses we add both request and response as they may be useful for further processing
         */
        operation.setRequest(request);
        return request;
    },

    doRequest: function(operation) {
        var me = this,
            writer  = me.getWriter(),
            request = me.buildRequest(operation),
            method  = me.getMethod(request),
            jsonData, params;
        
        // EDIT
        // If the onlyTiles flag is enabled, then buildRequest has done all the work we needed done.
        if (operation.onlyTiles) {
            return null;
        }
        // END EDIT

        if (writer && operation.allowWrite()) {
            request = writer.write(request);
        }
        
        request.setConfig({
            binary              : me.getBinary(),
            headers             : me.getHeaders(),
            timeout             : me.getTimeout(),
            scope               : me,
            callback            : me.createRequestCallback(request, operation),
            method              : method,
            useDefaultXhrHeader : me.getUseDefaultXhrHeader(),
            disableCaching      : false // explicitly set it to false, ServerProxy handles caching 
        });
        
        if (method.toUpperCase() !== 'GET' && me.getParamsAsJson()) {
            params = request.getParams();
 
            if (params) {
                jsonData = request.getJsonData();
                if (jsonData) {
                    jsonData = Ext.Object.merge({}, jsonData, params);
                } else {
                    jsonData = params;
                }
                request.setJsonData(jsonData);
                request.setParams(undefined);
            }
        }
        
        if (me.getWithCredentials()) {
            request.setWithCredentials(true);
            request.setUsername(me.getUsername());
            request.setPassword(me.getPassword());
        }
        return me.sendRequest(request);
    },

    updateUsername: function(username) {
        this.getSubLayers().forEach(function(subLayer) {
            subLayer.getLayer().setUsername(username);
        });
    },

    setTable: function(table) {
        if (!table.isCartoTable) {
            table = Ext.create('Carto.sql.CartoTable', table);
        }
        this.callParent([table]);
        this.getSubLayers().forEach(function(subLayer) {
            subLayer.setTable(table.getId());
        });
    }

});