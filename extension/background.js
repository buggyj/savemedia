var testmode = false; //set to true to avoid path test
var minutebacks = false; //set to true to allow backs every minute for testing

var tiddlywikilocations = "tiddlywikilocations";
var  $ = {"/":"/"};

var testfilecontent = "This is a test file for csaver extension. If you are reading this file an error has ocurred - this file can be deleted";



var os = "notwin";
chrome.runtime.getPlatformInfo( function(info) {if(info.os == "win") { $["/"] = "\\"; os = "win";}});

var testbase ;//	'readMediaSaverInstruction';
var round = '59723833'; //by rotating this string of digits we can have 8 unique named test files for simutaneous use
						//ie testpath = testbase+round+'.html';rotate(round) for next test file
var rlen = round.length - 1;

var dataURItoBlob = function(dataURI, dataTYPE) {
        var bin = atob(dataURI), arr = [];
        for(var i = 0; i < bin.length; i++) arr.push(bin.charCodeAt(i));
        return new Blob([new Uint8Array(arr)], {type: dataTYPE});
   }

chrome.runtime.onMessage.addListener(function(msg, sender, sendResponse) {
    console.log("csaverbg: got request");
    

    function dodownload (msg){	
	var subdir,path = msg.filePath.slice(msg.dldir.length+1);//cutoff the "/"as well
	
	console.log("csaver path:"+path);
	subdir = msg.subdir?$["/"]+msg.subdir:"";	
	console.log("csaver: do "+ path+subdir+$["/"]+ msg.name);
	chrome.downloads.download({
		url:URL.createObjectURL(dataURItoBlob(msg.txt,msg.mtype)),
		filename: path+subdir+$["/"]+ msg.name,
		conflictAction: 'overwrite'
	},
	function(id) {
		console.log("csaver: saved "+path+subdir+$["/"]+ msg.name);
		sendResponse ({status:"saved"});

	});
}

	////////////////////////// start ///////////////////////////////
	if (msg.type === "start") {
		console.log("csaverbg: start");
		testbase = 'readMediaSaverInstruction';
		// first download check our destination is valid by download a dummy file first and then reading back the filepath	
		round = round[rlen] + round.substring(0, rlen);
		chrome.downloads.download({
			url: URL.createObjectURL(new Blob([testfilecontent], {type: 'text/plain'})),
			filename: testbase+round+'.html',//=readMediaSaverInstruction59723833.html
			conflictAction: 'overwrite'
			},function(id){chrome.downloads.onChanged.addListener(function hearchange(deltas){
				// wait for completion
				if (deltas.id == id && deltas.state && deltas.state.current === "complete") {
					chrome.downloads.onChanged.removeListener(hearchange);
					chrome.downloads.search({id:id}, function(x){
						var firstloc,dldir = x[0].filename.split($["/"]+testbase)[0];// location of download dir
						if (os === "win") {//make drive letters the same case
							dldir = dldir.replace(/^./g, dldir[0].toLowerCase());
							msg.filePath = msg.filePath.replace(/^./g, msg.filePath[0].toLowerCase());
						}  
						firstloc = msg.filePath.indexOf(dldir);
						
						if (firstloc === 0) {
							msg.dldir = dldir;
							dodownload(msg);
						} else {				
							console.log("csaverbg: failed path "+msg.filePath +"not on"+dldir);
							sendResponse({status:"failedpath",path:x[0].filename.split($["/"]+testbase)[0]});
						}
						
						chrome.downloads.removeFile(id,function(){chrome.downloads.erase({id:id})});//move this further up
					});
							
				}
				//
			})}
		)


		return true;
	}
	return true;
});


