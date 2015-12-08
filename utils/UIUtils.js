class UIUtils {

  static calculateModalMapHeight(id) {
    let h = $(window).height();
    let offsetY = $('.modal-body').position().top;
    let footerHeight = $('#footer').height();
    console.log('footer', footerHeight);
    let headerHeight = $('.modal-header').height();
    $('#' + id).height(h-offsetY-footerHeight-50);
  }

}

export default UIUtils;
