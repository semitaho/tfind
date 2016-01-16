export default function mapreducer(state={}, action){
  switch (action.type){
    case 'RECEIVE_LOCATION':
      return Object.assign({},state, {
        center: action.location
      });
    case 'RECEIVE_CIRCLE':
     return Object.assign({},state, {
        circle: action.circle
      });
    case 'CHANGE_RADIUS':
     return Object.assign({},state, {
        radius: action.radius
      });  
  }
  return state;
}