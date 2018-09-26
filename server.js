var express = require('express');
var bodyParser = require('body-parser');
var app = express();
app.use(bodyParser.json());
app.use(function (err, req, res, next) {
    if (err) switch (err.status) {
        case 400:
            res.status(400).send(JSON.stringify({ error: "Could not decode request: JSON parsing failed" }));
    };
});
// set the port of our application
var port = process.env.PORT || 8585;

// set the view engine to ejs
app.set('view engine', 'ejs');

// express look in the public directory for assets (css/js/img)
app.use(express.static(__dirname + '/public'));

// home page route
app.get('/', function (req, res) {

	res.render('index');
});
//=====
//is alive method
app.use('/isalive', (req,res) => {

	res.status(200).send("I'm alive :)");
})
//filterProperties default "htv","completed"
app.post('/filterProperties', async (req, res) => {
	res.status(200).send(JSON.stringify({ response: filterPayLoad(req.body,"htv","completed") }));
});
//filterProperties with params type and workflow
app.post('/filterProperties/:type/:workflow', async (req, res) => {
	res.status(200).send(JSON.stringify({ response: filterPayLoad(req.body,req.params.type,req.params.workflow) }));
});
function filterPayLoad(body,type,status) {
	var data = body.payload;
	data = mapPropertyData(data.filter(property => {
		return property.workflow == status && property.type == type;yield
	}));

	return data;
};

function mapPropertyData (data){
   var mappedData = [];
   data.forEach(property => {
	   mappedData.push(
		   {
			   concataddress: property.address.buildingNumber +
				   " " +
				   property.address.street +
				   " " +
				   property.address.suburb +
				   " " +
				   property.address.state +
				   " " +
				   property.address.postcode,
			   type: property.type,
			   workflow: property.workflow
		   }
	   );
   });
   return mappedData;
}
//=====

app.listen(port, function () {
	console.log('App is running on ' + port);
});