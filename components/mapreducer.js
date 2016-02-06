export default function mapreducer(state={}, action){
  switch (action.type){

    case 'MARK_TO_MAP':
      return Object.assign({},state, {
        radius: action.radius,
        circle: action.location,
        center: action.location,
        marker: action.location,
        katoamispaikka: action.location,
        katoamisdistance: 0
      });

    case 'RECEIVE_NAMED_LOCATION':
      return Object.assign({},state, {
        location: action.location
    });
    case 'RECEIVE_MARKER':
      return Object.assign({},state, {
        marker: action.marker
      });  
    case 'RECEIVE_KATOAMISDISTANCE':
      return Object.assign({},state, {
        katoamisdistance: action.distance
      });

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