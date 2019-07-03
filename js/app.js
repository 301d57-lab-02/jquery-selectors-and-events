'use strict';

let allImages = [];
let allKeyWords = [];

// Create a constructor for image objects
const ImgObj = function(image_url, title, description, keyword, horns) {
  this.image_url = image_url;
  this.title = title;
  this.description = description;
  this.keyword = keyword;
  this.horns = horns;
  allImages.push(this);
};

// Read the JSON file
function readJSON(filePath, fileType){
  $.get(filePath, fileType).then(results => {
    results.forEach(img => {
      new ImgObj(img.image_url, img.title, img.description, img.keyword, img.horns);
      // If img.keyword does not exists in allKeyWords, push it into allKeyWords.
      if(!allKeyWords.includes(img.keyword)) {
        allKeyWords.push(img.keyword);
      }
    });

    allImages.forEach(img => {
      renderWithJquery(img);
    });
    $('#photo-template').hide();
    // $('body').css('height', $('html').css('height'));
    populateDropDown();
  });
}

// Use jQuery to create a HTML photo element
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
function populateDropDown() {
  const $dropdown = $('select');

  allKeyWords.forEach(keyword => {
    $dropdown.append($('<option>', { value: keyword, text: keyword }));
  });
}

// Create an event handler linked to the dropdown
$('select').on('change', function(){
  let $selection = $(this).val();
  $('section').hide();
  $(`section[keyword="${$selection}"]`).show();
});

// Run on Ready
$(document).ready(function() {
  readJSON('./data/page-1.json', 'json');
});
