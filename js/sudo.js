//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

const login = function() {
    pswd = $('#pswd').val();
    postOb = JSON.stringify({'op': 'mkapass', 'pswd': pswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.fail(function () {alert("Incorrect Password or Server error.");})
	.done(function (data) {
	    $('#apass').val(data.apass);
	    $('#logindiv').addClass('d-none'); $('#maindiv').removeClass('d-none');
	});
}
	
