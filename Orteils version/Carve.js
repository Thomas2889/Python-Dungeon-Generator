function Carve(wall,side,roomId)
{
	var rx=wall[0]+side[0];
	var ry=wall[1]+side[1];
	var rw=1;
	var rh=1;
	var expansions=[[0,1,2,3]];
	var corridor=0;
	if (Math.random()<corridorPercent) corridor=1;
	if (corridor) expansions=[[0,2],[1,3]];
	expansions=choose(expansions);
	var steps=roomSize;
	if (corridor) steps=corridorSize;
	for (var i=0;i<steps;i++)
	{
		if (expansions.length==0) break;
		
		var xd=0;
		var yd=0;
		var wd=0;
		var hd=0;
		var side=choose(expansions);
		if (side==0) {xd=-1;wd=1;}
		else if (side==1) {yd=-1;hd=1;}
		else if (side==2) {wd=1;}
		else if (side==3) {hd=1;}
		if (CheckRoom(rx+xd,ry+yd,rw+wd,rh+hd,roomId)) {rx+=xd;ry+=yd;rw+=wd;rh+=hd;} else expansions.slice(expansions.indexOf(side),1);
	}
	if (rw>1 || rh>1)
	{
		MakeRoom(rx,ry,rw,rh,null,roomId);
	}
	if (rw==1 || rh==1) corridor=1;// else corridor=0;
	return {x:rx,y:ry,w:rw,h:rh,corridor:corridor};
}