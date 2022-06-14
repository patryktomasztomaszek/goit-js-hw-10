export function fetchCounrtries( filter, input ) {
  return fetch(`https://restcountries.com/v3.1/${filter}/${input}?fields=name,capital,population,flags,languages`)
    .then(response => {
      if (response.ok) {
        return response.json();
      } else {
        throw new Error(response.status);
      }
    })
    .catch(error => {
      console.log(`Encountered an ${error.message} error!`);
    });
}
