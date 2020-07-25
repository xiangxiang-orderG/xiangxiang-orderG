// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAT2VGelItKB8ujdHvNAKmAZpUZPqCbebw",
  authDomain: "orderg-96439.firebaseapp.com",
  databaseURL: "https://orderg-96439.firebaseio.com",
  projectId: "orderg-96439",
  storageBucket: "orderg-96439.appspot.com",
  messagingSenderId: "387288071956",
  appId: "1:387288071956:web:b62b97e4bf4a8adec24c01",
  measurementId: "G-7HT7QZZMXP"
};
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
// firebase.analytics();

/** 宣告 */
const db = firebase.database(); // DB
const $card = $('#card'); // 卡片
const $dialogDiv = $('.dialogDiv'); // dialog區塊
const $next = $('#next'); // 下一號
let color, order; // 目前號碼與顏色

setDialog(false); //  預設關閉dialog

/** 監聽目前號碼 */
db.ref('/').on('value',e => {
  const now = e.val().now;
  if($card.hasClass('init')){
    // 初始設置顏色
    $card.removeClass('init').addClass(now.color);
  }else if(!$card.hasClass(now.color)){
    // 異色換號
    $card.removeClass(getAnotherColor(now.color)).addClass(now.color);
  }
  // 設置號碼
  color = now.color;
  order = now.order;
  $card.text(order);
});

/**
 * 取得另外一個顏色
 * @param {string} nowColor - 目前顏色
 * @returns {string} - 另外一個顏色
 */
function getAnotherColor(nowColor){
  let anotherColor;
  if(nowColor=='blue'){
    anotherColor = 'red';
  }else if(nowColor=='red'){
    anotherColor = 'blue';
  }
  return anotherColor;
}

/** 再念一次 */
$('#readOneMore').click(function(){
  $('#s_' + color + order)[0].play(); // 叫號
});

/** 開啟前往選擇視窗 */
$('#go').click(function(){
  setDialog(true);
});

/** 取消前往選擇視窗 */
$('#goCancel').click(function(){
  setDialog(false);
});

/** 前往該號 */
$('#goGo').click(function(){
  const goColor = $('[name="colorChoose"]:checked').val();
  const goOrder = parseInt($('#orderChoose').val(), 10);
  updateOrder(goColor, goOrder); // 更新號碼牌
  $('#s_' + goColor + goOrder)[0].play(); // 叫號
  $('#readOneMore').trigger('click');
  setDialog(false);
});

/**
 * 設置dialog
 * @param {boolean} open - 開啟或關閉
 */
function setDialog(open){
  if(open){
    // 開啟dialog
    $dialogDiv.show();
  }else{
    // 關閉dialog
    $dialogDiv.hide();
  }
}

/** 下一號 */
$next.click(function(){
  let nextColor = color;
  let nextOrder = order + 1;
  if(order >= 30){
    nextColor = getAnotherColor(color);
    nextOrder = 1;
  }
  $('#s_' + nextColor + nextOrder)[0].play(); // 叫號
  updateOrder(nextColor, nextOrder); // 更新號碼牌
});

/**
 * 新號碼牌
 * @param {string} updateColor - 欲更新之號碼牌顏色
 * @param {number} updateOrder - 欲更新之號碼牌號碼
 */
function updateOrder(updateColor, updateOrder){
  db.ref('/').update({
    now: {
      color: updateColor,
      order: updateOrder
    }
  });
}
