const test = require('pico-check');

const Err = require('../egads.js').extend('Something done goofd', 500, 'GenericError');

Err.auth = Err.extend('Unauthorized', 401, 'AuthError');
Err.auth.badToken = Err.auth.extend('Bad Auth Token');
Err.badInput = Err.extend({
	name : 'BadInputError',
	message : 'What am I suppose to do with this?',
	status : 400,
	fields : {
		shameOnYou : true
	}
})


test('base', (t)=>{

	try{
		throw new Err.auth.badToken();
	}catch(err){
		t.ok(err instanceof Error);
		t.ok(err instanceof Err);
		t.ok(err instanceof Err.auth);
		t.ok(err instanceof Err.auth.badToken);

		t.is(err.name, 'AuthError')
		t.is(err.message, 'Bad Auth Token')
		t.is(err.status, 401)
		t.is(err.toString(),  'AuthError: Bad Auth Token')
	}
});

test.skip('fields', (t)=>{});



module.exports = test;