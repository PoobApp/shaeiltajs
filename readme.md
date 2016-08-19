# Shailta.JS
### Node.js warper for mysql Coection managing and singale toning.
By Dor Shay (Poob)

## Initalize:
```
var config = {
    "connectionLimit" : 5,
    "host" : "127.0.0.1",
	"user" : "root",
	"password" : "pwd",
	"database" : "blabla"
};

var shaeilta = require("shaeiltajs");
var psql = shaeilta.addServer(config.sql,__dirname + '/sql',true)
```

## Unsing:
```
psql.fileQuery('dashbord/load.sql',function(err,data)
{
    if(err) throw err
    res.json(data)
})

psql.query('select 1 as test',function(err,data)
{
    if(err) throw err
    res.json(data)
})
```

## Using pool from another file
* Need to add server naming to readme
```
var server = shaeilta.getSevrer('serverName')
// Or get server defiend as global
var server = shaeilta.getGlobalSevrer()
```

dor@poob.me