# egads
Yet another extensible error library for node.js

*Extensible, Generic, Agnostic, Descriptive, Simple*

### Why this library?
There are tons of [alterntive libraries out there](https://www.npmjs.com/search?q=extend+error), however they didn't meet the feature set I wanted:

- Super tiny (under 40 lines!)
- Doesn't pollute global scope or mutate existing types
- Configurable and overwritable name, message, status, and custom fields
- Deep nesting. Each extended error can further extend
- Each error is an `instanceOf` all of it's parents, including the native `Error` type
- Don't _have_ to use the `new` keyword when throwing
- Can use a single object parameter or multiple parameters
- Can access the error stack, eg. `err.stack`

### How To Use

Install `npm install egads`


Define your errors.
```
//define your base error
var Err = require('egads').extend('Something done goofd', 500, 'GenericError');

//Extend it for cover you basic types
Err.auth = Err.extend('Unauthorized', 401, 'AuthError');

//Make specific errors
Err.auth.badToken = Err.auth.extend('Bad Auth Token');

//Use object parameters
Err.badInput = Err.extend({
    name : 'BadInputError',
    status : 400,
    fields : {
        shameOnYou : true
    }
})
```

Throw'em
```
try{
    throw new Err.auth.badToken();
}catch(err){
    err instanceof Error;             //true
    err instanceof Err.auth.badToken; //true
    err instanceof Err.auth;          //true!!!
​
    err.status; //401
    console.log(err.stack); //works
    console.log(err.toString()); // 'AuthError : Bad Auth Token'
}

//Overide it!
try{
    //Leave out the `new` if you want
    throw Err.auth({
        status : 418,
        name : 'TeapotError',
        message : 'Entity body may be short and/or stout',
        fields : {
            type : 'Earl Grey',
            temp : 'hot'
        }
    });
}catch(err){
    err instanceof Err.auth;     //true!
    err.fields.type;             // 'Earl Grey'
​    err.status;                  //418
    console.log(err.toString()); // 'TeapotError : Entity body may be short and/or stout'
}
```




### Express Handler

If you using [express](https://expressjs.com/) you can write a simple error handler for `egads` errors.

```
var app = require('express')();
var ApiError = require('egads');

var AuthError = ApiError.extend({
    status : 400,
    name : 'AuthError'
});

app.get('/:coolGuy', (req, res) => {
    if(!req.params.coolGuy) throw AuthError('not cool enough');
    return res.send('yo');
});

//Express Error Handler
app.use((err, req, res, next) => {
    if(err instanceof ApiError){
        return res.status(err.status).send({
            type : err.name,
            message : err.message
        });
    }
    //If server error, print the whole stack for debugging
    return res.status(500).send({
        message : err.message,
        stack : err.stack
    });
});
```

