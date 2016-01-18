const initialstate = {show:false};
export default function havainnotkartalla(state=initialstate, action){
  if (action.type === 'TOGGLE_HAVAINNOT_CLICK'){
    if (!action.isopen){
      return {show:false};
    }
    let newItem = Object.assign({},state, {item: action.item});
    newItem.show = true;
    return newItem;

  }
  return state;

}