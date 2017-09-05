
var debug = true;
window.celestialData = null;

function log(message){
	if (debug){
		console.log(message);
	}
}

function loadFile(filePath, successCallback, failureCallback){
	$.get(filePath, function(data){
		if (successCallback){
			successCallback(data);
		} else {
			log("Success not handled for data loaded correctly.");
		}
	})
	.fail(function(error){
		if (failureCallback){ 
			failureCallback(error);
		} else {
			log("Error not handled: " + error);
		}
	});
}

//credit to http://techslides.com/convert-csv-to-json-in-javascript
//var csv is the CSV file with headers
function csvJSON(csv){

  var lines=csv.split("\n");

  var result = [];

  var headers=lines[0].split(",");

  for(var i=1;i<lines.length;i++){

      var obj = {};
      var currentline=lines[i].split(",");

      for(var j=0;j<headers.length;j++){
          obj[headers[j]] = currentline[j];
      }

      result.push(obj);

  }

  //return result; //JavaScript object
  window.celestialData = result; //JSON
}


function main(){
	var dataFile = "./data/hygdata_v3.csv";

	loadFile(dataFile, csvJSON);
		
}

main();
