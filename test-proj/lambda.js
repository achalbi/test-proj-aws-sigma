let AWS = require('aws-sdk');
const axios = require('axios');
var parser = require('xml2json');

const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	var url = `http://www.bhhsall.com/api_buyside/get/office/sort-n/`;
	var config = {
		headers: {'ak': '7501F624-02DA-444E-AC44-67E9E9950B3B', 'Content-Type': 'application/json'}
	};

axios
	.get(url, config)
	.then(response => {

		// xml to json
		var json = parser.toJson(response);
		console.log("to json -> %s", json);

		if (json.Error) {
			throw 'result not found';
		}
		// for (office of json.Offices ){
		// 	ddb.put({
		// 		TableName: 'integration_offices',
		// 		Item: { 'vendor_org_id': office.vendor_org_id, 'super_org_id': '102' }
		// 	}, function (err, data) {
		// 		if (err) {
		// 			//handle error
		// 			console.log(err);
		// 		} else {
		// 			//your logic goes here
		// 			console.log(data);
		// 		}
		// 	});
		// }

	})
	.catch(err => {
			console.log(err);
	});


	callback(null, 'Successfully executed');
}