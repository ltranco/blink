var container = $("body");
var selection = $('<div>').addClass('selectionBox');
var mouseDown = false;
var selected = false;

chrome.runtime.sendMessage({cmd: "getStatus"}, function(response) {
  if(response) {
    //container.css("background-color", "green");
    //Hide default select
    container.css("user-select", "none");

    container.on('mousedown', function(e) {
        //Register mouseDown event
        mouseDown = true;
        selected = false;

        //Record first click coordinates
        var click_y = e.pageY;
        var click_x = e.pageX;

        //Adding the rectangle selection
        selection.css({  
          'top':    click_y,
          'left':   click_x,
          'width':  0,
          'height': 0,
          'background-color': "#ff5050",
          'position': 'absolute',
          'opacity': 0.5,
          'z-index': 9999
        });
        selection.appendTo(container);

        //Distinguish between a click and a drag event. 
        //If mouseup is fired, then it is a click, else a drag.
        container.on("mouseup", function(e) {
          mouseDown = false;
        });

        //On mousemove event
        container.on('mousemove', function(e) {
          //Only expand the rectangle on a drag event
          if(mouseDown) {
            selected = true;

            //Record current mouse's coordinates and calculate offsets
            var move_x = e.pageX,
                move_y = e.pageY,
                width  = Math.abs(move_x - click_x),
                height = Math.abs(move_y - click_y),
                new_x, new_y;

            new_x = (move_x < click_x) ? (click_x - width) : click_x;
            new_y = (move_y < click_y) ? (click_y - height) : click_y;

            //Expand the rectangle selection
            selection.css({
              'width': width,
              'height': height,
              'top': new_y,
              'left': new_x
            });
          }
        }).one("mouseup", function(e) {
          //On a mouseup event after a drag, remove the rectangle selection
          container.off("mousemove");
          selection.remove();

          if(selected) {
            //Grab all elements in bound
            var list = get_elements(click_x, click_y, e.pageX, e.pageY);
            list = list.concat(get_elements(e.pageX, e.pageY, click_x, click_y));
            
            //Make sure all URLs are unique
            var dict = {};
            for(var i = 0; i < list.length; i++) {
              if(!(list[i] in dict)) {
                dict[list[i]] = 0;
              }
            }

            //Download all URLs
            for(key in dict) {
              chrome.runtime.sendMessage({url: key}, function(response) {});
            }
          }
        });
    });
  }
});

function get_elements(x1, y1, x2, y2) {
    var element_list = [];

    $('body a').each(function() {
        if(!($(this).attr('class') == 'selectionBox')) {
            var offset = $(this).offset();

            var element_x1 = offset.left;
            var element_y1 = offset.top;
            var element_x2 = offset.left + $(this).width();
            var element_y2 = offset.top + $(this).height();

            if(((x1 >= element_x1 && x1 <= element_x2 && y1 >= element_y1 && y1 <= element_y2) ||
                (x2 >= element_x1 && x2 <= element_x2 && y1 >= element_y1 && y1 <= element_y2) ||
                (x2 >= element_x1 && x2 <= element_x2 && y2 >= element_y1 && y2 <= element_y2) ||
                (x1 >= element_x1 && x1 <= element_x2 && y2 >= element_y1 && y2 <= element_y2)) ||
                ((element_x1 >= x1 && element_x1 <= x2) && (element_y1 >= y1 && element_y1 <= y2) ||
                (element_x2 >= x1 && element_x2 <= x2) && (element_y1 >= y1 && element_y1 <= y2) ||
                (element_x2 >= x1 && element_x2 <= x2) && (element_y2 >= y1 && element_y2 <= y2) ||
                (element_x1 >= x1 && element_x1 <= x2) && (element_y2 >= y1 && element_y2 <= y2))) {
                  element_list.push(this.href);
            }
        }
    });
    return element_list;
}