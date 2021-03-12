'use strict';

//globals
const productNames = ['bag', 'banana', 'bathroom', 'boots', 'breakfast', 'bubblegum', 'chair', 'cthulhu', 'dog-duck', 'dragon', 'pen', 'pet-sweep', 'scissors', 'shark', 'sweep', 'tauntaun', 'unicorn', 'usb', 'water-can', 'wine-glass'];

const productImageSectionTag = document.getElementById('all-products');
const leftProductImageTag = document.getElementById('left-product-img');
const middleProductImageTag = document.getElementById('middle-product-img');
const rightProductImageTag = document.getElementById('right-product-img');

const maxRounds = 25;
let totalClicks = 0;

//keep track of left, middle and right product
let leftProduct = null;
let middleProduct = null;
let rightProduct = null;

//constructor function for product
const Product = function (name, imageSrc) {
  this.name = name;
  this.clicks = 0;
  this.timesShown = 0;
  this.url = imageSrc;

  Product.allProducts.push(this);
};
//intialize product.allProducts array
Product.allProducts = [];

//create products
function createProducts() {
  for (let i = 0; i < productNames.length; i++) {
    const productName = productNames[i];
    new Product(productName, 'img/' + productName + '.jpg');
  }
}

//pick new products
function pickNewProducts() {

  //shuffle array
  shuffle(Product.allProducts);

  //initialize empty array for safe products
  const safeProducts = [];

  //loop through Product.allProducts array
  for (let i = 0; i < Product.allProducts.length; i++) {

    const product = Product.allProducts[i];

    //check to see if product at current index is already on screen
    if (product !== leftProduct && product !== middleProduct && product !== rightProduct) {

      //if not on screen, push to safeProducts array
      safeProducts.push(product);

      // Once safe products array has 3 values, break out of loop
      if (safeProducts.length === 3) {
        break;
      }
    }
  }

  //set products on page to safeproducts
  leftProduct = safeProducts[0];
  middleProduct = safeProducts[1];
  rightProduct = safeProducts[2];

}

//show new products on screen
function renderNewProducts() {

  //setting src and alt attributes for products
  leftProductImageTag.src = leftProduct.url;
  leftProductImageTag.alt = leftProduct.name;

  middleProductImageTag.src = middleProduct.url;
  middleProductImageTag.alt = middleProduct.name;

  rightProductImageTag.src = rightProduct.url;
  rightProductImageTag.alt = rightProduct.name;

  //increment timesShown counter
  leftProduct.timesShown++;
  middleProduct.timesShown++;
  rightProduct.timesShown++;

}

//event handler for when product is clicked on
const handleClickOnProduct = function (event) {

  //declaring variable productId and assign id of event target
  const productId = event.target.id;

  //check which image was clicked on, increment click counter, pick new products, render new products, increment totalClicks counter
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
    console.log('Click on an image!');
  }

  //check if user clicked 25 times
  if (totalClicks === maxRounds) {
    //if no data in local storage, set data from Product.allProducts
    if (localStorage.products === undefined) {
      localStorage.setItem('products', JSON.stringify(Product.allProducts));
    }
    //if data in local storage, add current clicks and timeShown to counters from localStorage
    if (localStorage.products !== undefined) {
      const storedProducts = JSON.parse(localStorage.getItem('products'));
      for (let i = 0; i < Product.allProducts.length; i++) {
        for (let j = 0; j < storedProducts.length; j++) {
          if (Product.allProducts[i].name === storedProducts[j].name) {
            storedProducts[j].clicks += Product.allProducts[i].clicks;
            storedProducts[j].timesShown += Product.allProducts[i].timesShown;
          }
        }
      }
      localStorage.setItem('products', JSON.stringify(storedProducts));
    }
    //remove click event, display results button, add event listener for click on button, render chart
    productImageSectionTag.removeEventListener('click', handleClickOnProduct);
    displayResultsButton();
    const resultButtonElem = document.getElementById('result-button');
    resultButtonElem.addEventListener('click', renderResults);
    renderChart();
  }

};

//display results button
function displayResultsButton() {
  const resultsElem = document.getElementById('results');
  const buttonElem = document.createElement('button');
  buttonElem.setAttribute('id', 'result-button');
  resultsElem.appendChild(buttonElem);
  buttonElem.textContent = 'Current Results';
  const voteElem = document.getElementById('vote');
  voteElem.remove();
}

//render results
function renderResults() {
  const resultButtonElem = document.getElementById('result-button');
  resultButtonElem.remove();
  const resultsElem = document.getElementById('results');
  const resultsHeaderElem = document.createElement('h2');
  resultsHeaderElem.textContent = 'Current Results';
  resultsElem.appendChild(resultsHeaderElem);
  const resultListElem = document.createElement('ul');
  resultsElem.appendChild(resultListElem);
  for (let i = 0; i < Product.allProducts.length; i++) {
    const resultListItem = document.createElement('li');
    resultListItem.textContent = ' ' + Product.allProducts[i].name + ':  Votes - ' + Product.allProducts[i].clicks + ' Seen - ' + Product.allProducts[i].timesShown;
    resultListElem.appendChild(resultListItem);
  }
}

/* fisher yates style shuffle
https://medium.com/@nitinpatel_20236/how-to-shuffle-correctly-shuffle-an-array-in-javascript-15ea3f84bfb
*/
function shuffle(array) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * i);
    const temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
}

//add event listener to image section
productImageSectionTag.addEventListener('click', handleClickOnProduct);

//invoking functions

createProducts();

pickNewProducts();

renderNewProducts();

//render chart
function renderChart() {

  const chartElem = document.getElementById('chart-header');
  const chartHeaderElem = document.createElement('h2');
  chartHeaderElem.textContent = 'Cumulative Results';
  chartElem.appendChild(chartHeaderElem);


  // get data from localStorage
  const storedProducts = JSON.parse(localStorage.getItem('products'));

  const votes = [];

  const displayCount = [];

  for (let i = 0; i < storedProducts.length; i++) {
    const voteCount = storedProducts[i].clicks;
    const timesDisplayed = storedProducts[i].timesShown;
    votes.push(voteCount);
    displayCount.push(timesDisplayed);
  }

  const canvas = document.getElementById('canvas');
  canvas.width = '600';
  canvas.height = '400';


  const ctx = document.getElementById('canvas').getContext('2d');
  new Chart(ctx, {
    // The type of chart we want to create
    type: 'bar',

    // The data for our dataset
    data: {
      labels: productNames,
      datasets: [{
        label: 'Votes',
        backgroundColor: '#F64C72',
        borderColor: '#e7dbdb',
        borderWidth: 1,
        data: votes
      },
      {
        label: 'Times Shown',
        backgroundColor: '#553D67',
        borderColor: '#e7dbdb',
        borderWidth: 1,
        data: displayCount
      }]
    },

    // Configuration options go here
    options: {
      legend: {
        labels: {
          fontColor: '#e7dbdb'
        }
      },
      title: {
        display: false,
        fontColor: '#e7dbdb',
        text: 'Cumulative Results'
      },
      scales: {
        yAxes: [{
          ticks: {
            beginAtZero: true,
            fontColor: '#e7dbdb'
          },
        }],
        xAxes: [{
          ticks: {
            fontColor: '#e7dbdb'
          },
        }]
      },
    }
  });
}

