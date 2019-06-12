//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

var pswd;

const clearall = function() {
    if(!confirm("This operation will delete all faculty informational entries. You should run this only once at the beginning of each academic year!"))
	return;
    
    postOb = JSON.stringify({'op': 'aclear', 'pswd': pswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.fail(function () {alert("Server error.");})
	.done(function () {alert("Deleted all entries.");});
}

const reset = function() {
    postOb = JSON.stringify({'op': 'mkfpass', 'pswd': pswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.fail(function () {alert("Server error.");})
	.done(function (data) { $('#fpass').val(data.fpass); });
}

const login = function() {
    pswd = $('#pswd').val(); localStorage.rtmdb_admpswd = pswd;
    postOb = JSON.stringify({'op': 'afpass', 'pswd': pswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.fail(function () {alert("Incorrect Password or Server error.");})
	.done(function (data) {
	    $('#fpass').val(data.fpass);
	    $('#logindiv').addClass('d-none'); $('#maindiv').removeClass('d-none');
	});
}
	
if(localStorage.rtmdb_admpswd) $('#pswd').val(localStorage.rtmdb_admpswd);
