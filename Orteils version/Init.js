function Init()
{
	//document.getElementById('maps').innerHTML=document.getElementById('maps').innerHTML+'<div id="map'+mapId+'" style="position:relative;float:left;width:'+(w*ts)+'px;height:'+(w*ts)+'px;"></div>';
	document.getElementById('status').innerHTML='Digging...';
	var div=document.createElement('div');
	div.setAttribute('id','map'+mapId);
	div.setAttribute('style','background:#000;position:relative;float:left;width:'+(w*ts)+'px;height:'+(w*ts)+'px;');
	document.getElementById('maps').appendChild(div);

	map=[];
	for (var x=0;x<w;x++)
	{
		map[x]=[];
		for (var y=0;y<h;y++)
		{
			map[x][y]=[1,-1];
			if (x<1 || x>=w-1 || y<1 || y>=h-1) map[x][y]=[1.1,-1];
		}
	}
	
	walls=[];
	dug=[];
	rooms=[];
	tilesDug=0;
	roomId=0;
	mirror=0;
	//if (Math.random()<0.1) mirror=1;
	roomSize=15;
	corridorSize=5;
	percentToFill=0.33;
	corridorPercent=0.2;
	pillarPercent=0.2;
	waterPercent=0;
	
	roomSize=Math.floor(Math.random()*15)+5;
	corridorSize=Math.floor(Math.random()*5)+1;
	corridorPercent=Math.random()*0.8+0.1;
	pillarPercent=Math.random();
	percentToFill=0.05+Math.random()*0.3;
	waterPercent=Math.random();
	
	if (mirror) percentToFill/=4;
	
	stuck=0;
	tooMuchStuck=150;
	digs=0;
	Dig();
}