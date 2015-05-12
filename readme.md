# Why another cropper?
For my use case the available choices were way too big and feature
rich. I created this very simple and easy to use cropper that only
offers of making a single retina ready crop.

# Usage
    <sscrop src="image" result="result" w="1000" h="700" downscale="25" on-load="callback()"></sscrop>

  * **src**  
    an image source
  * **result**  
    a result object the crop will be saved to
  * **w**  
    desired target width of the crop
  * **h**  
    desired target height of the crop
  * **downscale**  
    percentage to downscale the crop window based on the desired
    size of the crop (25 = 25%)  
    *(in the code above the preview of the crop will be 250x175px)*
  * **on-load**  
    callback to replace the image `onload()`

# Demo
I provided a demo in the demo folder. Please take a look!
