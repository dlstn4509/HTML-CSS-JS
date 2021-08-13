/*************** global init ********************/
var auth = 'KakaoAK accdfd5267af756d07efcd007e13bcee';

/*************** user function ******************/
function getPath(cate) {
  return 'https://dapi.kakao.com/'+(cate === 'book' ? 'v3' : 'v2')+'/search/' + cate;
}

function getParams(query) {
  return {
    params: {query: query},
    headers: {Authorization: auth}
  }
}


/*************** event callback *****************/
function onSubmit(e) {
	e.preventDefault();
	var cate = $(this).find('select[name="category"]').val().trim();
	var query = $(this).find('input[name="query"]').val().trim();
	axios.get(getPath(cate), getParams(query)).then(onSuccess).catch(onError);
}

function onSuccess(res) {
  console.log(res);
}

function onError(err) {
  console.log(err);
}

/*************** event init *********************/
$('.search-form').submit(onSubmit);

/*************** start init *********************/
