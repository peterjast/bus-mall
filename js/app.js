'use strict';

const productImageSectionTag = document.getElementById('all_products');
const leftProductImageTag = document.getElementById('left_product_img');
const middleProductImageTag = document.getElementById('middle_product_img');
const rightProductImageTag = document.getElementById('right_product_img');

let totalClicks = 0;

let leftProductOnThePage = null;
let middleProductOnThePage = null;
let rightProductOnThePage = null;

const ProductPicture = function (name, imageSrc) {
  this.name = name;
  this.clicks = 0;
  this.timesShown = 0;
  this.url = imageSrc;
  this.showing = false;

  ProductPicture.allImages.push(this);
};

ProductPicture.allImages = [];

const renderNewProducts = function (leftIndex, middleIndex, rightIndex){
  leftProductImageTag.src = ProductPicture.allImages[leftIndex].url;
  leftProductImageTag.alt = ProductPicture.allImages[leftIndex].name;
  middleProductImageTag.src = ProductPicture.allImages[middleIndex].url;
  middleProductImageTag.alt = ProductPicture.allImages[middleIndex].name;
  rightProductImageTag.src = ProductPicture.allImages[rightIndex].url;
  rightProductImageTag.alt = ProductPicture.allImages[rightIndex].name;
};

const pickNewProducts = function(){
  const leftIndex = Math.floor(Math.random() * ProductPicture.allImages.length);
  let rightIndex;
  let middleIndex;
  do {
    rightIndex = Math.floor(Math.random() * ProductPicture.allImages.length);
    middleIndex = Math.floor(Math.random() * ProductPicture.allImages.length);

  } while (rightIndex === leftIndex || middleIndex === leftIndex || rightIndex === middleIndex);
  console.log(ProductPicture.allImages[leftIndex].name, ProductPicture.allImages[rightIndex].name);

  leftProductOnThePage = ProductPicture.allImages[leftIndex];
  leftProductOnThePage.showing = true;
  middleProductOnThePage = ProductPicture.allImages[middleIndex];
  leftProductOnThePage.showing = true;
  rightProductOnThePage = ProductPicture.allImages[rightIndex];
  leftProductOnThePage.showing = true;

  renderNewProducts(leftIndex, middleIndex, rightIndex);
};

const handleClickOnProduct = function(event){

  if(totalClicks < 25){

    const thingWeClickedOn = event.target;
    const id = thingWeClickedOn.id;

    if(id === 'left_product_img' || id === 'middle_product_img' || id === 'right_product_img'){

      if(id === 'left_product_img'){
        leftProductOnThePage.clicks++;
      }
      if(id === 'middle_product_img'){
        rightProductOnThePage.clicks++;
      }
      if(id === 'right_goat_img'){
        rightProductOnThePage.clicks++;
      }

      leftProductOnThePage.timesShown++;
      middleProductOnThePage.timesShown++;
      rightProductOnThePage.timesShown++;

      pickNewProducts();
    }
    console.log(event.target.id);
  }

  totalClicks++;

  if(totalClicks === 25){
    productImageSectionTag.removeEventListener('click', handleClickOnProduct);
    displayResultsButton();
    const resultButtonElem = document.getElementById('result-button');
    resultButtonElem.addEventListener('click', renderResults);
  }
};

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
  for(let i = 0; i < ProductPicture.allImages.length; i++){
    const resultListItem = document.createElement('li');
    resultListItem.textContent = ProductPicture.allImages[i].name + ' had ' + ProductPicture.allImages[i].clicks + ' votes, and was seen ' + ProductPicture.allImages[i].timesShown + ' times ';
    resultListElem.appendChild(resultListItem);
  }
}

productImageSectionTag.addEventListener('click', handleClickOnProduct);

new ProductPicture('bag', 'img/bag.jpg');
new ProductPicture('banana', 'img/banana.jpg');
new ProductPicture('bathroom', 'img/bathroom.jpg');
new ProductPicture('boots', 'img/boots.jpg');
new ProductPicture('breakfast', 'img/breakfast.jpg');
new ProductPicture('bubblegum', 'img/bubblegum.jpg');
new ProductPicture('chair', 'img/chair.jpg');
new ProductPicture('cthulhu', 'img/cthulhu.jpg');
new ProductPicture('dog-duck', 'img/dog-duck.jpg');
new ProductPicture('dragon', 'img/dragon.jpg');
new ProductPicture('pen', 'img/pen.jpg');
new ProductPicture('pet sweep', 'img/pet-sweep.jpg');
new ProductPicture('scissors', 'img/scissors.jpg');
new ProductPicture('shark', 'img/shark.jpg');
new ProductPicture('sweep', 'img/sweep.png');
new ProductPicture('tauntaun', 'img/tauntaun.jpg');
new ProductPicture('unicorn', 'img/unicorn.jpg');
new ProductPicture('usb', 'img/usb.gif');
new ProductPicture('water can', 'img/water-can.jpg');
new ProductPicture('wine glass', 'img/wine-glass.jpg');

pickNewProducts();
