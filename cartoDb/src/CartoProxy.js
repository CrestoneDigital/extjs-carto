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
        where: {},
        groupBy: null,
        orderBy: '',
        username: '',
        mode: null,
        mapLock: false,
        enableData: true,
        enableBounds: false,
        enableLatLng: false,
        limit: null
    },

    /**
     * Adds a field to the proxy's {@link CartoDb.CartoGroupBy}. This will create a groupBy object if one does not exist.
     * @param  {Ext.data.field.Field/Object} field
     */
    addGroupByField: function(field) {
        var groupBy = this.getGroupBy();
        if (!groupBy) {
            groupBy = Ext.create('CartoDb.CartoGroupBy', field);
        } else {
            groupBy.addField(field);
        }
        this.setGroupBy(groupBy);
    },

    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will add the
     * cache-buster param to the end of the url. Subclasses may need to perform additional modifications to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        var url = this.getUrl();
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
            request, operationId, idParam, sql;
        switch (this.getMode()) {
            case 'tables': sql = this.getTablesSql; break;
            case 'columns': sql = this.getColumnsSql.replace(/{{table_name}}/g, this.getTable()); break;
            default: sql = this.sqlBuilder( Ext.apply(me.getParams(operation), this.getCurrentConfig()) );
        }
        var params = {
            q: sql
        };

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
    }

});