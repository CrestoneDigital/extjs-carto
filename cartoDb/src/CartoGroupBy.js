Ext.define('CartoDb.CartoGroupBy', {
    isGroupBy: true,

    config: {
        fields: null
    },

    constructor: function(config) {
        this.initConfig(config);
    },

    initConfig: function(config) {
        var groupBy = this.decodeGroupBy(config);
        this.callParent();
        this.setFields(groupBy.fields);
    },

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

    getSelectSql: function() {
        return Ext.pluck(this.getFields(), 'sql').join(',');;
    },

    getGroupBySql: function() {
        var sql = '',
            fields = this.getFields();
        for (var i in fields) {
            sql += fields[i].aggregateType ? '' : fields[i].name + ',';
        }
        return sql.slice(0,-1);
    },

    decodeGroupBy: function(groupBy) {
        if (groupBy.isGroupBy) {

        } else {
            if (!groupBy.fields) {
                groupBy = {fields: groupBy};
            }
            var fields = groupBy.fields = Ext.isArray(groupBy.fields) ? groupBy.fields : [groupBy.fields],
                field;
            for (var i = 0; i < fields.length; i++) {
                fields[i] = this.decodeField(fields[i]);
            }
        }
        return groupBy;
    },

    decodeField: function(field) {
        if (!field.isField) {
            field = new Ext.data.field.Field(field);
            if (!field.property) {
                field.sql = this.wrapAggregate(field);
            } else {
                field.sql = this.wrapAggregate(field) + ' AS ' + field.name;
            }
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