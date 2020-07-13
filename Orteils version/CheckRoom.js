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