function Draw()
{
	str='';
	for (var x=0;x<w;x++)
	{
		for (var y=0;y<h;y++)
		{
			var text='';
			var gen=0;
			if (GetMapRoom(x,y)!=-1) gen=rooms[GetMapRoom(x,y)].gen;
			var parent='';
			if (GetMapRoom(x,y)!=-1) parent=rooms[GetMapRoom(x,y)].parent;
			//if (GetMapRoom(x,y)!=-1 && rooms[GetMapRoom(x,y)].corridor) text='1';
			var opacity=Math.max(0.1,(1-gen/10));
			if (map[x][y][0]==0.6 || map[x][y][0]==0.7) opacity=1;
			str+='<div style="opacity:'+opacity+';color:#99f;font-size:'+ts+'px;position:absolute;width:'+ts+'px;height:'+ts+'px;left:'+(x*ts)+'px;top:'+(y*ts)+'px;background:#'+(tiles[map[x][y][0]])+';">'+text+'</div>';
		}
	}
	document.getElementById('map'+mapId).innerHTML=str;
}