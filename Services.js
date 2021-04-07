import _ from 'lodash';
import usStates from './us-states';


const api_users_endpoint ='https://api.github.com/search/users?'

export async function getUser(query,  numOfResults){
    
     // fetch the data using the api  below
     // input : query + number of results
    let response =  await (
        await fetch(api_users_endpoint + new URLSearchParams({q: query.toLowerCase(), per_page: numOfResults}))
        ).json()
   
    // the result  must be in format { text, value} 
    // Autocomplete accept only data in format { text, value} 
    let data = _.map(response['items'], item => ({
        text: item.login,
        value: item.id
    }));

    return data
      
}

export async function getState(query, numOfResults){
    // read data from json 
    let data = usStates.map(state => ({
        text: state.name,
        value: state.abbreviation
     }));

     // get values that match query 
    let results = data.filter((item) => {
        return item.text.toLowerCase().includes(query.toLowerCase());
     });

    // Get only the number of results that we want
    results = results.slice(0,  numOfResults);
 
    // We need to convert the results to a promise 
    let promise = await (new Promise((resolve, reject)=>{
        resolve(results); 
    
    }));
    return promise
}
