function MakeRoom(X,Y,W,H,tile,roomId)
{
	var pillars=0;
	if (Math.random()<pillarPercent) pillars=choose([1,2,3]);//2=big,3=sparse
	var watery=0;
	if (Math.random()<waterPercent) watery=1;
	X=Math.floor(X);
	Y=Math.floor(Y);
	W=Math.floor(W);
	H=Math.floor(H);
	for (var x=X;x<X+W;x++)
	{
		for (var y=Y;y<Y+H;y++)
		{
			if (GetMap(x,y)>=1)
			{
				SetMap(x,y,tile||0);
				SetMapRoom(x,y,roomId);
				dug.push([x,y]);
				tilesDug++;
			}
		}
	}
	for (var x=X-1;x<X+W+1;x++)
	{
		for (var y=Y;y<Y+H;y++)
		{
			if (GetMap(x,y)==1)
			{
				SetMap(x,y,1.1);
				walls.push([x,y]);
				SetMapRoom(x,y,roomId);
			}
			else if (GetMap(x,y)==1.1)
			{
				SetMap(x,y,1.2);
				walls.slice(walls.indexOf([x,y]),1);
			}
		}
	}
	for (var x=X;x<X+W;x++)
	{
		for (var y=Y-1;y<Y+H+1;y++)
		{
			if (GetMap(x,y)==1)
			{
				SetMap(x,y,1.1);
				walls.push([x,y]);
				SetMapRoom(x,y,roomId);
			}
			else if (GetMap(x,y)==1.1)
			{
				SetMap(x,y,1.2);
				walls.slice(walls.indexOf([x,y]),1);
			}
		}
	}
	//corners
	x=X-1;y=Y-1;
	if (GetMap(x,y)==1)
	{
		SetMap(x,y,1.1);
		//walls.push([x,y]);
		SetMapRoom(x,y,roomId);
	}
	x=X+W;y=Y-1;
	if (GetMap(x,y)==1)
	{
		SetMap(x,y,1.1);
		//walls.push([x,y]);
		SetMapRoom(x,y,roomId);
	}
	x=X-1;y=Y+H;
	if (GetMap(x,y)==1)
	{
		SetMap(x,y,1.1);
		//walls.push([x,y]);
		SetMapRoom(x,y,roomId);
	}
	x=X+W;Y+H;
	if (GetMap(x,y)==1)
	{
		SetMap(x,y,1.1);
		//walls.push([x,y]);
		SetMapRoom(x,y,roomId);
	}
	
	if (!tile)
	{
		for (var x=X+1;x<X+W-1;x++)
		{
			for (var y=Y+1;y<Y+H-1;y++)
			{
				SetMap(x,y,0.1);
				if (watery==1 && Math.random()<0.8) {dug.slice(dug.indexOf([x,y]),1);SetMap(x,y,0.9);}
				var pillaring=0;
				if (pillars==1 && (x-X)%2==0 && (y-Y)%2==0 && Math.random()<0.8) pillaring=1;
				else if (pillars==2 && (x-X-1)%3<2 && (y-Y-1)%3<2 && Math.random()<0.8) pillaring=1;
				else if (pillars==3 && (x-X)%3==0 && (y-Y)%3==0 && Math.random()<0.8) pillaring=1;
				if (pillaring) {dug.slice(dug.indexOf([x,y]),1);SetMap(x,y,0.2);}
			}
		}
	}
}