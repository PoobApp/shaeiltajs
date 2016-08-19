var sql = require('mysql');
var fs = require('fs');
var pools = {};
var globalPool = {};

var model = {
    addServer : function (configData,sqlPath,isGlobal)
    {
        configData.multipleStatements =  true
        var server = {
            pool : sql.createPool(configData),
            sqlPath : sqlPath.toString() + '/',
            fileQuery : function(path,data,cb){
                if(cb)
                    this.doQuery(path,[],cb)
                else
                    this.doQuery(path,data,cb)
            },
            doQuery : function(path,data,cb){
                var that = this;
                var filePath = path.charAt(0)!='%' ? this.sqlPath + path : path;
                
                fs.readFile(filePath,"utf-8",function(err,sqls)
                {
                    if(err) return cb(err)
                    that.pool.query(sqls.toString(),data,cb)
                })
            },
            query : function(x,y,z){
                this.pool.query(x,y,z);
            }
        };
        
        var conName = configData.Name || configData.host.replace(/\./g,'_') + '_' + configData.database + '_' + configData.user
        pools[conName] = server;
        
        if(isGlobal)
            globalPool = server;
    },
    getSevrer : function (serverName)
    {
        var selectedPool = pools[serverName] || globalPool
        
        if(!selectedPool)
            throw {error:'No such connection'}
        
        this.selectedPool = selectedPool;
    },
    getGlobalSevrer : function ()
    {
        var selectedPool = globalPool
        
        if(!selectedPool)
            throw {error:'No such connection'}
        
        this.selectedPool = selectedPool;
    }
}
module.exports = model;