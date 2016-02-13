
// カンマ区切りで渡された引数を，空白で連結して表示する
function loggerLikeMessage() {
  return Array.prototype.slice.call(arguments).join(' ');
}

// min から max までの乱整数を返す関数
function getRandomInt(min, max) {
  return Math.floor( Math.random() * (max - min + 1) ) + min;
}