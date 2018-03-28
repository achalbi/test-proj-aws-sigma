let AWS = require('aws-sdk');
exports.handler = function(event, context, callback) {
		console.log(event.Records[0].Sns.MessageAttributes);
var officeId = event.Records[0].Sns.MessageAttributes.office_id.StringValue;
	console.log(officeId)

	callback(null,'Successfully executed fetch agent');
}