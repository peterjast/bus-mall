'use strict';

const productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

const productImageSectionTag = document.getElementById('all-products');
const leftProductImageTag = document.getElementById('left-product-img');
const middleProductImageTag = document.getElementById('middle-product-img');
const rightProductImageTag = document.getElementById('right-product-img');

const maxRounds = 25;
let totalClicks = 0;

let leftProduct = null;
let middleProduct = null;
let rightProduct = null;

const Product = function(name, imageSrc) {
  this.name = name;
  this.clicks = 0;
  this.timesShown = 0;
  this.url = imageSrc;
  
  Product.allProducts.push(this);
};

Product.allProducts = [];

function createProducts() {
     for(let i = 0; i < productNames.length; i++){
        const productName = productNames[i];
        new Product(productName, 'img/' + productName + '.jpg');
     }
}

function pickNewProducts(){
  
  shuffle(Product.allProducts);

  const safeProducts = [];

  for (let i = 0; i< Product.allProducts.length; i++){

      const product = Product.allProducts[i];
      
      if(product !== leftProduct && product !== middleProduct && product !== rightProduct) {
        
        safeProducts.push(product);

        if(safeProducts.length === 3){
          break;
        }
      }
  }

  leftProduct = safeProducts[0];
  middleProduct = safeProducts[1];
  rightProduct = safeProducts[2];  
 
}

function renderNewProducts(){

    leftProductImageTag.src = leftProduct.url;
    leftProductImageTag.alt = leftProduct.name;
  
    middleProductImageTag.src = middleProduct.url;
    middleProductImageTag.alt = middleProduct.name;
  
    rightProductImageTag.src = rightProduct.url;
    rightProductImageTag.alt = rightProduct.name;
  
    leftProduct.timesShown++;
    middleProduct.timesShown++;
    rightProduct.timesShown++;

  }

const handleClickOnProduct = function(event){

    const productId = event.target.id;

    switch (productId) {
  
      case leftProductImageTag.id:
        leftProduct.clicks += 1;
        pickNewProducts();
        renderNewProducts();
        totalClicks += 1;
        break;
  
      case middleProductImageTag.id:
        middleProduct.clicks += 1;
        pickNewProducts();
        renderNewProducts();
        totalClicks += 1;
        break;
  
      case rightProductImageTag.id:
        rightProduct.clicks += 1;
        pickNewProducts();
        renderNewProducts();
        totalClicks += 1;
        break;
  
      default:
        alert('Click on an image!');
    }

    if(totalClicks === maxRounds){
        if(localStorage.products === undefined){
            localStorage.setItem('products', JSON.stringify(Product.allProducts));
        }
        if(localStorage.products !== undefined){
            const storedProducts = JSON.parse(localStorage.getItem('products'));
            for(let i = 0; i < Product.allProducts.length; i++){
                for(let j = 0; j < storedProducts.length; j++){
                    if(Product.allProducts[i].name === storedProducts[j].name){
                        storedProducts[j].clicks += Product.allProducts[i].clicks;
                        storedProducts[j].timesShown += Product.allProducts[i].timesShown; 
                    }
                }
            } 
            localStorage.setItem('products', JSON.stringify(storedProducts));           
        }
        productImageSectionTag.removeEventListener('click', handleClickOnProduct);
        displayResultsButton();
        const resultButtonElem = document.getElementById('result-button');
        resultButtonElem.addEventListener('click', renderResults);
        renderChart();
      }
  
}

function displayResultsButton(){
  const resultsElem = document.getElementById('results');
  const buttonElem = document.createElement('button');
  buttonElem.setAttribute('id', 'result-button');
  resultsElem.appendChild(buttonElem);
  buttonElem.textContent = 'View Results';
}

function renderResults() {
  const resultButtonElem = document.getElementById('result-button');
  resultButtonElem.remove();
  const resultsElem = document.getElementById('results');
  const resultsHeaderElem = document.createElement('h2');
  resultsHeaderElem.textContent = 'Results';
  resultsElem.appendChild(resultsHeaderElem);
  const resultListElem = document.createElement('ul');
  resultsElem.appendChild(resultListElem);
  for(let i = 0; i < Product.allProducts.length; i++){
    const resultListItem = document.createElement('li');
    resultListItem.textContent = Product.allProducts[i].name + ' had ' + Product.allProducts[i].clicks + ' votes, and was seen ' + Product.allProducts[i].timesShown + ' times ';
    resultListElem.appendChild(resultListItem);
  }
}

/* fisher yates style shuffle
https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
*/
function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * i)
      const temp = array[i]
      array[i] = array[j]
      array[j] = temp
    }
  }

productImageSectionTag.addEventListener('click', handleClickOnProduct);

createProducts();

pickNewProducts();

renderNewProducts();

function renderChart() {
    
    const storedProducts = JSON.parse(localStorage.getItem('products'));

    const votes = [];
    
    const displayCount = [];

    for(let i = 0; i < storedProducts.length; i++){
        const voteCount = storedProducts[i].clicks;
        const timesDisplayed = storedProducts[i].timesShown;
        votes.push(voteCount);
        displayCount.push(timesDisplayed);
    }


    console.log(votes);
    const ctx = document.getElementById('canvas').getContext('2d');
    new Chart(ctx, {
      // The type of chart we want to create
      type: 'bar',
  
      // The data for our dataset
      data: {
        labels: productNames,
        datasets: [{
          label: 'Votes',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: votes
        },
        {
          label: 'Times Shown',
          backgroundColor: 'rgb(255, 99, 132)',
          borderColor: 'rgb(255, 99, 132)',
          data: displayCount
        }]
      },
  
      // Configuration options go here
      options: {}
    });
}

