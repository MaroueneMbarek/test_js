import Autocomplete from './Autocomplete';
import './main.css';
import {getState, getUser} from './Services'


new Autocomplete(document.getElementById('state'), {
  function: getState,     // service method used to collect the data 
  listSize : 10,          // the number of data that we want to display in the dropdown
  onSelect: (stateCode) => {
    console.log('selected state:', stateCode);
  },
});


// Github Users
new Autocomplete(document.getElementById('gh-user'), {
   function: getUser, // service method used to collect the data
   listSize : 10,     // the number of data that we want to display in the dropdown
   onSelect: (ghUserId) => {
     console.log('selected github user id:', ghUserId);
   },
 });
