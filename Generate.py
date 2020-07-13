import time
from Stages import Stage1
from Stages import Stage2

import matplotlib.pyplot as plt
import matplotlib.image as mpimg

timeVeryStart = time.time()
Stage1.Init()

print("stage 1 took {} seconds".format(time.time() - timeVeryStart))
timeStart = time.time()

Stage2.Init()

print("stage 2 took {} seconds".format(time.time() - timeStart))


print("entire generation took {} seconds".format(time.time() - timeVeryStart))

img = mpimg.imread('centre.png')
imgplot = plt.imshow(img)
plt.show()