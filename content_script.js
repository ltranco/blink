var container = $("body");
var selection = $('<div>').addClass('selectionBox');

container.css({
    "user-select": "none"
});

container.on('mousedown', function(e) {
    var click_y = e.pageY;
    var click_x = e.pageX;

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

    container.on('mousemove', function(e) {
        var move_x = e.pageX,
            move_y = e.pageY,
            width  = Math.abs(move_x - click_x),
            height = Math.abs(move_y - click_y),
            new_x, new_y;

        new_x = (move_x < click_x) ? (click_x - width) : click_x;
        new_y = (move_y < click_y) ? (click_y - height) : click_y;

        selection.css({
          'width': width,
          'height': height,
          'top': new_y,
          'left': new_x
        });
    }).on('mouseup', function(e) {
        var list = get_elements(click_x, click_y, e.pageX, e.pageY);
        /*for(var i = 0; i < list.length; i++) {
          console.log(list[i]);
          chrome.downloads.download({url: list[i]});
        }*/
        chrome.runtime.sendMessage({url: "http://cseweb.ucsd.edu/~ricko/CSE8B/Syllabus.html"}, function(response) {console.log(response.result)});
        
        container.off('mousemove');
        selection.remove();
    });
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

            if(
                (
                    ((x1 >= element_x1 && x1 <= element_x2) && (y1 >= element_y1 && y1 <= element_y2)) ||
                    ((x2 >= element_x1 && x2 <= element_x2) && (y1 >= element_y1 && y1 <= element_y2)) ||
                    ((x2 >= element_x1 && x2 <= element_x2) && (y2 >= element_y1 && y2 <= element_y2)) ||
                    ((x1 >= element_x1 && x1 <= element_x2) && (y2 >= element_y1 && y2 <= element_y2))
                ) ||
                (
                    ((element_x1 >= x1 && element_x1 <= x2) && (element_y1 >= y1 && element_y1 <= y2)) ||
                    ((element_x2 >= x1 && element_x2 <= x2) && (element_y1 >= y1 && element_y1 <= y2)) ||
                    ((element_x2 >= x1 && element_x2 <= x2) && (element_y2 >= y1 && element_y2 <= y2)) ||
                    ((element_x1 >= x1 && element_x1 <= x2) && (element_y2 >= y1 && element_y2 <= y2))
                )
            )

            {

                element_list.push(this.href);
            }
        }
    });

    return element_list;
}