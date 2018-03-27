let AWS = require('aws-sdk');
const axios = require('axios');

const ddb = new AWS.DynamoDB.DocumentClient();
exports.handler = function (event, context, callback) {

	var geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${address}`;

axios
	.get(geocodeUrl)
	.then(response => {
		if (response.data.status === 'ZERO_RESULTS') {
			throw 'result not found';
		}
		var lat = response.data.results[0].geometry.location.lat;
		var lng = response.data.results[0].geometry.location.lng;
		const APIKey = '7112130bec5122f6adc38125c4483211';
		var url = `https://api.darksky.net/forecast/${APIKey}/${lat},${lng}`;
		console.log(response.data.results[0].formatted_address);
		return axios.get(url);
	})
	.then(res => {
		var temp = res.data.currently.temperature;
		var summary = res.data.currently.summary;
		console.log(`the temp is ${temp} , it feels like ${summary}`);
	})
	.catch(err => {
		if (err.code === 'ENOTFOUND') {
			console.log(err);
		} else {
			console.log(err);
		}
	});
	
	ddb.put({
		TableName: 'integration_offices',
		Item: { 'vendor_org_id': 'NaN', 'super_org_id': '102' }
	}, function (err, data) {
		if (err) {
			//handle error
			console.log(err);
		} else {
			//your logic goes here
			console.log(data);
		}
	});


	callback(null, 'Successfully executed');
}