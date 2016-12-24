var sql = require('mysql');
var fs = require('fs');
var pools = {};
var globalPool = {};
var q = require('q');
var Handlebars = require('handlebars');
var mapObjectRecursive = require('map-object-recursive');

var model = {
    addServer : function (configData,sqlPath,isGlobal)
    {
        configData.multipleStatements =  true
        var server = {
            pool : sql.createPool(configData),
            sqlPath : sqlPath ? sqlPath.toString() + '/' : '',
            fileQuery : function(path,data,cb){
                if(!!data)
                    return this.doQuery(path,data,cb)
                else
                    return this.doQuery(path,[],cb)
            },
            doQuery : function(path,data,cb){
                var that = this;
                var filePath = path.charAt(0)!='%' ? this.sqlPath + path : path.substr(1,path.length);
                var deferred = q.defer();

                fs.readFile(filePath,"utf-8",function(err,sqls)
                {
                    if(err) return cb(err)

                    if(!cb) {
                      cb = (err,results) => {
                        if(err) return deferred.reject(err)
                        deferred.resolve(results);
                      }
                    }

                    if(Object.prototype.toString.call( data ) === '[object Array]') {
                      sqls = sqls.toString()
                    } else {
                      try {
                        var template = Handlebars.compile(sqls.toString())
                        mapObjectRecursive(data,function (key, value, object) {
                          return [key, that.pool.escape(value) ];
                        })
                        sqls  = template(data)
                        data = []
                      } catch(e) {
                        console.log(e)
                      }
                    }

                    that.pool.query(sqls,data,cb)
                })
                return deferred.promise;
            },
            query : function(x,y,z){
                var deferred = q.defer();
                this.pool.query(x,y,sqlDone);

                function sqlDone(err,results) {
                  if(err)
                    deferred.reject(err)
                  else
                    deferred.resolve(results)
                  if(z) z(err,results);
                }

                return deferred.promise;
            }
        };

        var conName = configData.name || configData.host.replace(/\./g,'_') + '_' + configData.database + '_' + configData.user
        pools[conName] = server;

        if(isGlobal)
            globalPool = server;

        return server;
    },
    getSevrer : function (serverName)
    {
        var selectedPool = pools[serverName] || globalPool

        if(!selectedPool)
            throw {error:'No such connection'}

        return selectedPool;
    },
    getGlobalSevrer : function ()
    {
        var selectedPool = globalPool

        if(!selectedPool)
            throw {error:'No such connection'}

        return selectedPool;
    }
}
module.exports = model;
