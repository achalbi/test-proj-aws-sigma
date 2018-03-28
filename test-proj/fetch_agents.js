let AWS = require('aws-sdk');
const axios = require('axios');
var parser = require('xml2json');

exports.handler = function(event, context, callback) {
var officeId = event.Records[0].Sns.MessageAttributes.office_id.Value;
	console.log("Office id: ",officeId)

	var url = `http://www.bhhsall.com/api_buyside/get/agent/sort-sn/1`;
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

			var agents = json.AgentList.Agents.Agent;
			var total_pages = json.TotalPageNumber;

			for (agents of agents) {
				console.log(agents);
			}
    })
    .catch(err => {
      console.log(err);
    });
	

	callback(null,'Successfully executed fetch agent');
}