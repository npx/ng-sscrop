var module = angular.module('ng-sscrop', []);

// Scale a given Canvas by "retina" factor and scale it back down with css
//
// sources:
// http://www.html5rocks.com/en/tutorials/canvas/hidpi/
// http://searchvoidstar.tumblr.com/post/86542847038/high-dpi-rendering-on-html5-canvas-some-problems
function makeHighRes(c) {
    var ctx = c.getContext('2d');
    // finally query the various pixel ratios
    var devicePixelRatio = window.devicePixelRatio || 1;
    var backingStoreRatio = ctx.webkitBackingStorePixelRatio ||
        ctx.mozBackingStorePixelRatio ||
        ctx.msBackingStorePixelRatio ||
        ctx.oBackingStorePixelRatio ||
        ctx.backingStorePixelRatio || 1;
    var ratio = devicePixelRatio / backingStoreRatio;
    // upscale canvas if the two ratios don't match
    if (devicePixelRatio !== backingStoreRatio) {
        var oldWidth = c.width;
        var oldHeight = c.height;
        c.width = Math.round(oldWidth * ratio);
        c.height = Math.round(oldHeight * ratio);
        c.style.width = oldWidth + 'px';
        c.style.height = oldHeight + 'px';
        // now scale the context to counter
        // the fact that we've manually scaled
        // our canvas element
        ctx.scale(ratio, ratio);
    }
}

// SSCrop Directive
module.directive('sscrop', function() {
  return {
    replace: 'true',
    restrict: 'E',
    scope: {
      src: '=',
      result: '=',
      w: '@',
      h: '@',
      crop: '=?',
      downscale: '@?', // percentage of how much to downscale the preview
      onLoad: '&?'
    },
    template: '<canvas style="cursor: pointer"></canvas>',
    // templateUrl: 'src/sscrop/sscrop.html',
    link: function(scope, element, attrs) {
      // factor by which the preview / cropping interface is scaled down
      var down = 1, dtmp = scope.downscale / 100;
      var up = 1, utmp = 100 / scope.downscale;
      if (('downscale' in attrs) && (dtmp)) {
        down = dtmp;
        up = utmp;
      }

      // target for the cropping given?
      var cropOutput = 'crop' in attrs;

      // init result
      scope.result.zoom = 100;
      scope.result.pos = { x:0, y:0 };
      scope.result.size = { w: scope.w, h: scope.h };

      // get canvas and set attributes
      var canvas = element[0];
      var context = canvas.getContext('2d');
      // save original canvas size (downscaled for preview)
      var cWidth = scope.w * down;
      var cHeight = scope.h * down;
      // set to downscaled size
      canvas.setAttribute('width', cWidth);
      canvas.setAttribute('height', cHeight);

      // apply retina scaling
      makeHighRes(canvas);

      // offscreen canvas for output
      var offscreen = document.createElement('canvas');
      offscreen.width = scope.w;
      offscreen.height = scope.h;
      // intrinsic position
      var ipos = { x: 0, y: 0 };

      // get things rolling when image is loaded
      var minzoom = 10;
      scope.src.onload = function() {
        // determine the smallest zoom allowed to still fill the box completely
        minzoom = Math.min(Math.ceil(Math.max(scope.w/this.width, scope.h/this.height)*10)*10, 100);
        scope.$apply(function(){
          scope.result.zoom = minzoom;
          // reset pos
          scope.result.pos.x = 0;
          scope.result.pos.y = 0;
          ipos.x = 0;
          ipos.y = 0;
          draw();
        });

        // call callback as image onload will be overwritten
        if ('onLoad' in attrs) scope.onLoad();
      };

      // draw, move and crop the image
      function draw() {
        if (scope.src.width > 0) {
          context.fillStyle = '#ff0ff0';
          context.fillRect(0, 0, canvas.width, canvas.height);

          // zoom factor
          var zf = scope.result.zoom / 100;
          context.drawImage(
            scope.src,
            ipos.x,
            ipos.y,
            (scope.src.width * down) * zf,
            (scope.src.height * down) * zf
          );
        }
      }
      function moveImage(dx, dy) {
        if (scope.src.width > 0) {
          var zf = scope.result.zoom / 100;

          // make sure the image stays in the preview/selection
          var nx = ipos.x + dx;
          nx = Math.min(nx, 0);
          nx = Math.max(nx, cWidth - (scope.src.width * down) * zf);
          nx = Math.ceil(nx);

          var ny = ipos.y + dy;
          ny = Math.min(ny, 0);
          ny = Math.max(ny, cHeight - (scope.src.height * down) * zf);
          ny = Math.ceil(ny);

          // set new position
          ipos.x = nx;
          ipos.y = ny;
          // -1 because a crop doesnt start negative
          scope.result.pos.x = ipos.x * up * -1;
          scope.result.pos.y = ipos.y * up * -1;

          // redraw
          draw();
        }
      }
      function crop() {
        if ((scope.src.width > 0) && (cropOutput)) {
          var m_canvas = offscreen;
          var ctx = m_canvas.getContext('2d');
          var zf = scope.result.zoom / 100;

          // scale the coordinates up to original size
          ctx.drawImage(
            scope.src,
            ipos.x * up,
            ipos.y * up,
            scope.src.width * zf,
            scope.src.height * zf
          );
          var bstr = m_canvas.toDataURL("image/jpeg");
          scope.crop = bstr;
        }
      }

      // redraw on change of zoom
      scope.$watch('result.zoom', function(nv, ov){
        if (nv == ov) return;
        if ((nv < minzoom) || (nv > 100)) {
          scope.result.zoom = Math.max(Math.min(minzoom, 100), minzoom);
        } else {
          // on zoom change enforce boundary calculation
          moveImage(0, 0);
          draw();

          // recrop on zoom change
          crop();
        }
      });

      // dragging implementation
      var dragging = false;
      var lastX = -1;
      var lastY = -1;
      function startDrag(e) {
        lastX = e.layerX;
        lastY = e.layerY;
        dragging = true;
      }
      function stopDrag(e) {
        if (!dragging) return;
        lastX = -1; lastY = -1;
        dragging = false;
        // update crop on drop
        scope.$apply(function(){
          crop();
        });
      }
      function drag(e) {
        if (!dragging) return;
        scope.$apply(function(){
          moveImage(e.layerX - lastX, e.layerY - lastY);
        });
        lastX = e.layerX;
        lastY = e.layerY;
      }

      // dragging events
      element.bind("mousedown", startDrag);
      element.bind("mouseout", stopDrag);
      element.bind("mouseup", stopDrag);
      element.bind("mousemove", drag);
    }
  };
});
