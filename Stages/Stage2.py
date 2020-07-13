import random, math
from PIL import Image

import time

_DEBUG = False

class cordCursor(object):
    xy = (0, 0)

    def tileInfo(self, offset=(0, 0)):
        try:
            return globalVars.dungeonTiles[self.xy[0] + offset[0]][self.xy[1] + offset[1]]
        except IndexError:
            return -1

    def draw(self, type):
        globalVars.dungeonTiles[self.xy[0]][self.xy[1]] = type


class globalsClass(object):
    tileTypes = {0  : (119, 119, 119, 255), #floor
                 1  : (0  , 0  , 0  , 0  ), #void
                 1.1: (61 , 61 , 61 , 255)} #wall

    dungeonTiles = []
    dungeonSize = 0
    rooms = []


class roomClass(object):
    TLxy = (0, 0)


def ReadDungeon():
    dungeonImg = Image.open('centre.png')
    size = dungeonImg.size[0]
    globalVars.dungeonSize = size
    imgData = list(dungeonImg.getdata())

    temp = []
    for x in range(0, size):
        for y in range(0, size):
            if imgData[x + size * y] == (0, 0, 0, 255):
                temp.append(1.1)
            else:
                for z in globalVars.tileTypes:
                    if imgData[x + size * y] == globalVars.tileTypes[z]:
                        temp.append(z)
                        break

        globalVars.dungeonTiles.append(temp)
        temp = []


def ScanRooms():
    tempCoords = []
    for x in range(0, globalVars.dungeonSize):
        for y in range(0, globalVars.dungeonSize):
            cursor.xy = (x, y)
            if cursor.tileInfo() == 0:
                newRoom = True
                for z in globalVars.rooms:
                    if z[1][0] >= x >= z[0][0] and z[1][1] >= y >= z[0][1]:
                        newRoom = False
                        break

                if newRoom:
                    tempCoords.append((x, y))
                    movingDown = True
                    currentCoords = (x, y)
                    while True:
                        if movingDown:
                            currentCoords = (currentCoords[0], currentCoords[1]+1)
                            # moving down
                            cursor.xy = currentCoords
                            if cursor.tileInfo() != 0:
                                # found a wall
                                currentCoords = (currentCoords[0], currentCoords[1]-1)
                                movingDown = False
                        else:
                            currentCoords = (currentCoords[0]+1, currentCoords[1])
                            # moving right
                            cursor.xy = currentCoords
                            if cursor.tileInfo() != 0:
                                # found a wall
                                currentCoords = (currentCoords[0]-1, currentCoords[1])
                                tempCoords.append(currentCoords)
                                break
                    globalVars.rooms.append([tempCoords[0], tempCoords[1]])
                    tempCoords = []


def AssignRooms():
    for x in range(0, len(globalVars.rooms)):
        room = globalVars.rooms[x]

        room1 = room[0]
        room2 = room[1]

        roomX = room2[0] - room1[0] + 1
        roomY = room2[1] - room1[1] + 1

        if roomX > roomY:
            ratio = roomY / roomX
        else:
            ratio = roomX / roomY

        if ratio > 0.25 and roomX > 1 and roomY > 1:
            corridor = False
        else:
            corridor = True

        newRoom = roomClass()

        newRoom.TLxy = room1
        newRoom.BRxy = room2
        newRoom.size = (roomX, roomY)
        newRoom.ratio = ratio
        newRoom.corridor = corridor

        globalVars.rooms[x] = newRoom


def Init():
    global cursor
    global globalVars

    cursor = cordCursor()
    globalVars = globalsClass()

    ReadDungeon()
    ScanRooms()
    AssignRooms()

    for room in globalVars.rooms:
        print("-----------------------------")
        print("ROOM:", (room.TLxy, room.BRxy))
        print("SIZE:", room.size)
        print("RATIO:", room.ratio)
        print("CORRIDOR:", room.corridor)
