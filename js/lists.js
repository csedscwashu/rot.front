//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

var pswd;

const getData = function (name) {
    return $('#'+name).jexcel('getData',false)
	.map( (x) => x.map( (y) => y.trim()))
	.filter( (x) => x[0] != '');
}


const submit = function () {
    flist = getData('flist');
    alist = getData('alist');
    
    postOb = JSON.stringify({'op':'asetup', 'pswd': pswd,
			     'flist': flist, 'alist': alist});
    
    $.ajax({type: 'POST', url: server, data: postOb})
	.done(function () { alert('Successfully Updated');})
	.fail(function () { alert('Server Error'); });
}


const login = function() {
    pswd = $('#pswd').val(); localStorage.rtmdb_admpswd = pswd;
    postOb = JSON.stringify({'op': 'alogin', 'pswd': pswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.fail(function () {alert("Incorrect Password or Server error.");})
	.done(function (data) {
	    $('#flist').jexcel({
		data: data.flist,
		colHeaders: ['Faculty Name', 'URL to Profile Image'],
		colWidths: [200,700], colAlignments: ['left','left'],
		minDimensions: [2,5], columnResize: false, allowInsertColumn: false, allowComments: false,
	    });

	    $('#alist').jexcel({
		data: data.alist,
		colHeaders: ['Research Area'],
		colWidths: [450], colAlignments: ['left'],
		minDimensions: [1,5], columnResize: false, allowInsertColumn: false, allowComments: false,
	    });
	    
	    $('#logindiv').addClass('d-none'); $('#maindiv').removeClass('d-none');
	});
}
	
if(localStorage.rtmdb_admpswd) $('#pswd').val(localStorage.rtmdb_admpswd);
