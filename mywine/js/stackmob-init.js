define(['stackmob'], function(StackMob) {
    
    var str = window.location.href;
	var prod=str.search("http://hollagram_html5_requirejs.stackmob339.stackmobapp.com");
	var dev=str.search("http://dev.hollagram_html5_requirejs.stackmob339.stackmobapp.com");
	var local=str.search("http://localhost:4567/");

	if(prod === 0) {
		console.log('init production');
	} else if(dev === 0) {
		StackMob.init({
		    publicKey:       "5e504e12-ab45-4c53-a2f0-274cf57d468e",
		    apiVersion:      0
		});
		console.log('init dev');
	} else if(local === 0) {
		StackMob.init({
		    publicKey:       "5e504e12-ab45-4c53-a2f0-274cf57d468e",
		    apiVersion:      0
		});
		console.log('init local');	

	} else {
		StackMob.init({
		    publicKey:       "5e504e12-ab45-4c53-a2f0-274cf57d468e",
		    apiVersion:      0
		});
		console.log('phonegap build');
	}
    
    // return a particular StackMob that we've initialised
    return StackMob;
});