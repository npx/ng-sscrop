# Super Simple image Cropper
Very simplistic, but retina ready canvas based image cropper.
You can load an image into the directive, which will display a
draggable scaled crop selection with the same ratio as the
resulting image.

A given object variable is updated with the offset,
zoom level and a data uri for the cropped image.

*It is recommended to use a more elaborate tool to actually perform
the crop based on the determined crop data.*

# Why another cropper?
For my use case the available choices were way too big and feature
rich. I created this very simple and easy to use cropper that only
offers of making a single retina ready crop.

# Usage
  Add `ng-sscrop` to your app's dependencies:

    angular.module('app', ['ng-sscrop']);

  and set up the directive:

    <sscrop src="image" result="result" w="1000" h="700" crop="target" downscale="25" on-load="callback()"></sscrop>

  * **src**  
    an image source
  * **result**  
    a result object the crop will be saved to
  * **w**  
    desired target width of the crop
  * **h**  
    desired target height of the crop
  * **crop** *(optional)*  
    the target to store the cropped data uri in  
    *(this does not work if the canvas is tainted)*
  * **downscale** *(optional)*  
    percentage to downscale the crop window based on the desired
    size of the crop (25 = 25%)  
    *(in the code above the preview of the crop will be 250x175px)*
  * **on-load** *(optional)*  
    callback to replace the image `onload()`

## How do I get the crop data?
While dragging the preview, the given `result` object will be updated as
follows:

    {"zoom":"40","pos":{"x":280,"y":176},"size":{"w":"1000","h":"700"}}

This gives you all the information you need to perform a crop.

Taken from the example (*done on a picture with 5600x3000px*):

* downscale the image to 40%
* crop from (280,176) to (1000+280, 700+176)
* resulting in a picture with 1000x700px

## How do I get a preview of the crop?
On releasing the dragging of the preview, the given `crop` attribute is updated
resulting in a base64 encode of your image. You can load that in `ng-src` if
you so wish.

*Note: Do not use this data and send it to your server, as this is a really
low quality downscaling done on a canvas. Use the crop data to perform the
crop in a more elaborate way.*


# Demo
I provided a demo in the demo folder. Please take a look!

# Todo
* add a simple or elaborate downscaling algorithm
* allow for a custom downscaling algorithm
* add old browser support
* add tests
* add to bower
* host demo on github pages
