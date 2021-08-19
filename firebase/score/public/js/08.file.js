/*************** global init ********************/
var auth = firebase.auth();
var database = firebase.database();
var storage = firebase.storage();
var googleAuth = new firebase.auth.GoogleAuthProvider();
var dbRoot = database.ref('root/uploads');
var stRoot = storage.ref().child('imgs');
var user = null;
var allowExt = ['jpg', 'jpeg', 'png', 'gif', 'mp4'];

/*************** user function ******************/
function genFile() {
  var folder = moment().format('YYYYMMDDHH')
  return {
    folder: folder,
    file: folder + '_' + uuidv4()
  }
}

/*************** event callback *****************/
function onAuthChanged(r) {
  user = r;
  if(user) {
    $('.bt-login').hide();
    $('.bt-logout').show();
  }
  else {
    $('.bt-login').show();
    $('.bt-logout').hide();
  }
}

function onLogin() {
  auth.signInWithPopup(googleAuth);
}

function onLogout() {
  auth.signOut();
}

function onSubmit(e) {
  e.preventDefault();
  var el = document.querySelector('input[name="upfile"]');
  if (el.files.length && user) {
    var file = el.files[0];
    if(allowExt.indexOf( file.name.split('.').pop().toLowerCase()) > -1 ) {
      var savename = genFile();
      var uploader = stRoot.child(savename.folder).child(savename.file).put(file);
      uploader.on('state_changed', onUploading, onUploadError, onUploaded);
    }
    else alert('업로드 가능한 파일은 이미지 또는 mp4영상 입니다.')
  }
  else if(user === null) {
    alert('로그인 후 시도해 주세요.')
  }
  else {
    $('.input[name="upfile"]').focus();
  }

  function onUploading(snapshot) {
    console.log('uploading', snapshot.bytesTransferred);
    console.log('uploading', snapshot.totalBytes);
    console.log('================================');
    upfile = snapshot;
  }
  
  function onUploaded() {
    upfile.ref.getDownloadURL().then(onSuccess).catch(onError);
  }
  
  function onUploadError(err) {
    if(err.code === 'storage/unauthorized') location.href = '../403.html'
    else console.log('error', err);
  }
  
  function onSuccess(r) {
    if(file.type.split('/')[0] === 'image') {
      $('.main-img').attr('src', r).show();
      $('.main-video').hide();
    }
    else if(file.type.split('/')[0] === 'video') {
      $('.main-img').hide();
      $('.main-video').attr('src', r).show();
    }

    var saveData = {
      oriname: file.name,
      savename: savename.file,
      path: 'imgs/' + savename.folder,
      type: file.type,
      size: file.size
    }
    console.log(file);
    dbRoot.push(saveData);
  }
  
  function onError(err) {
    console.log(err);
  }
}


/*************** event init *********************/
auth.onAuthStateChanged(onAuthChanged);
$('form[name="uploadForm"]').submit(onSubmit);
$('.bt-login').click(onLogin);
$('.bt-logout').click(onLogout);

/*************** start init *********************/

