'use strict';

// Global Variables
let allImages = [];
let allKeyWords = [];

// Constructor for image objects
// --------------------------------------------------
const ImgObj = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImages.push(this);
};

// Read the JSON file from local directory
// --------------------------------------------------
function readJSON(filePath, fileType){
  $.get(filePath, fileType).then(results => {
    results.forEach(img => {
      // Instantiate new object using ImgObj constructor
      new ImgObj(img.image_url, img.title, img.description, img.keyword, img.horns);

      // If img.keyword does not exists in allKeyWords, push it into allKeyWords.
      if(!allKeyWords.includes(img.keyword)) {
        allKeyWords.push(img.keyword);
      }
    });

    // Render all of the images
    allImages.forEach(img => {
      renderWithJquery(img);
    });

    // Always hide the section template element
    $('#photo-template').hide();

    // Poplulate dropdown with keywords
    populateDropDown();
  });
}

// Use jQuery to create a HTML photo element
// --------------------------------------------------
function renderWithJquery(imgObject) {
  const $newElement = $('<section></section>');
  const newImgTemplate = $('#photo-template').html();

  $newElement.html(newImgTemplate);
  $newElement.attr('keyword', imgObject.keyword);

  $newElement.find('h2').text(imgObject.title);
  $newElement.find('img').attr('src', imgObject.image_url);
  $newElement.find('p').text(imgObject.description);

  $('main').append($newElement);
}

// Populate the select dropdown with keywords
// --------------------------------------------------
function populateDropDown() {
  const $dropdown = $('select');

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

// Run on Ready
// --------------------------------------------------
$(document).ready(function() {
  // Read JSON data from local data directory
  readJSON('./data/page-1.json', 'json');
});
