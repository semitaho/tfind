import { combineReducers } from 'redux';


const itemsInitialState  = [];
function etsiitemsreducer(state=itemsInitialState, action){
  return state;
}

const modalInitialState = {show:false}

function etsimodalreducer(state=modalInitialState, action){
  switch (action.type){
    
    case 'LOAD_SPINNER': 
     let newObject = Object.assign({},state.confirmdialog,{
        saving: true
      });
     return Object.assign({},state,{
        confirmdialog: newObject
      });

    case 'TOGGLE_ETSI_MODAL':
      if (!action.isopen){
       return {show:false};
      }
      return  {item: action.item, show: true, opened: true};
    case 'CHANGE_AJANKOHTA':
      let newConfirmObject = Object.assign({},state.confirmdialog,{
        ajankohta: action.timestamp
      });
      return Object.assign({},state,{
        confirmdialog: newConfirmObject
      });
    case 'OPEN_SAVE_MARKING':
      console.log('joo save marking');
      return Object.assign({}, state, {
        confirmdialog: action.confirmObject
      });
    case 'MARK_TO_MAP':
      let item= Object.assign({},state.item);
      return {
        marking: true,
        item,
        opened: false,
        show:true
      };
  
    default: 
      return state;
  }
  return state;
}

export default combineReducers({
  items: etsiitemsreducer,
  modal: etsimodalreducer

});
