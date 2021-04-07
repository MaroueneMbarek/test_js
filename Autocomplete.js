import _ from 'lodash';

export default class Autocomplete {
  constructor(rootEl, options = {}) {
    options = Object.assign({ numOfResults: 10, data: [] }, options);
    let currentFocus = -1 ;  // index of focus item in drop down
    Object.assign(this, { rootEl, options, currentFocus });
    this.init();
  }



 /**
   * Given an array and a query, return a filtered array based on the query.
   */
  getResults(query) {
 
    // we call our service method to collect data
    return this.options.function(query, this.options.listSize)

  }

  onQueryChange(results) {
    this.listEl.innerHTML = '';
    // update drop down
    this.listEl.appendChild(this.createResultsEl(results));
  }
  

  createResultsEl(results) {
    const fragment = document.createDocumentFragment();

     /*for each item in the array...*/
     _.forEach(results, (result) => {
        /*create a li element for each matching element:*/
        const el = document.createElement('li');
        Object.assign(el, {
          textContent: result.text,
        });
        /*insert a input field that will hold the current array item's value:*/
        el.innerHTML = "<input value='" + result.text + "'>";
        /*execute a function when someone clicks on the item value (li element):*/
        el.addEventListener("click", (e) => {
            /*insert the value for the autocomplete text field:*/
             this.inputEl.value = result.text;
            /* return result value and print it in the console*/
            const { onSelect } = this.options;
            if (typeof onSelect === 'function') onSelect(result.value);
            /*close the list of autocompleted values*/
            this.closeAllLists();
        });
        fragment.appendChild(el);
    });
  
    return fragment;
  }


  
 
  createQueryInputEl() {
    const inputEl = document.createElement('input');
    Object.assign(inputEl, {
      type: 'search',
      name: 'query',
      autocomplete: 'off',
    });

    // When we type a query in our input
    inputEl.addEventListener('input', event => {
      if (!_.isEmpty(event.target.value)) {
          // we first collect the data that match our query
          this.getResults(event.target.value).then(data => {
             this.options.data = data;
          }).then(() =>{
             // once the data is  collected we trigger the Query change function
            this.onQueryChange(this.options.data);
         })
      }
         
    });
   
    inputEl.addEventListener("keydown", (event) => {
     
      let listAutoComplete = document.getElementById(this.rootEl.id + "autocomplete-list");
      if (listAutoComplete) listAutoComplete = listAutoComplete.getElementsByTagName("li");
      if (event.keyCode == 40) {
        /*If the arrow DOWN key is pressed,
        increase the this.currentFocus variable:*/
        this.currentFocus++;
        /*and and make the current item more visible:*/
        this.addActive(listAutoComplete);
      } else if (event.keyCode == 38) { //up
        /*If the arrow UP key is pressed,
        decrease the this.currentFocus variable:*/
        this.currentFocus--;
        /*and and make the current item more visible:*/
        this.addActive(listAutoComplete);
      } else if (event.keyCode == 13) {
        /*If the ENTER key is pressed, prevent the form from being submitted,*/
        event.preventDefault();
        if (this.currentFocus > -1) {
          /*and simulate a click on the "active" item:*/
          if (listAutoComplete) listAutoComplete[this.currentFocus].click();
        }
      }
    }); 
   
   return inputEl;

  }

  
  addActive(listAutoComplete) {
    /*a function to classify an item as "active":*/
    if (!listAutoComplete) return false;
    /*start by removing the "active" class on all items:*/
    this.removeActive(listAutoComplete);
    if (this.currentFocus >= listAutoComplete.length) this.currentFocus = 0;
    if (this.currentFocus < 0) this.currentFocus = (listAutoComplete.length - 1);
    /*add class "autocomplete-active":*/
    listAutoComplete[this.currentFocus].classList.add("autocomplete-active");
  }

  removeActive(listAutoComplete) {
    /*a function to remove the "active" class from all autocomplete items:*/
    for (let i = 0; i < listAutoComplete.length; i++) {
      listAutoComplete[i].classList.remove("autocomplete-active");
    }
  }

  closeAllLists(elmnt) {
    /*close all autocomplete lists in the document,
    except the one passed as an argument:*/
    let listAutoComplete = document.getElementById(this.rootEl.id + "autocomplete-list");
    let y = listAutoComplete.getElementsByTagName('input')
    if (!_.includes(y,elmnt) && elmnt != this.inputEl) {
      this.listEl.innerHTML = ''
    }
  }

    


  init() {
    // Build query input
    this.inputEl = this.createQueryInputEl();
    this.rootEl.appendChild(this.inputEl);

    // Build results dropdown
    this.listEl = document.createElement('ul');
    this.listEl.setAttribute("id", this.rootEl.id + "autocomplete-list");
    this.listEl.setAttribute("class", "autocomplete-items");
    Object.assign(this.listEl, { className: "autocomplete-items" });
    this.rootEl.appendChild(this.listEl);
   
    

    /*execute a function when someone clicks in the document:*/
    document.addEventListener("click", e=> {
      this.closeAllLists(e.target);
    });
      
    

  }
}
