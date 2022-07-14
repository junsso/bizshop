$(function(){
/*-----------------------------------------------
@contents
------------------------------------------------*/
	
	/*헤더 서치박스 스크립트*/
	$('#header .search-box .input_box').on('mouseenter', function(){
		$(this).addClass('active');
	});
	$('#header .search-box .input_box').on('mouseleave', function(){
		$(this).removeClass('active');
	});

	//서치박스를 제외한 다른곳을 클릭시 닫기
	/*$(document).mouseleave(function (e) {

		var container = $("#header .search-box .input_box");

		if (!container.is(e.target) && container.has(e.target).length === 0){

			container.removeClass('active');

		}	

	});*/

	/*gnb 카테고리 mouseover*/
	$('ul.big-gnb > li.category, .category-sub').mouseover(function(){
		$('.gnb-wrap').addClass('active');
	});

	$('ul.big-gnb > li.category, .category-sub').mouseleave(function(){
		$('.gnb-wrap').removeClass('active');
	});



	/*주문,발주 알림배너 스크립트*/
	$('.order-notive-wrap .close-box').click(function(){
		$('.order-notive-wrap').hide();
	});



	/*최근본상품 사이드메뉴바 스크롤*/

	var currentPosition = parseInt($("#sidebar").css("top"));

	$(window).scroll(function() {

		var position = $(window).scrollTop();

		$("#sidebar").stop().animate({"top":position+currentPosition+"px"},100);

	});
	
	/*최근본상품 slick*/

	$(".new-see-wrap").slick({
			vertical: true,
			slidesToShow: 3,
			slidesToScroll: 1,
			autoplay: false,
			autoplaySpeed: 3000,
			arrows: true,
			verticalSwiping: true
		});



	/*메인visual 스크립트*/
	var mySwiper = new Swiper('.swiper-container', {
		speed: 400,
		autoplay: {
			delay: 3000,
		},
	});


	// 팝업 스크립트
	$('[data-popup]').on('click', function(){
		var popupName = $(this).data('popup');
		
		$('body').addClass('active-popup');
		$('#'+popupName+'Popup').addClass('show');
	});

	// 팝업 닫기
	$('.popup-overlay, .close-popup').on('click', function(){
		$('.active-popup').removeClass('active-popup');
		$('.popup').removeClass('show');
	});

	
	//장바구니 팝업 갯수
	// 개수 조절 하면 장바구니 합계 영역 바뀌는 event
	function cartTotalView () {
		// 장바구니 페이지에서만 쓸거기 때문에 다른페이지에서는 return false
		if ($('.cart-page').length < 1) return false;

		var totalPrice = 0;
		var defaultPrice = 0;
		var salePrice = 0;
		var discount = 0;

		$('[name ^= "ct_qty"]').each(function (i, e) {
			var qty = Number(this.value);
			var saleP = Number($(this).data('price'));
			var defaultP = Number($(this).data('default'));
			salePrice += (qty * saleP);
			defaultPrice += (qty * defaultP);
		});

		$('.view-total-price2').each(function (i, e) {
			totalPrice += Number($(e).text().replace(/[^0-9]/g,""));
		});

		discount = (defaultPrice - salePrice);
		var minusTxt = (discount < 1) ? '' : '-';
		$('.default-total-view').text(defaultPrice.toLocaleString() + '원');
		$('.discount-total-view').text(minusTxt + discount.toLocaleString() + '원');
		$('.cart-total-view').text(totalPrice.toLocaleString() + '원');

		var savePriceView = $('.save-price-view');
		var savePriceType = savePriceView.data('type');
		var savePricePoint = Number(savePriceView.data('point'));
		var savePrice = 0;
		switch (savePriceType) {
			case 'PERCENT': savePrice = Math.floor((totalPrice * savePricePoint) / 100); break;
			case 'WON': savePrice = savePricePoint; break;
		}

		savePriceView.text(savePrice.toLocaleString() + '원');
	}

	$(document).on('click', '.qty-controls .qty-button', function () {
		var pt = $(this).parents('.qty-controls');
		var pt2 = $(this).parents('.cart-item');
		var minQty = Number($('.qty-minus', pt).data('min'));
		var maxQty = Number($('.qty-plus', pt).data('max'));
		var qty = $('.qty', pt);
		var sellType = Number(qty.data('sell_type'));
		var calc = (this.value === '+') ? 1 : -1;
		var result = Number(qty.val()) + calc;
		var price = Number(qty.data('price'));
		var viewTotal = $('.view-total-price');
		var viewTotal2 = $('.view-total-price2', pt2);
		var totalPrice = 0;
		var totalQty = 0;

		if (sellType !== 1) {
			minQty = 0;
			maxQty = 0;
		}

		var compare = (calc === 1) ? (result > maxQty && maxQty > 0) : (result < minQty);
		var defaultValue = (calc === 1) ? maxQty : minQty;

		result = compare ? defaultValue : result;
		qty.val(result);

		if (sellType !== 1) {
			var controls = (pt2.length < 1) ? $('.qty-controls') : $('.qty-controls', pt2);
			controls.each(function (i,e) {
				var n = Number($('.qty', this).val().replace(/[^0-9]/g,""));
				var p = Number($('.qty', this).data('price'));
				totalPrice += (n * p);
				totalQty += n;
			});
		} else {
			totalPrice = (price * result);
		}
		$('.view-total-qty').text(totalQty.toLocaleString() + $('.view-total-qty').data('unit'));
		viewTotal.text(totalPrice.toLocaleString() + '원');
		viewTotal2.text(totalPrice.toLocaleString());

		if (result > 0) {
			$(this).parents('.option-row').addClass('active');
			$(this).parents('.item_Cart_listBox').addClass('active');
		} else {
			$(this).parents('.option-row').removeClass('active');
			$(this).parents('.item_Cart_listBox').removeClass('active');
		}

		var tmpObj = {
			'it_id': $(this).data('it_id'),
			'ct_id': $(this).data('ct_id'),
			'ct_box_qty': qty.val()
		}
		cartQtyUpdate(tmpObj);
		cartTotalView();
	});


	$(document).on('change focusout', '.qty-controls .qty', function () {
		var pt = $(this).parents('.qty-controls');
		var pt2 = $(this).parents('.cart-item');
		var minQty = Number($('.qty-minus', pt).data('min'));
		var maxQty = Number($('.qty-plus', pt).data('max'));
		var qty = $(this);
		var sellType = Number($(this).data('sell_type'));
		var price = Number(qty.data('price'));
		var viewTotal = $('.view-total-price');
		var viewTotal2 = $('.view-total-price2', pt2);
		var totalPrice = 0;

		if (this.value > maxQty && maxQty > 0) {
			this.value = maxQty;
		}

		if (this.value < minQty) {
			this.value = minQty;
		}

		if (sellType !== 1) {
			var controls = (pt2.length < 1) ? $('.qty-controls') : $('.qty-controls', pt2);
			controls.each(function (i,e) {
				var n = Number($('.qty', this).val().replace(/[^0-9]/g,""));
				var p = Number($('.qty', this).data('price'));
				totalPrice += (n * p);
			});
		} else {
			totalPrice = (price * this.value);
		}
		
		viewTotal.text(totalPrice.toLocaleString() + '원' );
		viewTotal2.text(totalPrice.toLocaleString());

		cartTotalView();
	});



	/*상세페이지 썸네일*/

	$('.pro-imgbox').slick({
	  slidesToShow: 1,
	  slidesToScroll: 1,
	  arrows: false,
	  fade: true,
	  asNavFor: '.pro-sub-box'
	});

	$('.pro-sub-box').slick({
	  slidesToShow: 5,
	  slidesToScroll: 1,
	  asNavFor: '.pro-imgbox',
	  dots: true,
	  centerMode: false,
	  focusOnSelect: true,
	});



	 /*플로팅배너 마이페이지 좌측navi

	var defaultTop=parseInt($('#my-sidebar').css("top"));
	 var margin=300;
	 var margin_y=$(".div-contain").height()-margin;
	 var margin_top=Math.floor((margin_y*($(document).height()-$(window).height()))/ $(".div-contain").height());

    $(window).scroll(function(){
        var scv=$(window).scrollTop();
		var top_y=0;
		if(scv>=margin_top){
			top_y=$(".div-contain").height()-margin-$("#my-sidebar").height();
			console.log("in")
		}else{
			top_y=scv+defaultTop;
		}
		$("#my-sidebar").stop().animate({top:top_y+"px"},100)
    }); */	
	 

});
