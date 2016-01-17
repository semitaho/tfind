import {toggleSpinner} from './../spinneractions.js';
import $ from 'jquery';
export function changeField(field, newValue){
  return {
    type: 'CHANGE_FIELD',
    field,
    value: newValue
  }
}

export function togglePage(page){
  return {
    type: 'TOGGLE_PAGE',
    page
  }
}

export function save(dataobject){
  return dispatch => {
    toggleSpinner(true);
    return $.ajax({
        type: "POST",
        contentType: 'application/json; charset=utf-8',
        url: '/saveilmoita',
        data: JSON.stringify(dataobject),
        success: _ => {
          toggleSpinner(false);
          window.location.replace("/kadonneet");
        }
    });

  }

  
}

