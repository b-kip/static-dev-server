console.log("loaded!!");

let form = document.querySelector("form");

console.dir(document.forms[0].elements.email);

form.addEventListener('submit', (event) => {
  console.log('Saving value', form.elements.value);
  console.dir(form.elements);
  console.log(Object.keys(form.elements));
  // console.log(typeof form.elements);
  console.log(Object.keys(form.elements));
  event.preventDefault();
});