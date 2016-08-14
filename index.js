var sql = require('mysql');
var fs = require('fs');

var model = {
    config : function (configData,sqlPath)
    {
        configData.multipleStatements =  true
        this.pool = sql.createPool(configData);
        this.sqlPath = sqlPath.toString() + '/'
    },
    query : function(path,data,cb)
    {
        if(cb)
            this.doQuery(path,[],cb)
        else
            this.doQuery(path,data,cb)
    },
    doQuery : function(path,data,cb)
    {
        var that = this;
        fs.readFile(this.sqlPath + path,"utf-8",function(err,sqls)
        {
            if(err) return cb(err)
            that.pool.query(sqls.toString(),data,cb)
        })
    }
}
module.exports = model;