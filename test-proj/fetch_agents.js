let AWS = require('aws-sdk');
const ddb = new AWS.DynamoDB.DocumentClient();
const axios = require('axios');
var parser = require('xml2json');

exports.handler = function (event, context, callback) {
	var officeId = event.Records[0].Sns.MessageAttributes.office_id.Value;
	console.log("Office id: ", officeId)

	var url = `http://www.bhhsall.com/api_buyside/get/agent/sort-sn/`;
	var config = {
		headers: { 'ak': '7501F624-02DA-444E-AC44-67E9E9950B3B', 'Content-Type': 'application/json' }
	};
	var page_no = "1";
	axios
		.get(url + page_no, config)
		.then(response => {
			// xml to json
			var jsonStr = parser.toJson(response.data);
			console.log("to json -> %s", jsonStr);
			var json = JSON.parse(jsonStr)

			if (json.Error) {
				throw 'result not found';
			}
			console.log(json);

			var agents = json.AgentList.Agents.Agent;
			var total_pages = json.TotalPageNumber;

			for (agents of agents) {
				ddb.put({
					TableName: 'integration-alliance-agents',
					Item: { 'Key': agents.Key, 'email': agents.Email, 'firstName': agents.FirstName, 'lastName': agents.LastName, 'jobTitle': agents.Roles , 'vendor_org_id': agents.OfficeKey  }
				}, function (err, data) {
					if (err) {
						//handle error
						console.log(err);
					} else {
						//your logic goes here
					}
				});
			}

			for (i = 2; i <= total_pages; i++) {

				axios
					.get(url + i, config)
					.then(response => {
						// xml to json
						var jsonStr = parser.toJson(response.data);
						console.log("to json -> %s", jsonStr);
						var json = JSON.parse(jsonStr)

						if (json.Error) {
							throw 'result not found';
						}

						var agents = json.AgentList.Agents.Agent;

						for (agents of agents) {
							console.log(agents);
							ddb.put({
								TableName: 'integration-alliance-agents',
								Item: { 'Key': agents.Key, 'email': agents.Email, 'firstName': agents.FirstName, 'lastName': agents.LastName, 'jobTitle': agents.Roles , 'vendor_org_id': agents.OfficeKey  }
							}, function (err, data) {
								if (err) {
									//handle error
									console.log(err);
								} else {
									//your logic goes here
								}
							});

						}

					})
					.catch(err => {
						console.log(err);
					});
			}

		})
		.catch(err => {
			console.log(err);
		});


	callback(null, 'Successfully executed fetch agent');
}