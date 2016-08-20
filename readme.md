# Shailta.JS
### Node.js warper for mysql connection managing,singleton use of connection and query from files.
By Dor Shay (Poob)

## Initalize:
* sqlConfig : (Object) sql config data like in [Connection options](https://github.com/mysqljs/mysql#connection-options) and optinal server name.
* sqlFilesPath : (String) optinal default location for sql files.
* isGlobal : (Boolean) optinal.
```
var shaeilta = require("shaeiltajs");

var sqlConfig = {
    "connectionLimit" : 5,
    "host" : "127.0.0.1",
	"user" : "root",
	"password" : "pwd",
	"database" : "blabla",
	"name" : "billingDB"
};
var sqlFilesPath = __dirname + '/sql';
var isGlobal = true;

var psql = shaeilta.addServer(sqlConfig,sqlFilesPath,isGlobal)
```

## Unsing:
###query:
Simpale query like normal mysql.
```
* psql.query('select 1 as test',function(err,data)
{
    if(err) throw err
    res.json(data)
})
```
###fileQuery :
* Load sql from file, can be from givan path releative to path givin in addServer or start path with % will ignore default.
```
psql.fileQuery('loadTop20Custumers.sql',function(err,data)
{
    if(err) throw err
    res.json(data)
})
```

## Using pool from another file
* Need to add server naming to readme
```
var server = shaeilta.getSevrer('billingDB')
// Or get server defiend as global
var server = shaeilta.getGlobalSevrer()
```

dor@poob.me