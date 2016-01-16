export function toggleSpinner(spinning){
  return {
    type: 'TOGGLE_SPINNER',
    loading: spinning,
  };
}