//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

var faclist, apswd;

update = function () {
    sheet = $('#fsheet').jexcel('getData',false);
    rmcount = {};
    for(i = 0; i < faclist.length; i++)
	rmcount[faclist[i]] = {r: 0, m: 0};
    sheet2 = [];
    
    for(i = 0; i < sheet.length; i++) {
	row = sheet[i];
	if(row[0] == "") continue;
	sheet2.push(row);
	if(faclist.includes(row[1])) rmcount[row[1]].m++;
	for(j = 2; j < row.length-1; j++)
	    if(faclist.includes(row[j])) rmcount[row[j]].r++;
    }

    sheet = JSON.stringify(sheet2); rmcount = JSON.stringify(rmcount);
    postOb = JSON.stringify({'op':'writematch', 'pswd': apswd, 'sheet':sheet, 'rmcount':rmcount});
    $.ajax({type: 'POST', url: server, data: postOb})
	.done(function () { alert('Successfully Updated');})
	.fail(function () { alert('Server Error'); });
}

login = function () {
    apswd = $('#pswd').val(); localStorage.rtmdb_admpswd = apswd;
    
    postOb = JSON.stringify({'op':'readmatch', 'pswd': apswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.done(function (data) {

	    faclist = data.flist.map(x => x[0]).sort();
	    f2 = data.flist.map(x => x[0]).sort();
	    drop = {type: 'autocomplete', source: f2}; dropM = {type: 'autocomplete', source: f2, cssClass: 'text-success'};

	    $('#fsheet').jexcel({
		data: data.sheet,
		colHeaders: ['Student', 'Match', 'R1','R2','R3','R4','R5','R6','R7','Notes'],
		colWidths: [200,120,120,120,120,120,120,120,120,120],
		colAlignments: ['left','left','left','left','left','left','left','left','left','left'],
		columns: [ {type: 'text'}, dropM ,drop,drop,drop,drop,drop,drop,drop, {type: 'text'} ],
		minDimensions: [10,1],
		columnResize: false, allowInsertColumn: false, allowComments: false,
		csvFileName: 'rotmatch',
	    });
	    $('#logindiv').addClass('d-none'); $('#maindiv').removeClass('d-none');
	}).fail(function () {alert("Login error."); });
}

if(localStorage.rtmdb_admpswd) $('#pswd').val(localStorage.rtmdb_admpswd);
