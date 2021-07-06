

const items = document.getElementById('items');
let keys;
if (document.getElementById('formElement') != null){
const formElement = document.getElementById('formElement');

formElement.addEventListener('submit', ($event) => {
  $event.preventDefault();
  products = products_array();
  var i = 0 ;
  if(products == ""){
    const responseDanger = document.getElementById('danger');
    responseDanger.innerHTML = "You can't submit an order without products";
    responseDanger.className = "alert-danger";
    return;
    }
  else{
    makeOrder();
  }
 
});

}
let products = [];

let body = ["body"];
// API URL
const api = '/api/teddies';


// Function to make the order only when the products array has ids
async function makeOrder(){
  
const message = document.getElementById('message');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

   const contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  };
  products = products_array();
  
  const object = {contact, products};
  const responseSuccess = document.getElementById('success');
  const responseDanger = document.getElementById('danger');
  const responseContact = document.getElementById('contact');
  const responseProducts = document.getElementById('products');
  const totalPrice = document.getElementById('totalPrice').value;
      const postPromise = makeRequest('POST', api+"/order",object,{ 
      });
      try{
      const postResponse = await postPromise;
      localStorage.clear();
      parent.open("/order_confirmation/"+postResponse.contact.firstName+"/"+postResponse.contact.lastName+"/"+postResponse.orderId+"/"+totalPrice, '_self');
     }catch(errorResponse){
      responseDanger.innerHTML = "There was an issue your order wasnt submitted";
      responseDanger.className = "alert-danger";
      }
}

//Function to show message in order confirmation view
function showMessage(firstName,lastName,totalPrice,orderId){

  const responseSuccess = document.getElementById('success');
  responseSuccess.innerHTML = "Hi "+firstName+" "+lastName+" we appreciatte your bussiness the order has been submitted your total amount was "
      +totalPrice+" and your order number "+orderId;
      responseSuccess.className = "alert-success";

}

//function to fill products array with all id of the orders
function products_array(){
  products = [];
  keys = Object.keys(localStorage);
  var length = keys[0];
  if (length != null){
    length = parseInt(keys[0]);
  }else{
    length = 1 ;
  }
  for (let i = 1 ; i <= length ; i++){
  let array = localStorage.getItem(i);
  let json = JSON.parse(array);
    if(json != null){
      products.push(json._id);
    }

  }

  return products;
}

//Function to make requests to the server
function makeRequest(verb, url, data) {


 return new Promise((resolve, reject) => {
   if(verb ==="POST" && !data){
     reject({error: 'No data'});
   }
   if(verb !== 'POST' && verb !== 'GET'){
    reject({error: 'Invalid request verb'});
   }

   let request = new XMLHttpRequest();
   request.open(verb, url);
   request.onreadystatechange = () => {
     if (request.readyState === 4) {
       if (request.status === 0 || request.status === 200 || request.status === 201) {
         resolve(JSON.parse(request.response));
       } else {
         reject(JSON.parse(request.response));
       }
     }
   };
   if (verb === 'POST') {
     
     request.setRequestHeader('Content-Type', 'application/json');
   request.send(JSON.stringify(data));
   } else {
     request.send();
   }
 });
}

//Function to display all product of the database
async function displayAllProducts() {
  const uidPromise = makeRequest('GET', api);
try {
  const [uidResponse] = await Promise.all([uidPromise]);

  const postPromise = makeRequest('GET', api, {
    uid: uidResponse.uid,
    });

    try {
    const postResponse = await postPromise;
    postResponse.forEach(element => {
      const div1 = document.createElement('div');
      div1.className = "col-12 col-lg-4";
      items.appendChild(div1);
      const div2 = document.createElement('div');
      div2.className = "card shadow";
      //div2.style.width = "18rem";
      div1.appendChild(div2);
      const img = document.createElement('img');
      img.className = "card-img-top img-responsive";
      //img.style.width = "18rem";
      //img.style.height = "16rem";
      img.src = element.imageUrl;
      img.alt = "";
      div2.appendChild(img);
      const div3 = document.createElement('div');
      div3.className = "card-body";
      div2.appendChild(div3);
      const h5 = document.createElement('h5');
      h5.className = "card-title";
      h5.innerHTML = element.name;
      div3.appendChild(h5);
      
      const p = document.createElement('p');
      p.className = "card-text";
      p.innerHTML = element.description;
      div3.appendChild(p);
      /*const div4 = document.createElement('div');
        div4.className = "card-body flex_colors";
        div3.appendChild(div4);*/
        const select = document.createElement('select');
        select.id = 'color'+element.colors+element._id;
        select.className = "card-text";
        select.value = "Select Color";
        select.innerHTML = "Select Color";
        select.style.width = "100%";
        var opt = document.createElement('option');
        opt.value = "Select Color";
        opt.innerHTML = "Select Color";
        select.appendChild(opt);
        
        
      element.colors.forEach(colors => {
        var opt = document.createElement('option');
                opt.className = "color_"+colors+" border";
                opt.value = colors;
                opt.innerHTML = colors;
                select.appendChild(opt);
      });
      div3.appendChild(select);


      const p2 = document.createElement('p');
      p2.className = "card-text";
      p2.innerHTML = "Price "+ Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format(element.price);;
      div3.appendChild(p2);
      /*const a = document.createElement('a');
      a.className = "btn btn-primary stretched-link";
      div3.appendChild(a);*/
  
      const button1 = document.createElement('a');
      button1.className = "btn btn-danger";
      button1.type = "button";
      button1.style.marginRight = "5%";
      button1.innerHTML = "Remove from cart";
      button1.id = element._id;
      //button1.formMethod = "POST";
      button1.onclick = function() {
        removeFromCart(element,1);
        parent.open("/", '_self');
      };
      div3.appendChild(button1);
  
      const button2 = document.createElement('a');
      button2.className = "btn btn-primary card-text";
      button2.type = "button";
      button2.innerHTML = "Add to cart";
      button2.id = element._id;
      //button2.formMethod = "POST";
      button2.onclick = function() {
        updateCart(element,1);
        parent.open("/", '_self');
      };
      div3.appendChild(button2);
      const button3 = document.createElement('a');
      button3.className = "btn btn-primary card-text";
      button3.type = "button";
      button3.style.marginBottom = "5%";
      button3.innerHTML = "View Product";
      button3.id = element._id;
      button3.formMethod = "POST";
      button3.onclick = function() {
        parent.open("single_product/"+element._id, '_self');
        displaySingleProduct(element._id)
      };
      div2.appendChild(button3);
      });
    }catch(error){
      message.textContent = error.error;

    }

  } catch(error){
    message.textContent = error.error;


  }
}

// Function to display a single product by id
async function displaySingleProduct(id) {

  const uidPromise = makeRequest('GET', api+"/"+id);
try {
  const [uidResponse] = await Promise.all([uidPromise]);

  const postPromise = makeRequest('GET', api+"/"+id, {
    uid: uidResponse.uid,
  });
try {
  const postResponse = await postPromise;

    items.style.justifyContent = "center";
    const div1 = document.createElement('div');
    div1.className = "col-12 col-lg-4";
    items.appendChild(div1);
    const div2 = document.createElement('div');
    div2.className = "card shadow";
    div1.appendChild(div2);
    const img = document.createElement('img');
    img.className = "card-img-top img-responsive";
    //img.style.height = "16rem";
    img.src = postResponse.imageUrl;
    img.alt = "";
    div2.appendChild(img);
    const div3 = document.createElement('div');
    div3.className = "card-body";
    div2.appendChild(div3);
    const h5 = document.createElement('h5');
    h5.className = "card-title";
    h5.innerHTML = postResponse.name;
    div3.appendChild(h5);
    const p = document.createElement('p');
    p.className = "card-text";
    p.innerHTML = postResponse.description;
    div3.appendChild(p);
    const p2 = document.createElement('p');
    p2.className = "card-text";
    p2.innerHTML = "Price "+ Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format(postResponse.price);;
    div3.appendChild(p2);

    const select = document.createElement('select');
    select.id = 'color'+postResponse.colors+postResponse._id;;
    select.style.marginBottom = "0.5rem";
    select.className = "card-text";
    select.value = "Select Color";
    select.innerHTML = "Select Color";
    select.style.width = "100%";
    var opt = document.createElement('option');
    opt.value = "Select Color";
    opt.innerHTML = "Select Color";
    select.appendChild(opt);
    
    
    postResponse.colors.forEach(colors => {
    var opt = document.createElement('option');
            opt.className = "color_"+colors+" border";
            opt.value = colors;
            opt.innerHTML = colors;
            select.appendChild(opt);
    });
    div3.appendChild(select);

    const button1 = document.createElement('a');
    button1.className = "btn btn-danger card-text";
    button1.type = "button";
    button1.innerHTML = "Remove from cart";
    button1.style.width = "100%";
    button1.id = postResponse._id;
    button1.formMethod = "POST";
    button1.onclick = function() {
      removeFromCart(postResponse,1)
      parent.open("/single_product/"+postResponse._id, '_self');
    };
   

    const button2 = document.createElement('a');
    button2.className = "btn btn-primary";
    button2.type = "button";
    button2.style.width = "100%";
    button2.innerHTML = "Add to cart";
    button2.style.marginBottom = "0.5rem";
    button2.id = postResponse._id;
    button2.formMethod = "POST";
    button2.onclick = function() {
      updateCart(postResponse,1);
      parent.open("/single_product/"+postResponse._id, '_self');
    };
    div3.appendChild(button2);
    div3.appendChild(button1);
  }catch(error){
    message.textContent = error.error;

  }

  } catch(error){
  message.textContent = error.error;

  }
}

//Function to remove a specific qty of an item from the storage
function removeFromCart(postResponse,qty) {
  
  let answer = document.getElementById("color"+postResponse.colors+postResponse._id).value;

 
  if (answer !== 'Select Color'){
  var total = qty;
  var item = findMyItem(postResponse,answer);
    if(item != 0){
    var lenght = localStorage.length;
    var array = localStorage.getItem(item);
    var json = JSON.parse(array);

    if (total > json.count ){
      alert("You can't delete more than you have in your cart");
      
    }else{
    total = json.count - total;
    json.count = total;
      if (total <= 0 ){
        localStorage.removeItem(item);
      }else{
      localStorage.setItem(item,JSON.stringify(json));
      }
    var array = localStorage.getItem(item);
    var json = JSON.parse(array);
    }

    }else{
      alert('You dont have this item in your cart');

    }
  }else{
    alert('You need to select a color');
  }

  

}

//Function to find an item in the local storage
//Check if specific item and color are in the storage
//Return 0 if the item doesnt exist
function findMyItem(postResponse, answer){

  keys = Object.keys(localStorage);
  length = parseInt(keys[0]);
  if (length != null){
    length = parseInt(keys[0]);
  }else{

    length = 1 ;
  }

  for (var i = 1 ; i <= length ; i++){

    var array = localStorage.getItem(i);
    var json = JSON.parse(array);
    if(json != null){
      if (json._id === postResponse._id){
        if (json.colors === answer){
          return i;
        }
      }   
    }
  }
  return 0;


}

// return 0 if there is not null keys
function findMyKey(postResponse, answer){

  keys = Object.keys(localStorage);
  length = parseInt(keys[0]);
  if (length != null){
    length = parseInt(keys[0]);
  }else{
    length = 1 ;
  }

  for (var i = 1 ; i <= length ; i++){

    var array = localStorage.getItem(i);
    var json = JSON.parse(array);
    if(json == null){
          return i;
    }
  }
  return 0;


}

// Function to display cart every single item with their color will be display 
function displayCart() {
  const message = document.getElementById('message');
const firstName = document.getElementById('firstName');
const lastName = document.getElementById('lastName');
const address = document.getElementById('address');
const city = document.getElementById('city');
const email = document.getElementById('email');

   const contact = {
    firstName: firstName.value,
    lastName: lastName.value,
    address: address.value,
    city: city.value,
    email: email.value
  };
  products = products_array();
  const object = {contact, products};

  keys = Object.keys(localStorage);

  var length = 1;
  for (i = 0 ; i <= keys[0] ; i++ ){
    if(parseInt(length) < parseInt(keys[i])){
      length = parseInt(keys[i]);
    }
  }

  for (let i = 1 ; i <= length ; i++){
    let array = localStorage.getItem(i);
    let json = JSON.parse(array);
    if(json != null){
      const div1 = document.createElement('div');
      div1.className = "card mb-3";
      items.appendChild(div1);

      const div2 = document.createElement('div');
      div2.className = "row g-0";
      //div2.style.width = "18rem";
      div1.appendChild(div2);

      const div3 = document.createElement('div');
      div3.className = "col-md-4";
      //div2.style.width = "18rem";
      div2.appendChild(div3);

      const div4 = document.createElement('div');
      div4.className = "col-md-8";
      //div2.style.width = "18rem";
      div2.appendChild(div4);

      const div5 = document.createElement('div');
      div5.className = "card-body";
      //div2.style.width = "18rem";
      div4.appendChild(div5);

      const img = document.createElement('img');
      img.className = "card-img-top img-responsive";
      //img.style.width = "18rem";
      //img.style.height = "16rem";
      img.src = json.imageUrl;
      img.alt = "";
      div3.appendChild(img);

      const h5 = document.createElement('h5');
      h5.className = "card-title";
      h5.innerHTML = json.name;
      div5.appendChild(h5);

      const p = document.createElement('p');
      p.className = "card-text";
      p.innerHTML = json.description;
      div5.appendChild(p);

      const p2 = document.createElement('p');
      p2.className = "";
      p2.innerHTML = "Price "+ Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format(json.price);;
      div5.appendChild(p2);

      const select = document.createElement('select');
      select.id = "color"+json.colors+json._id;
      select.className = "card-text";
      select.value = json.colors;
      select.innerHTML = "Select Color";
      select.style.width = "100%";

      var opt = document.createElement('option');
                opt.className = "color_"+json.colors+" border";
                opt.value = json.colors;
                opt.innerHTML = json.colors;
                opt.selected = "Selected";
                select.appendChild(opt);
      
      div5.appendChild(select);

      const select_qty = document.createElement('select');
      select_qty.id = "qty"+json.colors+json._id;
      select_qty.className = "card-text";
      select_qty.innerHTML = "Qty: "+json.count;
      select_qty.style.width = "100%";

      for (let j = 1 ; j <= 10 ; j++){
        var opt2 = document.createElement('option');
        opt2.value = j;
        opt2.innerHTML = j;
        if( j == json.count ){
          opt2.selected = "Selected";
        }

        select_qty.appendChild(opt2);

      }
      
      div5.appendChild(select_qty);
      const p3 = document.createElement('p');
      p3.id = i;
      p3.value = json.price*(json.count);
      p3.className = "card-text";
      p3.innerHTML = "Total Price "+ Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format((json.price*(json.count)));
      div5.appendChild(p3);
      
      const button2 = document.createElement('a');
      button2.className = "btn btn-primary";
      button2.type = "button";
      button2.style.marginRight = "5%";
      button2.innerHTML = "Update cart";
      button2.value = json.colors+json._id;
      button2.id = "update"+json.colors+json._id;
      button2.formMethod = "POST";
      button2.onclick = function() {
        var value = document.getElementById("qty"+this.value).value;
        updateCart(json,value);
        parent.open("/show_cart",'_self');
      };
      div5.appendChild(button2);

      const button3 = document.createElement('a');
      button3.className = "btn btn-danger";
      button3.type = "button";
      button3.style.marginRight = "5%";
      button3.innerHTML = "Remove from cart";
      button3.value = json.colors+json._id;
      button3.id = "remove"+json.colors+json._id;
      button3.formMethod = "POST";
      button3.onclick = function() {
        var value = document.getElementById("qty"+this.value).value;
        removeFromCart(json,value);
        parent.open("/show_cart",'_self');
      };
      div5.appendChild(button3);
    }
  }
  updateTotalPrice();
}

//Function to update total price of the order
function updateTotalPrice(){
  keys = Object.keys(localStorage);
  var length = keys[0];
  if (length != null){
    length = parseInt(keys[0]);
  }else{
    length = 1 ;
  }
  
let total = 0;
for (let i = 1 ; i <= length ; i++){
  let array = localStorage.getItem(i);
  let json = JSON.parse(array);
  if(json != null){
    total = total + parseInt((document.getElementById(i).value));
  }
}
var totalPrice = document.getElementById("totalPrice");
totalPrice.value = Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format((total));
totalPrice.innerHTML += " "+Intl.NumberFormat('en-US', {currency:"USD" , style: 'currency'}).format((total));

}

//Function to update qty of cart receiving item and qty to update
function updateCart(postResponse,qty) {
 
  let answer = document.getElementById("color"+postResponse.colors+postResponse._id).value;
  keys = Object.keys(localStorage);
  var local_length = keys[0];
  
  if (answer !== 'Select Color'){
  var total = parseInt(qty) ;
  var item = findMyItem(postResponse,answer);
    if(item != 0){
    var array = localStorage.getItem(item);
    var json = JSON.parse(array);
    if (total > 1){
      total = total;
    }else{
      total = total + parseInt(json.count);
    }
    
    json.count = total;
    localStorage.setItem(item,JSON.stringify(json));
    var array = localStorage.getItem(item);
    var json = JSON.parse(array);
    }else{
      var count = total;
      postResponse.colors = answer;
      postResponse['count'] = count;
      if (local_length != null){
        if (findMyKey() == 0){
          lenght = parseInt(local_length) + 1;
          }else{
            lenght = findMyKey(); 
          }

        local_length = parseInt(keys[0]);
      }else{
        lenght = 1 ;
      }
      localStorage.setItem(lenght,JSON.stringify(postResponse));
      var array = localStorage.getItem(postResponse._id);
      var json = JSON.parse(array);

    }
  }else{
    alert('You need to select a color');
  }
}
