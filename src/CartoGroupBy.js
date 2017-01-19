Ext.define('Carto.CartoGroupBy', {
    isGroupBy: true,

    config: {
        fields: null,
        countName: 'cnt'
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    initConfig: function(config) {
        this.decodeGroupBy(config);
        this.callParent();
    },

    /**
     * Adds a field to the `fields` config.
     * @param  {Object} field
     */
    addField: function(field) {
        var fields = this.getFields(),
            alreadyExists = false;
        field = this.decodeField(field);
        for (var i in fields) {
            if (fields[i].name === field.name) {
                alreadyExists = true;
                fields[i] = field;
            }
        }
        if (!alreadyExists) {
            fields.push(field);
        }
        this.setFields(fields);
    },

    /**
     * Returns the comma-separated field's sql to be inserted in the SELECT statement.
     */
    getSelectSql: function() {
        return Ext.pluck(this.getFields(), 'sql').join(',');;
    },

    /**
     * Returns the comma-separated field's sql to be inserted in the GROUP BY statement.'
     */
    getGroupBySql: function() {
        var sql = '',
            fields = this.getFields();
        for (var i in fields) {
            sql += fields[i].aggregateType ? '' : fields[i].name + ',';
        }
        return sql.slice(0,-1);
    },

    /**
     * Creates this from the given config.
     * @param  {String/String[]/Object/Object[]} groupBy
     */
    decodeGroupBy: function(groupBy) {
        if (!groupBy.fields) {
            groupBy = {fields: groupBy};
        }
        var fields = Ext.isArray(groupBy.fields) ? groupBy.fields : [groupBy.fields],
            field;
        for (var i = 0; i < fields.length; i++) {
            fields[i] = this.decodeField(fields[i]);
        }
        this.setFields(fields);
        if (groupBy.countName) {
            this.setCountName(groupBy.countName);
        }
    },
    
    /**
     * Creates the {@link Ext.data.field.Field} from the given config.
     * @param  {String/Object/Ext.data.field.Field} field
     */
    decodeField: function(field) {
        if (!field.isField) {
            field = new Ext.data.field.Field(field);
        }
        if (!field.sql) {
            field.sql = this.wrapAggregate(field) + (field.property ? ' AS ' + field.name : '');
        }
        return field;
    },

    wrapAggregate: function(field) {
        if (field.aggregateType) {
            field.aggregateType = field.aggregateType.toUpperCase();
            if (this.allowedAggregateTypes.indexOf(field.aggregateType) === -1) {
                console.warn("Unknown aggregate type '" + field.aggregateType + "'. Skipping.");
                field.aggregateType = null;
            } else {
                return field.aggregateType + '(' + (field.property || field.name) + ')';
            }
        }
        return field.property || field.name;
    },

    allowedAggregateTypes: ['AVG', 'SUM', 'COUNT', 'MIN', 'MAX', 'STDDEV']
});