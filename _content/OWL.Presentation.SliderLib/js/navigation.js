//Checks if element is fully in Viewport
function isElementInViewportWidth(el) {
    var rect = el.getBoundingClientRect();
    // console.log(rect);
    // console.log(window.innerWidth + ' ' + document.documentElement.clientWidth );
    return (
        // rect.top >= 0 &&
        rect.left >= 0 &&
        // rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) && /* or $(window).height() */
        Math.floor(rect.right) <= (window.innerWidth || document.documentElement.clientWidth) /* or $(window).width() */
    );
};

function scrollCarousel(el, items, right) {
    var firstVisible, lastVisible, visibleElements = 0
    // var toScroll = 0; // This is for manually scrolling with numbers
    for (i = 0; i < items.length; i++) {
        var isVisible = isElementInViewportWidth(items[i]);
        // console.log(i+':'+isVisible);
        if (isVisible) { 
            // toScroll += items[i].offsetWidth; // This is for manually scrolling with numbers
            visibleElements++; // This is for scrolling with elements.
        };
        if (firstVisible == null && isVisible) { firstVisible = i; }
        if (firstVisible != null && !isVisible) { lastVisible = i - 1; break; }
        if (i == items.length - 1) { lastVisible = i; if (firstVisible == null) { firstVisible = i; } break; }
    }
    // This is for scrolling with elements (scrollIntoView)
    var scrollTo;
    if(right) {
        if(lastVisible==(items.length-1)){scrollTo=items[0];}
        else {scrollTo=items[lastVisible+1];}
    } else {
        if(firstVisible==0){scrollTo=items[items.length-1];}
        else if((firstVisible-visibleElements) < 0) {scrollTo=items[0];}
        else { scrollTo=items[firstVisible-visibleElements];}
    }
    scrollTo.scrollIntoView({block: "center", inline: "start", behavior: "smooth"});
    // console.log('firstVisible: '+firstVisible+' lastVisible: '+lastVisible+' visibleElements: '+visibleElements);
    // console.log(scrollTo);

    // This is for manually scrolling with numbers (scrollLeft)
    // if (right) {
    //     if (lastVisible == (items.length-1)) { toScroll = -el.scrollWidth }
    // }
    // else { toScroll = -toScroll; if (el.scrollLeft <= 0) { toScroll = el.scrollWidth } }
    // if (toScroll == 0) { toScroll = el.offsetWidth }
    // el.scrollBy({top:0,left:toScroll,behavior:"smooth"});// = (el.scrollLeft + toScroll);
    // console.log(el);
    // console.log(items);
    // console.log('toScroll: '+toScroll+' firstVisible: '+firstVisible+' lastVisible: '+lastVisible+' scrollLeft: '+el.scrollLeft+' scrollWidth: '+el.scrollWidth);
}; 