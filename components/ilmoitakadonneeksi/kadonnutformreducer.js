export default function formreducer(state= {}, action){
  let formstate;
  switch (action.type){
    case 'CHANGE_FIELD':
      formstate= Object.assign({},state.formstate);
      formstate[action.field] = action.value;
      return Object.assign({},state, {formstate});
    case 'TOGGLE_PAGE':
      return Object.assign({},state, {active: action.page});

    case 'RECEIVE_ADDRESS':
      formstate= Object.assign({},state.formstate);
      formstate.address = action.address;
      return Object.assign({},state,{formstate});
    case 'CHANGE_RADIUS':
      formstate= Object.assign({},state.formstate);
      formstate.radius = action.radius;
      return Object.assign({},state,{formstate});
    case 'RECEIVE_LOCATION':
      formstate= Object.assign({},state.formstate);
      formstate.location = action.location;
      return Object.assign({},state,{formstate});  
  }

  return state;
}