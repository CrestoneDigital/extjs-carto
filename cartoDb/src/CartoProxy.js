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
        username: ''
    },
    /**
     * Generates a url based on a given Ext.data.Request object. By default, ServerProxy's buildUrl will add the
     * cache-buster param to the end of the url. Subclasses may need to perform additional modifications to the url.
     * @param {Ext.data.Request} request The request object
     * @return {String} The url
     */
    buildUrl: function(request) {
        console.log("here")
        var queryParams = this.getQueryParams();
        var url = this.getUrl();
        url = url.replace(/{{account}}/, this.getUsername());
        url += '?q=' + this.sqlBuilder2_0(this.getQueryParams());
        if (this.getNoCache()) {
            url = Ext.urlAppend(url, Ext.String.format("{0}={1}", this.getCacheString(), Ext.Date.now()));
        }
        return url;
    },

    getQueryParams: function(){
        console.log("here2")
        var params     = {};
        params.select  = this.getSelect();
        params.table   = this.getTable();
        params.groupBy = this.getGroupBy();
        params.orderBy = this.getOrderBy();
        Ext.merge(params, this.getExtraParams());
        return params;
    }

});