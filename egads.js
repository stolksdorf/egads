var createInstance = function(obj, parent, props) {
	obj.prototype = Object.assign(
		Object.create(parent.prototype, {
			constructor: { value: obj }
		}),
		props
	);
	return obj;
};

var processArgs = function(message, status, name, fields){
	if(message instanceof Object) return message;
	return { message, status, name, fields };
};

var BaseError = createInstance(function(){}, Error);
BaseError.extend = function(message, status, name, fields){
	var args = processArgs(message, status, name, fields);
	var subError = function(message, status, name, fields){
		if(!(this instanceof subError)) return new subError(message, status, name, fields);
		var args = processArgs(message, status, name, fields);

		this.name    = args.name    || this.name;
		this.status  = args.status  || this.status;
		this.message = args.message || this.message;
		this.fields  = args.fields  || this.fields;

        if (Error.captureStackTrace) {
		    Error.captureStackTrace(this, this.constructor);
        }
	};
	subError.extend = this.extend;

	return createInstance(subError, this, {
		name    : args.name    || this.prototype.name,
		status  : args.status  || this.prototype.status,
		message : args.message || this.prototype.message,
		fields  : args.fields  || this.prototype.fields
	});
};
module.exports = BaseError.extend('Unexpected Error.', 500, 'BaseError', {});