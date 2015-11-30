class TextFormatter {

  static formatToHTML(text){
    return text.replace(/(?:\r\n|\r|\n)/g, '<br />');
  }

  static formatLinks(text){
    var exp = /(\b(https?|ftp|file):\/\/([-A-Z0-9+&@#%?=~_|!:,.;]*)([-A-Z0-9+&@#%?\/=~_|!:,.;]*)[-A-Z0-9+&@#\/%=~_|])/ig;
    return text.replace(exp, "<a href='$1' target='_blank'>$1</a>");
  }

  static formatTime(timestamp){
    let dt = new Date(timestamp * 1);
    let time = dt.getDate() + '.' + (dt.getMonth() + 1) + '.' + dt.getFullYear() + ' ' + dt.getHours() + ':' + dt.getMinutes();
    return time;
  }



}

export default TextFormatter;