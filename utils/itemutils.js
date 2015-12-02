class ItemUtils {
  static findKatoamispaikkaLoc(item){
    return item.findings.find(point => point.type === '1');
  }

}

export default ItemUtils;