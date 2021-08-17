/*************** global init ********************/
var auth = 'KakaoAK accdfd5267af756d07efcd007e13bcee';
var kakaoURL = 'https://dapi.kakao.com/';

/*************** user function ******************/
function getPath(cate) {        // 카카오 api 주소
  return kakaoURL+(cate === 'book' ? 'v3' : 'v2')+'/search/' + cate;
}       // https://dapi.kakao.com/v2/search/web

function getParams(query) {     // 카카오 검색방법
  return {
    params: {query: query},          // 전송하는 데이터 (바디)
    headers: {Authorization: auth}   // 헤더
  }
}

function setTotalCnt(cnt) {     // 검색결과 건수
  $('.result-cnt').html(numberFormat(cnt))
}

function setWebLists(r) {       // web 검색 결과 도출
	$('.lists').empty().attr('class', 'lists web');  // empty로 안비우면 계속 쌓임
	r.forEach(function(v, i) {
		var html = '<li class="list web">';
		html += '<a class="title" href="'+v.url+'" target="_blank">'+v.title+'</a>';
		html += '<p class="content">'+v.contents+'</p>';
		html += '<a class="link" href="'+v.url+'" target="_blank">'+v.url+'</a>';
		html += '<div class="dt">'+moment(v.datetime).format('YYYY-MM-DD HH:mm:ss')+'</div>';
		html += '</li>';
		$('.lists').append(html);
	});
}

function setImageLists(r) {
  $('.lists').empty().attr('class', 'lists image grid-wrap');
  $('.lists').append('<li class="list image grid-sizer"></li>');
  r.forEach(function(v, i) {
    var info = JSON.stringify({
      collection: v.collection,
      width: v.width,
      height: v.height,
      src: v.image_url,
      thumb: v.thumbnail_url,
      name: v.display_sitename,
      url: v.doc_url,
      dt: v.datetime
    });
    var html = '<li class="list image grid-item" data-info=\''+info+'\'>';
    html += '<img src="'+v.thumbnail_url+'" class="w100">';
    html += '<div class="info"></div>';
    html += '</li>';
    $(html).appendTo('.lists').click(onModalShow);
  });
  var $grid = $('.grid-wrap').masonry({
    itemSelector: '.grid-item',
    columnWidth: '.grid-sizer',
    percentPosition: true
  });
  $grid.imagesLoaded().progress( function() {
    $grid.masonry('layout');
    $grid.masonry('reloadItems');
  });
}

function setBlogLists(r) {
	$('.lists').empty().attr('class', 'lists blog');
	r.forEach(function(v, i) {
  var html  = '<li class="list">';
  html += '<a class="thumbs" href="'+v.url+'" target="_black">';
  html += '<img src="'+v.thumbnail+'" alt="'+v.title+'" class="w100">';
  html += '</a>';
  html += '<div class="contents">';
  html += '<a class="title" href="'+v.url+'" target="_black">'+v.title+'</a>';
  html += '<p class="content">'+v.contents+'</p>';
  html += '<a class="name" href="'+v.url+'" target="_black">'+v.blogname+'</a> | <a href="'+v.url+'" class="link" target="_black">'+v.url+'</a>';
  html += '<div class="dt">'+moment(v.datetime).format('YYYY-MM-DD')+'</div>';
  html += '</div>';
  html += '</li>';
  $('.lists').append(html);
	});
}

function setClipLists(r) {
  console.log(r);
	$('.lists').empty().attr('class', 'lists clip');
	r.forEach(function(v, i) {
  var html  = '<li class="list">';
  html += '<a class="thumbs" href="'+v.url+'" target="_black">';
  html += ' <img src="'+v.thumbnail+'" alt="'+v.title+'" class="w100">';
  html += '</a>';
  html += '<div class="contents">';
  html += ' <a class="title" href="'+v.url+'" target="_black">'+v.title+'</a>';
  html += ' <div>'
  html += '   <a class="author" href="'+v.url+'" target="_black">'+v.author+'</a>';
  html += '   <span class="play-time">'+getPlayTime(v.play_time)+'</span>';
  html += ' </div>'
  html += ' <a href="'+v.url+'" class="link" target="_black">'+v.url+'</a>';
  html += ' <div class="dt">'+moment(v.datetime).format('YYYY-MM-DD')+'</div>';
  html += '</div>';
  html += '</li>';
  $('.lists').append(html);
	});
}

function setBookLists(r) {
  
}

function setCafeLists(r) {
  
}


/*************** event callback *****************/
function onSubmit(e) {
	e.preventDefault();  // 이게 없으면 나한테 보냄 -> 카카오로 ㄱㄱ
	var cate = $(this).find('select[name="category"]').val().trim();
	var query = $(this).find('input[name="query"]').val().trim();
  if(cate && cate !== '' && query && query !== '')
  axios.get(getPath(cate), getParams(query)).then(onSuccess).catch(onError);
  else
  $(this).find('input[name="query"]').focus();
  // axios.get().then().catch();
}

function onModalShow() {
  var v = $(this).data('info');
  $('.modal-wrapper').show();
  $('.modal-wrapper .img-wp img').attr('src', v.src);
  $('.modal-wrapper .img-wp img').data('thumb', v.thumb);
  $('.modal-wrapper .size-wp').html(v.width + ' x ' + v.height);
  $('.modal-wrapper .collection').html('['+v.collection+'] ');
  $('.modal-wrapper .name').html(v.name);
  $('.modal-wrapper .link').attr('href', v.url).html(v.url);
  $('.modal-wrapper .dt').html(moment(v.datetime).format('YYYY-MM-DD HH:mm:ss'));
}

function onLoadError(el) {
  $('.modal-wrapper .img-wp img').attr('src', $(el).data('thumb'));
}

function onSuccess(res) {
  var cate = res.config.url.split('/').pop();
  var v = res.data;
  setTotalCnt(v.meta.total_count);
  switch(cate) {
    case 'web' :
      setWebLists(v.documents);
      break;
    case 'image' :
      setImageLists(v.documents);
      break;
    case 'blog' :
      setBlogLists(v.documents);
      break;
    case 'vclip' :
      setClipLists(v.documents);
      break;
    case 'book' :
      setBookLists(v.documents);
      break;
    case 'cafe' :
      setCafeLists(v.documents);
      break;
  }
}

function onError(err) {
  
}

/*************** event init *********************/
$('.search-form').submit(onSubmit);

/*************** start init *********************/

