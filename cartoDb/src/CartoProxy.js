Ext.define('CartoDb.CartoProxy', {
    extend: 'Ext.data.proxy.Ajax',
    alias: 'proxy.carto',
    mixins: [
        'CartoDb.CartoSqlMixin'
    ],
    alternateClassName: ['CartoDb.CartoProxy.CartoAjax'],

    reader: {
        type: 'json',
        rootProperty: 'rows',
        totalProperty: 'total_rows'
    },

    config: {
        url: "https://{{account}}.carto.com/api/v2/sql",
        table: '',
        select: '',
        groupBy: '',
        orderBy: '',
        username: '',
        enableData: true
    },

    getCartoSql: function() {

    },

    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will add the
     * cache-buster param to the end of the url. Subclasses may need to perform additional modifications to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        console.log("here")
        // var queryParams = this.getQueryParams();
        var url = this.getUrl();
        url = url.replace(/{{account}}/, this.getUsername());
        // url += '?q=' + this.sqlBuilder2_0( this.getQueryParams(request) );
        if (this.getNoCache()) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", this.getCacheString(), Ext.Date.now()));
        }
        console.log(url);
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
            initialParams = Ext.apply({}, operation.getParams()),
            // Clone params right now so that they can be mutated at any point further down the call stack
            // params = Ext.applyIf(initialParams, me.getExtraParams() || {}),
            request, operationId, idParam;
        //copy any sorters, filters etc into the params so they can be sent over the wire
        // Ext.applyIf(params, me.getParams(operation));

        var params = {
            q: this.sqlBuilder2_0( Ext.apply({
                table: this.config.table,
                enableBounds: this.enableBounds
            }, me.getParams(operation) )) 
        }

console.log(q);

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

    // getQueryParams: function(request){
    //     console.log("here2")
    //     debugger;
    //     var params     = {};
    //     params.select  = this.getSelect();
    //     params.table   = this.getTable();
    //     params.groupBy = this.getGroupBy();
    //     params.orderBy = this.getOrderBy();
    //     Ext.merge(params, this.getExtraParams());
    //     return params;
    // },

    getParams: function(operation) {
        debugger;
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
                params[groupParam] = me.encodeSorters([
                    grouper
                ], true);
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
            params[filterParam] = me.encodeFilters(filters);
        }
        return params;
    }

});