function RandomIn(room)
{
	var tiles=[];
	for (var x=0;x<w;x++)
	{
		for (var y=0;y<h;y++)
		{
			if (GetMapRoom(x,y)==room && GetMap(x,y)<=0.1) tiles.push([x,y]);
		}
	}
	return choose(tiles);
}