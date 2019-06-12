//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

var flist, alist;
var fname, fimg, fid, fpswd, fdata;


makeNum = function (el) {
    num = parseInt($(el).val());
    if(isFinite(num))
	$(el).val(num);
    else
	$(el).val("");
}

submitForm = function () {
    fdata = {'name': fname, 'img': fimg};

    mi = function (x) { y = parseInt(x); if(!isFinite(y)) y = 0; return y;}
    
    fdata.rexp = mi($('#rexp').val());
    fdata.ropt = mi($('#ropt').val());
    
    fdata.rurl = $('#rurl').val(); fdata.rfocus = $('#rfocus').val();
    fdata.rdesc = $('#rdesc').val(); fdata.rpreq = $('#rpreq').val();
    fdata.rarea = $('.rarea:checked').map( function (_,el) {return el.value;}).get();

    postOb = JSON.stringify({'op':'writefac', 'key': fid, 'pswd': fpswd, 'data': JSON.stringify(fdata)});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.done(function () {
	    $('.svdmsg').html("All changes saved on server.").removeClass('text-danger').addClass('text-secondary');
	}).fail(function () {alert("Server error."); });
}

unsaved = function () {
    $('.svdmsg').removeClass('text-secondary').addClass('text-danger').html('Form has unsaved changes.');
}

loadForm = function () {

    $('#rexp').val(fdata.rexp); $('#ropt').val(fdata.ropt);
    $('#rurl').val(fdata.rurl); $('#rfocus').val(fdata.rfocus);
    $('#rdesc').val(fdata.rdesc); $('#rpreq').val(fdata.rpreq);
    for(let i = 0; i < fdata.rarea.length; i++)
	$('.rarea[value="'+fdata.rarea[i]+'"]').prop('checked',true);
    
    $('.svdmsg').html("All changes saved on server.").removeClass('text-danger').addClass('text-secondary');
}

login = function () {
    fname = $('#facid').val(); fpswd = $('#fackey').val();
    localStorage.rtmdb_facpswd = fpswd; localStorage.rtmdb_facname = fname;
    if(fname == "") { alert("Select your name from the dropdown list first."); return;}
    $('#facname').html(fname);
    
    fimg = flist.find((x) => x[0] == fname)[1];
    fid = fname.toLowerCase().replace(/[^a-z]/g,"");

    postOb = JSON.stringify({'op':'readfac', 'key': fid, 'pswd': fpswd});
    $.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
	.done(function (data) {
	    if(data.name == fname) {
		fdata = data;
		loadForm();
	    }
	    $('#logindiv').addClass('d-none'); $('#maindiv').removeClass('d-none');
	    $('#theform input').change(unsaved); $('#theform textarea').change(unsaved);
	    $('#theform input').on('input',unsaved); $('#theform textarea').on('input',unsaved);
	}).fail(function () {alert("Server error."); });
}


render = function () {
    regex = new RegExp('TITLE','g');

    html = '';
    template='<div class="ml-4"><input class="rarea form-check-input" type="checkbox" value="TITLE"><label>TITLE</label></div>';
    for(let i = 0; i < alist.length; i++)
	html = html + template.replace(regex,alist[i][0]);
    $('#arealist').html(html);

    html = '<option value="" selected>Select your name from this list</option>';
    template='<option value="TITLE">TITLE</option>';
    for(let i = 0; i < flist.length; i++)
	html = html + template.replace(regex,flist[i][0]);
    $('#facid').html(html);
    
    if(localStorage.rtmdb_facpswd)
	$('#fackey').val(localStorage.rtmdb_facpswd);
    if(localStorage.rtmdb_facname)
	$('#facid').val(localStorage.rtmdb_facname);
}

postOb = JSON.stringify({'op':'filistop'});
$.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
    .done(function (data) { alist = data.alist; flist = data.flist; render();})
    .fail(function () {alert("Server error."); });
