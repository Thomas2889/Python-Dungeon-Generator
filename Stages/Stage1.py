import random, math
from PIL import Image

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

_DEBUG = False


class cordCursor(object):
    xy = (0, 0)

    def tileInfo(self, offset=(0, 0)):
        try:
            return globalVars.dungeonTiles[self.xy[0] + offset[0]][self.xy[1] + offset[1]]
        except IndexError:
            return (-1, -1)

    def draw(self, type):
        globalVars.dungeonTiles[self.xy[0]][self.xy[1]] = type


class globalsClass(object):
    mapSize = 101
    tileTypes = {0  : (119, 119, 119, 255),
                 # 0.5: (0  , 0  , 0  , 255),
                 0.5: (0  , 0  , 0  , 255),
                 1  : (0  , 0  , 0  , 0  ),
                 1.1: (61 , 61 , 61 , 255),
                 # 1.2: (91 , 61 , 61 , 255)}
                 1.2: (61 , 61 , 61 , 255)}
    tilesDug = 0
    walls = []
    doors = []
    rooms = {}
    roomId = 0

    roomSize = random.randrange(5, 21)
    corridorSize = random.randrange(1, 7)
    corridorPercent = random.random()*0.8+0.1
    percentToFill = random.random()*0.3+0.05

    stuck = 0
    stuckLimit = 150
    digs = 0


def DrawDungeonImg():
    # make a new image class and get its img data to work with
    roomImg = Image.new("RGBA", (globalVars.mapSize, globalVars.mapSize), (255, 255, 255, 0))
    imgData = list(roomImg.getdata())

    # start replacing data depending on the grid
    for x in range(0, globalVars.mapSize):
        for y in range(0, globalVars.mapSize):
            imgData[x + globalVars.mapSize * y] = globalVars.tileTypes[globalVars.dungeonTiles[x][y][0]]

    # save
    roomImg.putdata(imgData)
    roomImg.save("centre.png")


def Init():
    global cursor
    global globalVars

    cursor = cordCursor()
    globalVars = globalsClass()

    globalVars.dungeonTiles = []
    temp = []
    for x in range(0, globalVars.mapSize):
        for y in range(0, globalVars.mapSize):
            temp.append((1, -1))
        globalVars.dungeonTiles.append(temp)
        temp = []

    globalVars.tilesDug = 0
    globalVars.walls = []
    globalVars.rooms = {}
    globalVars.roomId = 0

    globalVars.roomSize = random.randrange(5, 21)
    globalVars.corridorSize = random.randrange(1, 7)
    globalVars.corridorPercent = random.random() * 0.8 + 0.1
    globalVars.percentToFill = random.random() * 0.3 + 0.05

    globalVars.stuck = 0
    globalVars.stuckLimit = 150
    globalVars.digs = 0

    MainGenFunction()
    DrawDungeonImg()


def MainGenFunction():
    if globalVars.digs == 0:
        rw = random.randrange(2, 9)
        rh = random.randrange(2, 9)
        MakeRoom(globalVars.mapSize / 2 - rw / 2,
                 globalVars.mapSize / 2 - rh / 2,
                 rw, rh, None, globalVars.roomId)
        globalVars.rooms[globalVars.roomId] = {'parent': -1, 'gen': 1, 'corridor': False}
        globalVars.roomId += 1
    else:
        wall = None
        if len(globalVars.walls) > 0:
            wall = globalVars.walls[random.randrange(0, len(globalVars.walls))]
        if not wall:
            globalVars.stuck += 1
        else:
            cursor.xy = wall
            parentRoom = globalVars.rooms[cursor.tileInfo()[1]]
            sides = []
            if cursor.tileInfo((-1, 0))[0] == 1: sides.append((-1, 0))
            if cursor.tileInfo((1, 0))[0] == 1: sides.append((1, 0))
            if cursor.tileInfo((0, -1))[0] == 1: sides.append((0, -1))
            if cursor.tileInfo((0, 1))[0] == 1: sides.append((0, 1))
            side = None
            if len(sides) > 0:
                side = sides[random.randrange(0, len(sides))]

            if not side:
                globalVars.stuck += 1
            else:
                gen = parentRoom['gen']+1

                cursor.xy = wall
                cursor.draw((1.2, cursor.tileInfo()[1]))
                globalVars.walls.remove(wall)

                room = Carve(wall, side, globalVars.roomId)

                cursor.xy = wall
                cursor.draw((0.5, globalVars.roomId))
                globalVars.doors.append(wall)

                thisIsACorridor = room['corridor']
                if random.random() < 0.95:
                    for i in range(0, 2):
                        wall = PickWall(room['x'], room['y'], room['w'], room['h'])
                        if wall:
                            sides = [(-1, 0), (1, 0), (0, -1), (0, 1)]
                            side = sides[random.randrange(0, len(sides))]
                            if side:
                                room = Carve(wall, side, globalVars.roomId)
                                if not room['corridor']: thisIsACorridor = False

                globalVars.rooms[globalVars.roomId] = {'parent': parentRoom, 'gen': gen, 'corridor': thisIsACorridor}
                globalVars.roomId += 1

    globalVars.digs += 1

    if globalVars.tilesDug<(math.pow(globalVars.mapSize, 2))*globalVars.percentToFill and globalVars.stuck < globalVars.stuckLimit:
        DrawDungeonImg()

        if _DEBUG:
            img = mpimg.imread('centre.png')
            imgplot = plt.imshow(img)
            plt.show()

            print("----------")

        MainGenFunction()
    else:
        for x in globalVars.doors:
            cursor.xy = x
            if cursor.tileInfo()[0] != -1:
                if not ( cursor.tileInfo((1, 0))[0] == 0 and cursor.tileInfo((-1, 0))[0] == 0 ) and not ( cursor.tileInfo((0, 1))[0] == 0 and cursor.tileInfo((0, -1))[0] == 0 ):
                    cursor.draw((1.1, cursor.tileInfo()[1]))
            if cursor.tileInfo((-1, 0))[0] == 1 or cursor.tileInfo((1, 0))[0] == 1 or cursor.tileInfo((0, -1))[0] == 1 or cursor.tileInfo((0, 1))[0] == 1 and cursor.tileInfo()[0] != -1:
                cursor.draw((1.1, cursor.tileInfo()[1]))

        offsets = [(-1, 0), (1, 0), (0, -1), (0, 1)]

        for x in range(0, len(globalVars.dungeonTiles)):
            for y in range(0, len(globalVars.dungeonTiles)):
                cursor.xy = (x, y)

                if cursor.tileInfo()[0] == 1:
                    for offset in offsets:
                        cursor.xy = (x + offset[0], y + offset[1])

                        if cursor.tileInfo()[0] != 1.1 and cursor.tileInfo()[0] != 1.2 and cursor.tileInfo()[0] != 1 and cursor.tileInfo()[0] != -1 and cursor.tileInfo()[0] != 0.1:
                            if cursor.tileInfo()[0] != -1:
                                cursor.draw((1.1, cursor.tileInfo()[1]))


def PickWall(x, y, w, h):
    if x:
        myWalls = []
        for wall in globalVars.walls:
            if x+w > wall[0] >= x and y+h > wall[1] >= y:
                myWalls.append(wall)

        if len(myWalls) > 0:
            return myWalls[random.randrange(0, len(myWalls))]
    else:
        return globalVars.walls[random.randrange(0, len(globalVars.walls))]

    return 0


def Carve(wall, side, roomId):
    rx = wall[0]+side[0]
    ry = wall[1]+side[1]
    rw = 1
    rh = 1
    expansions = [[0, 1, 2, 3]]
    corridor = False

    if random.random() < globalVars.corridorPercent: corridor = True
    if corridor: expansions = [[0, 2], [1, 3]]

    expansions = expansions[random.randrange(0, len(expansions))]
    steps = (globalVars.roomSize, globalVars.corridorSize)[corridor]

    for x in range(0, steps):
        if len(expansions) == 0: break

        xd = 0
        yd = 0
        wd = 0
        hd = 0
        side = expansions[random.randrange(0, len(expansions))]

        if side == 0:
            xd = -1
            wd = 1
        elif side == 1:
            yd = -1
            hd = 1
        elif side == 2:
            wd = 1
        elif side == 3:
            hd = 1

        if CheckRoom(rx+xd, ry+yd, rw+wd, rh+hd, roomId):
            rx += xd
            ry += yd
            rw += wd
            rh += hd
        else:
            expansions.remove(side)

    if rw > 1 or rh > 1:
        MakeRoom(rx, ry, rw, rh, None, roomId)

    if rw == 1 or rh == 1:
        corridor = True

    return {'x': rx, 'y': ry, 'w': rw, 'h': rh, 'corridor': corridor}


def CheckRoom(X, Y, W, H, thisRoomId):
    X = int(math.floor(X))
    Y = int(math.floor(Y))
    W = int(math.floor(W))
    H = int(math.floor(H))

    for x in range(X, X+W):
        for y in range(Y, Y+H):
            cursor.xy = (x, y)
            if cursor.tileInfo()[0] != 1 and thisRoomId == -1: return False
            if cursor.tileInfo()[1] != thisRoomId and thisRoomId != -1 and cursor.tileInfo()[0] != 1: return False
            if x < 1 or x >= globalVars.mapSize-1 or y < 1 or y >= globalVars.mapSize-1: return False

    return True


def MakeRoom(X, Y, W, H, tile, roomId):
    X = int(math.floor(X))
    Y = int(math.floor(Y))
    W = int(math.floor(W))
    H = int(math.floor(H))

    for x in range(X, X+W):
        for y in range(Y, Y+H):
            cursor.xy = (x, y)
            if cursor.tileInfo()[0] >= 1:
                cursor.draw(((tile, globalVars.roomId), (0, globalVars.roomId))[not tile])
                globalVars.tilesDug += 1
    for x in range(X-1, X+W+1):
        for y in range(Y-1, Y+H+1):
            cursor.xy = (x, y)
            if cursor.tileInfo()[0] == 1:
                cursor.draw((1.1, globalVars.roomId))
                globalVars.walls.append((x, y))
            elif cursor.tileInfo()[0] == 1.1:
                cursor.draw((1.2, globalVars.roomId))
                globalVars.walls.remove((x, y))

    x = X-1
    y = Y-1
    cursor.xy = (x, y)
    if cursor.tileInfo()[0] == 1.1:
        cursor.draw((1.2, cursor.tileInfo((-1, -1))[1]))
        globalVars.walls.remove((x, y))

    x = X+W
    y = Y-1
    cursor.xy = (x, y)
    if cursor.tileInfo()[0] == 1.1:
        cursor.draw((1.2, cursor.tileInfo((-1, -1))[1]))
        globalVars.walls.remove((x, y))

    x = X-1
    y = Y+H
    cursor.xy = (x, y)
    if cursor.tileInfo()[0] == 1.1:
        cursor.draw((1.2, cursor.tileInfo((-1, -1))[1]))
        globalVars.walls.remove((x, y))

    x = X+W
    y = Y+H
    cursor.xy = (x, y)
    if cursor.tileInfo()[0] == 1.1:
        cursor.draw((1.2, cursor.tileInfo((-1, -1))[1]))
        globalVars.walls.remove((x, y))
