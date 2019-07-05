'use strict';

// Global Variables
let allImagesPg1 = [];
let allImagesPg2 = [];
let allKeyWordsPg1 = [];
let allKeyWordsPg2 = [];

// Constructor for image objects
// --------------------------------------------------
const ImgObj = function(image_url, title, description, keyword, horns, allImages) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImages.push(this);
};

// Read the JSON file from local directory
// --------------------------------------------------
function readJSON(filePath, fileType, allImages, allKeyWords){
  $.get(filePath, fileType).then(results => {
    results.forEach(img => {
      // Instantiate new object using ImgObj constructor
      new ImgObj(img.image_url, img.title, img.description, img.keyword, img.horns, allImages);

      // If img.keyword does not exists in allKeyWords, push it into allKeyWords.
      if(!allKeyWords.includes(img.keyword)) {
        allKeyWords.push(img.keyword);
      }
    });
    showPage(allImages, allKeyWords);
  });
}

function showPage(allImages, allKeyWords) {
  // Render all of the images

  let $divEle = $('<div></div>');
  allImages.forEach(img => {
    renderWithHandleBars(img, $divEle);
  });
  $('main').append($divEle);
  // Always hide the section template element
  $('#photo-template').hide();

  // Poplulate dropdown with keywords
  populateDropDown(allKeyWords);
}

// Use jQuery to create a HTML photo element
// --------------------------------------------------
function renderWithJquery(imgObject, $parentEle) {
  const $newElement = $('<section></section>');
  const newImgTemplate = $('#photo-template').html();

  $newElement.html(newImgTemplate);
  $newElement.attr('keyword', imgObject.keyword);

  $newElement.find('h2').text(imgObject.title);
  $newElement.find('img').attr('src', imgObject.image_url);
  $newElement.find('p').text(imgObject.description);

  $parentEle.append($newElement);
}

// Populate the select dropdown with keywords
// --------------------------------------------------
function populateDropDown(allKeyWords) {
  const $dropdown = $('select');
  $dropdown.empty();
  $dropdown.append($('<option>', {value: 'default', text: 'Filter by Keyword'}));
  allKeyWords.forEach(keyword => {
    $dropdown.append($('<option>', { value: keyword, text: keyword }));
  });
}

// Create an event handler linked to the dropdown
// --------------------------------------------------
$('select').on('change', function(){
  // Get value from HTML dropdown
  let $selection = $(this).val();

  // Hide all section elements
  $('section').hide();

  // Check if default has been selected from dropdown
  if ($selection === 'default') {
    $('section').show(); // show all
  } else {
    $(`section[keyword="${$selection}"]`).show(); // show filtered
  }

  // Always hide the section template element
  $('#photo-template').hide();
});

$('#pagination').on('click', function(event){
  event.preventDefault();
  let page = $(event.target).html();
  //console.log(page);
  if(page === 'Page 1'){
    $('main > div').hide();
    $('main div:nth-child(2)').show();
    populateDropDown(allKeyWordsPg1);
  }
  if(page === 'Page 2'){
    $('main > div').hide();
    $('main div:nth-child(3)').show();
    populateDropDown(allKeyWordsPg2);
  }
});





function renderWithHandleBars(imgObject, $parentEle) {
  const source   = document.getElementById('img-template').innerHTML;
  const template = Handlebars.compile(source);

  const context = {
    image_url: imgObject.image_url,
    name: imgObject.name,
    description: imgObject.description
  };

  const html = template(context);

  $parentEle.append(html);
}















// Run on Ready
// --------------------------------------------------
$(document).ready(function() {
  // Read JSON data from local data directory
  readJSON('./data/page-1.json', 'json', allImagesPg1, allKeyWordsPg1);
  readJSON('./data/page-2.json', 'json', allImagesPg2, allKeyWordsPg2);
});
