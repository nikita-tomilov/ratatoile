
const mapDataToTemplate = (data) => {
    const newEl = document.createElement("a");
    newEl.className = "item-dishes";
    newEl.href="#";

    let clone = document.importNode(
        document.getElementById("menuItem").content,
        true
    );
    newEl.appendChild(clone);
    newEl.children[0].children[0].innerText = data.price;
    newEl.children[0].children[1].innerText = data.name;
    newEl.children[1].src = data.img;

    return newEl;
}

const applyMenuData = (receivedData) => {
    const menuItems = receivedData.menu.map(el => el.dish);
    const menuCarousel = document.getElementById("menuCarousel");
    if (menuCarousel == null) {
        return Promise.resolve();
    }

    menuItems.forEach(el => {
        const img = getImg(el.photoId);
        const newEl = mapDataToTemplate({ ...el, img });
        menuCarousel.appendChild(newEl);
    });

    return Promise.resolve();
}

const getImg = (photoId) => {
    if(photoId === null) {
        return "img/filler.png";
    } else{
        return window.location.origin + "/freeapi/1.0/menu/dishphoto/"+photoId;
    }
};

const getMenuData = () => {
    const url = window.location.origin + "/freeapi/1.0/menu/get"
    const menuNotAvailable = {
        "menu": [{
            "id": 0,
            "addedAt": 0,
            "menuPosition": 1,
            "dish": {
                "id": 0,
                "name": "Меню пока недоступно",
                "description": "Меню пока недоступно",
                "price": 9999.0,
                "photoId": null,
                "ingredients": []
            }
        }]
    }
    // applyMenuData({"menu":[{"id":1,"addedAt":0,"menuPosition":1,"dish":{"id":1,"name":"Паста карбонара с коричневой шнягой","description":"Паста карбонара с коричневой шнягой","price":9999.0,"photoId":0,"ingredients":[]}},{"id":2,"addedAt":0,"menuPosition":2,"dish":{"id":2,"name":"Мяско с овощами","description":"Мяско с овощами","price":9999.0,"photoId":null,"ingredients":[{"entryId":15,"ingredientId":2,"name":"мясо","amount":500.0}]}},{"id":3,"addedAt":0,"menuPosition":3,"dish":{"id":3,"name":"Руссиано","description":"Лучший напиток в истории человечества","price":999.0,"photoId":null,"ingredients":[]}}]});
    return $.ajax({
        url,
        method: "GET"
    }).then((data, status) => {
        if (status === "success") {
            return applyMenuData(data);
        }
        return applyMenuData(menuNotAvailable);
    }).catch((reason) => {
        console.log(reason);
        return applyMenuData(menuNotAvailable);
    });
}

getMenuData().then(() => (function ($) {

    'use strict';
    // loader
    var loader = function () {
        setTimeout(function () {
            if ($('#loader').length > 0) {
                $('#loader').removeClass('show');
            }
        }, 1);
    };
    loader();


    $('nav .dropdown').hover(function () {
        var $this = $(this);
        $this.addClass('show');
        $this.find('> a').attr('aria-expanded', true);
        $this.find('.dropdown-menu').addClass('show');
    }, function () {
        var $this = $(this);
        $this.removeClass('show');
        $this.find('> a').attr('aria-expanded', false);
        $this.find('.dropdown-menu').removeClass('show');
    });


    $('#dropdown04').on('show.bs.dropdown', function () {
        console.log('show');
    });

    // home slider
    $('.home-slider').owlCarousel({
        loop: true,
        autoplay: true,
        margin: 0,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: true,
        autoplayHoverPause: true,
        items: 1,
        navText: ["<span class='ion-chevron-left'></span>", "<span class='ion-chevron-right'></span>"],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: true
            }
        }
    });

    $('.home-slider-loop-false').owlCarousel({
        loop: false,
        autoplay: true,
        margin: 0,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: true,
        autoplayHoverPause: true,
        items: 1,
        navText: ["<span class='ion-chevron-left'></span>", "<span class='ion-chevron-right'></span>"],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 1,
                nav: false
            },
            1000: {
                items: 1,
                nav: true
            }
        }
    });

    // owl carousel
    var majorCarousel = $('.js-carousel-1');
    majorCarousel.owlCarousel({
        loop: true,
        autoplay: true,
        stagePadding: 7,
        margin: 20,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: true,
        autoplayHoverPause: true,
        items: 3,
        navText: ["<span class='ion-chevron-left'></span>", "<span class='ion-chevron-right'></span>"],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 2,
                nav: false
            },
            1000: {
                items: 3,
                nav: true,
                loop: false
            }
        }
    });

    // owl carousel
    var major2Carousel = $('.js-carousel-2');
    major2Carousel.owlCarousel({
        loop: true,
        autoplay: true,
        stagePadding: 7,
        margin: 20,
        animateOut: 'fadeOut',
        animateIn: 'fadeIn',
        nav: true,
        autoplayHoverPause: true,
        items: 4,
        navText: ["<span class='ion-chevron-left'></span>", "<span class='ion-chevron-right'></span>"],
        responsive: {
            0: {
                items: 1,
                nav: false
            },
            600: {
                items: 3,
                nav: false
            },
            1000: {
                items: 4,
                nav: true,
                loop: false
            }
        }
    });


    $('.centernonloop').owlCarousel({
        center: true,
        items: 1,
        loop: false,
        margin: 10,
        dots: true,
        responsive: {
            600: {
                items: 3
            }
        }
    });


    var contentWayPoint = function () {
        var i = 0;
        $('.element-animate').waypoint(function (direction) {

            if (direction === 'down' && !$(this.element).hasClass('element-animated')) {

                i++;

                $(this.element).addClass('item-animate');
                setTimeout(function () {

                    $('body .element-animate.item-animate').each(function (k) {
                        var el = $(this);
                        setTimeout(function () {
                            var effect = el.data('animate-effect');
                            if (effect === 'fadeIn') {
                                el.addClass('fadeIn element-animated');
                            } else if (effect === 'fadeInLeft') {
                                el.addClass('fadeInLeft element-animated');
                            } else if (effect === 'fadeInRight') {
                                el.addClass('fadeInRight element-animated');
                            } else {
                                el.addClass('fadeInUp element-animated');
                            }
                            el.removeClass('item-animate');
                        }, k * 100);
                    });

                }, 100);

            }

        }, {offset: '95%'});
    };
    contentWayPoint();

    $('#datetimepicker1').datetimepicker({
        lang: 'ru',
        format: 'd.m.Y H:i',
        minDate: 0,
        allowTimes:['12:00','13:00','14:00','15:00','16:00','17:00','18:00','19:00','20:00','21:00','22:00','23:00']
    });


})(jQuery));
