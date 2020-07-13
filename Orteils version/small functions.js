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