let AWS = require('aws-sdk');
const ses = new AWS.SES();
const axios = require('axios');
var parser = require('xml2json');

const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	var url = `http://www.bhhsall.com/api_buyside/get/office/sort-n/`;
	var config = {
		headers: { 'ak': '7501F624-02DA-444E-AC44-67E9E9950B3B', 'Content-Type': 'application/json' }
	};

	axios
		.get(url, config)
		.then(response => {
			// xml to json
			var jsonStr = parser.toJson(response.data);
			console.log("to json -> %s", jsonStr);
			var json = JSON.parse(jsonStr)

			if (json.Error) {
				throw 'result not found';
			}
			console.log(json);
			console.log(json.OfficeList);

			var offices = json.OfficeList.Offices.Office;

			for (office of offices){
				ddb.put({
					TableName: 'integration_offices',
					Item: { 'vendor_org_id': office.Key, 'office_name': office.OFFICENAME, 'email': office.Email, 'city': office.City }
				}, function (err, data) {
					if (err) {
						//handle error
						console.log(err);
					} else {
						//your logic goes here
						//console.log(data);
					}
				});
			}
			// ses.sendEmail({
			// 	Destination: {
			// 		ToAddresses: ['achal.rvce@gmail.com'],
			// 		CcAddresses: [],
			// 		BccAddresses: []
			// 	},
			// 	Message: {
			// 		Body: {
			// 			Text: {
			// 				Data: 'successful execution'.concat(JSON.stringify(json))
			// 			}
			// 		},
			// 		Subject: {
			// 			Data: 'report'
			// 		}
			// 	},
			// 	Source: 'achal.rvce@gmail.com',
			// }, function (err, data) {
			// 	if (err) console.log(err, err.stack); // an error occurred
			// 	else console.log(data);           // successful response
			// });

		})
		.catch(err => {
			console.log(err);
		});


	callback(null, 'Successfully executed');
}