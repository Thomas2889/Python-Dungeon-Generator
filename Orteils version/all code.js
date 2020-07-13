
function choose(arr) {return arr[Math.floor(Math.random()*arr.length)];}

function GetMap(x,y)
{
	if (x<0 || x>=w || y<0 || y>=h) return -1; else return map[x][y][0];
}
function SetMap(x,y,tile)
{
	if (x<0 || x>=w || y<0 || y>=h) return false; else map[x][y][0]=tile;
	return true;
}
function GetMapRoom(x,y)
{
	if (x<0 || x>=w || y<0 || y>=h) return -1; else return map[x][y][1];
}
function SetMapRoom(x,y,id)
{
	if (x<0 || x>=w || y<0 || y>=h) return false; else map[x][y][1]=id;
	return true;
}

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

function CheckRoom(X,Y,W,H,thisRoomId)
{
	X=Math.floor(X);
	Y=Math.floor(Y);
	W=Math.floor(W);
	H=Math.floor(H);
	for (var x=X;x<X+W;x++)
	{
		for (var y=Y;y<Y+H;y++)
		{
			//if ((GetMap(x,y)!=1))// && roomId==-1) || (roomId!=-1 && GetMapRoom(x,y)!=roomId))
			//{return false;}
			if (GetMap(x,y)!=1 && thisRoomId==-1) return false;
			if (GetMapRoom(x,y)!=thisRoomId && thisRoomId!=-1 && GetMap(x,y)!=1) return false;
			if (!mirror) {if (x<1 || x>=w-1 || y<1|| y>=h-1) return false;}
			else {if (x<1 || x>=w/2-1 || y<1|| y>=h/2-1) return false;}
		}
	}
	return true;
}

w=40;
h=40;
mapId=0;
ts=4;

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

tiles={0:'cfc',0.1:'9f9',0.2:'090',0.5:'f3f',0.6:'f00',0.7:'00f',0.9:'66c',1:'000',1.1:'333',1.2:'633',};
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

Init();
