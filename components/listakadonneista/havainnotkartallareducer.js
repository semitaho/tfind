const initialstate = {show:false};
export default function havainnotkartalla(state=initialstate, action){
  if (action.type === 'ON_HAVAINNOT_CLICK'){
    let newItem = Object.assign({},state, {item: action.item});
    newItem.show = true;
    return newItem;

  }
  return state;

}