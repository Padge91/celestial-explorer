
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

//update loading element
function updateLoading(current, max){
        var loadingText = "(" + current + " of " + max + ")";
        updateText(loadingText);
}

//function update text
function updateText(content){
        var elementId="load-amount";

        var e = document.getElementById(elementId);
        if (e != null){
                e.innerHTML = content;
        }
}


// merge sort
function mergeSort(array){
	var arraySize = array.length;
	if (arraySize == 1){
		return [array[0]];
	}

	var front = array.splice(0, Math.floor(arraySize/2));
	var back = array.splice(0, Math.ceil(arraySize/2));
	var frontSorted = mergeSort(front);
	var backSorted = mergeSort(back);

	var combinedResult = [];
	while (backSorted.length > 0 && frontSorted.length > 0){
		var item = null;
                if (frontSorted[0] < backSorted[0]){
			item = [frontSorted.shift()];
                } else {
			item = [backSorted.shift()];
                }
		combinedResult = combinedResult.concat(item);
	}
	if (backSorted.length == 0){
		combinedResult = combinedResult.concat(frontSorted);
	} else if (frontSorted.length == 0){
		combinedResult = combinedResult.concat(backSorted);
	}
	return combinedResult;

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
      updateLoading(result.length, lines.length);

  }


  //return result; //JavaScript object
  window.celestialData = result; //JSON
}


function main(){
	var dataFile = "./data/hygdata_v3.csv";

	updateText("Loading file...");
	loadFile(dataFile, csvJSON);
		
}

main();
