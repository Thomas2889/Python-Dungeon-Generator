function PickWall(x,y,w,h)
{
	if (x)
	{
		var myWalls=[];
		for (var i in walls)
		{
			if (walls[i][0]>=x && walls[i][0]<x+w && walls[i][1]>=y && walls[i][1]<y+h) myWalls.push(walls[i]);
		}
		return choose(myWalls);
	}
	else return choose(walls);
	return 0;
}