//-Ayan Chakrabarti <ayan.chakrabarti@gmail.com>

var areas, slist;

fullShow = function (name) {
    fac = slist.find( (x) => x.name == name);
    $('#dname').html(fac.name);
    $('#durl').attr('href',fac.rurl);
    $('#dfocus').html(fac.rfocus);
    $('#ddesc').html(fac.rdesc);
    $('#dpreq').html(fac.rpreq);

    rcr = fac.rexp;
    if(fac.ropt > fac.rexp)
	rcr = rcr + " (possibly "+fac.ropt+")";
    
    $('#drecr').html(rcr); $('#dcntr').html(fac.r); $('#dcntm').html(fac.m);
    
    $('#facdet').modal('show');
}

loadArea = function() {
    areasel = $('#areasel').val();
    if(areasel == "all")
	$('.card').removeClass('d-none');
    else {
	$('.card').addClass('d-none');
	$('.arcls'+areasel).removeClass('d-none');
    }
}

render = function (resp) {
    rlist = resp[0]; rmcount = resp[1];
    
    areas = {}; slist = [];
    for(let i = 0; i < rlist.length; i++) {
	if(rlist[i].rexp == 0 && rlist[i].ropt == 0)
	    continue;
	rlist[i].idx = Math.random();

	try {
	    rlist[i].r = rmcount[rlist[i].name].r;
	    rlist[i].m = rmcount[rlist[i].name].m;
	} catch(e) {
	    rlist[i].r = 0;
	    rlist[i].m = 0;
	}
	
	slist.push(rlist[i]);
	for(let j = 0; j < rlist[i].rarea.length; j++) areas[rlist[i].rarea[j]] = '';
    }
    areas = Object.keys(areas).sort(); slist = slist.sort(function (a,b) {return a.idx-b.idx;});


    html='<option value="all">All Areas</option>';
    for(let i = 0; i < areas.length;i++)
	html=html+'<option value="'+i+'">'+areas[i]+'</option>';
    $('#areasel').html(html); $('#loading').html('');

    template =
`
              <div class="card mx-4 my-4 ARCLASS" onclick="fullShow('NAME');">
		<div class="cimg" style="background-image: url(IMG);"></div>
		<div class="card-body p-2 ml-0 mr-0">
                  <p><span class="lead">NAME</span> <br />
		  <span class="text-secondary">FOCUS</span></p>
		</div><div class="card-footer text-center text-secondary">
                  <b>Recruit</b>: <span class="text-success"><b>EXP</b></span> <span class="text-secondary">OPTIM</span><br />
                  <b>Rot.:</b> ROT / <b>Match:</b> <span class="text-danger">MATCH</span>
		</div>
              </div>
`;
    html = "";
    for(let i = 0; i < slist.length; i++) {
	slist[i].img = slist[i].img.replace(/\+/g,'%20');
	data = {'NAME': slist[i].name, 'IMG': slist[i].img, 'FOCUS': slist[i].rfocus, 'ARCLASS': [], 'EXP': slist[i].rexp};
	for(let j = 0; j < areas.length; j++)
	    if(slist[i].rarea.includes(areas[j]))
		data['ARCLASS'].push('arcls'+j);
	data['ARCLASS'] = data['ARCLASS'].join(" ");

	if(slist[i].ropt > slist[i].rexp)
	    data['OPTIM']="&rarr; " + slist[i].ropt;
	else
	    data['OPTIM']="";
	
	data['ROT']= slist[i].r; data['MATCH']= slist[i].m;
	
	s = template; k = Object.keys(data);
	for(let j = 0; j < k.length; j++)
	    s = s.replace(new RegExp(k[j],"g"),data[k[j]]);
	html = html+s;
    }
    $('#theList').html(html);
}

postOb = JSON.stringify({'op': 'main'});
$.ajax({type: 'POST', url: server, data: postOb, dataType: 'json'})
    .done(function (resp) {render(resp);}).fail(function () {alert("Server error.");});
