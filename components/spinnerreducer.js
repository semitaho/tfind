export default function spinnerstate(state=false, action){
  if (action.type === 'TOGGLE_SPINNER'){
    return action.loading;
  }

  return state;

}