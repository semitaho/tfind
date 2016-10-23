class UIUtils {

  static calculateModalMapHeight(id) {
    let h = $(window).height();
    let hasModal = $('.modal-body').length > 0;
    if (!hasModal){
      return;
    }
    let offsetY = $('.modal-body').position().top;
    let footerHeight = $('#footer').height();
    console.log('footer', footerHeight);
    let headerHeight = $('.modal-header').height();
    $('#' + id).height(h-offsetY-footerHeight-50);
  }

  static calcHeight(id){
    let h = $(window).height();
    let mapElement = $('#' + id);
    let mapY = mapElement.offset().top;
    let footerHeight = $('#footer').height();
    $('#' + id).height(h - mapY - footerHeight - 10);

  }

}

export default UIUtils;
