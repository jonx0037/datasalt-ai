from PIL import Image
import numpy as np

img = Image.open('public/images/logo/datasalt-logo.png').convert('RGBA')
arr = np.array(img)

r, g, b, a = arr[:,:,0], arr[:,:,1], arr[:,:,2], arr[:,:,3]
# Text is dark blue roughly R<50, G<60, B<100
mask = (r < 50) & (g < 60) & (b < 100) & (a > 20)

arr[:,:,0][mask] = 255
arr[:,:,1][mask] = 255
arr[:,:,2][mask] = 255

out = Image.fromarray(arr)
out.save('public/images/logo/datasalt-logo-dark.png')
print("Saved datasalt-logo-dark.png successfully.")
