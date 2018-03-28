let AWS = require('aws-sdk');
exports.handler = function(event, context, callback) {
var officeId = event.Records[0].Sns.MessageAttributes.office_id.Value;
	console.log("Office id: ",officeId)

	callback(null,'Successfully executed fetch agent');
}