function Dig()
{
	var carvedARoom=0;
	if (digs==0)
	{
		var rw=Math.random()*6+2;
		var rh=Math.random()*6+2;
		MakeRoom(w/2-rw/2,h/2-rh/2,rw,rh,null,roomId);
		var rw=Math.random()*6+2;
		var rh=Math.random()*6+2;
		MakeRoom(w/2-rw/2,h/2-rh/2,rw,rh,null,roomId);
		rooms[roomId]={parent:-1,gen:1,corridor:0};
		roomId++;
		carvedARoom=1;
	}
	else
	{
		var wall=PickWall();
		if (!wall) {stuck++;}
		else
		{
			var parentRoom=rooms[GetMapRoom(wall[0],wall[1])];
			var sides=[];
			if (GetMap(wall[0]-1,wall[1])==1) sides.push([-1,0]);
			if (GetMap(wall[0]+1,wall[1])==1) sides.push([1,0]);
			if (GetMap(wall[0],wall[1]-1)==1) sides.push([0,-1]);
			if (GetMap(wall[0],wall[1]+1)==1) sides.push([0,1]);
			var side=choose(sides);
			if (!side) {stuck++;}
			else
			{
				var gen=parentRoom.gen+1;
				MakeRoom(wall[0],wall[1],1,1,0.5,roomId);//door
				walls.slice(walls.indexOf(wall),1);
				var room=Carve(wall,side,roomId);
				thisIsACorridor=room.corridor;
				if (Math.random()<0.95)//branch
				{
					for (var i=0;i<2;i++)
					{
						var wall=PickWall(room.x,room.y,room.w,room.h);
						if (wall)
						{
							var sides=[];
							if (GetMap(wall[0]-1,wall[1])==1) sides.push([-1,0]);
							if (GetMap(wall[0]+1,wall[1])==1) sides.push([1,0]);
							if (GetMap(wall[0],wall[1]-1)==1) sides.push([0,-1]);
							if (GetMap(wall[0],wall[1]+1)==1) sides.push([0,1]);
							sides=[[-1,0],[1,0],[0,-1],[0,1]];
							var side=choose(sides);
							if (side)
							{
								var room=Carve(wall,side,roomId);
								if (!room.corridor) thisIsACorridor=0;
							}
						}
					}
				}
				rooms[roomId]={parent:parentRoom,gen:gen,corridor:thisIsACorridor};
				roomId++;
				carvedARoom=1;
			}
		}
	}
	
	digs++;
	
	if (tilesDug<(w*h)*percentToFill && stuck<tooMuchStuck)
	{
		if (document.getElementById('instantCheckbox').checked==true) Dig();
		else
		{
			if (carvedARoom==1) Draw();
			setTimeout(Dig, 10000000);
		}
	}
	else
	{
		if (mirror)
		{
			for (var x=0;x<w/2;x++)
			{
				for (var y=0;y<h/2;y++)
				{
					map[w-x-1][y]=map[x][y];
					map[x][h-y-1]=map[x][y];
					map[w-x-1][h-y-1]=map[x][y];
				}
			}
		}
		
		var highest=0;
		var highestId=0;
		for (var i in rooms)
		{
			if (rooms[i].gen>highest && !rooms[i].corridor) {highest=rooms[i].gen;highestId=i;}
		}
		
		var spot=RandomIn(0);
		SetMap(spot[0],spot[1],0.7);
		
		var spot=RandomIn(highestId);
		SetMap(spot[0],spot[1],0.6);
		
		
		document.getElementById('status').innerHTML='All done!';
		Draw();
		mapId++;
		//if (stuck>=tooMuchStuck) document.getElementById('map'+mapId).style.background='#f00';
	}
}