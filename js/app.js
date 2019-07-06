'use strict';

// Global Variables
let allImagesArray = [];
let allKeyWords = [];
let pageTracker = 0;

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
  let tempImgArray = [];
  let tempKeywordArray = []
  $.get(filePath, fileType).then(results => {
    results.forEach(img => {
      // Instantiate new object using ImgObj constructor
      new ImgObj(img.image_url, img.title, img.description, img.keyword, img.horns, tempImgArray);

      // If img.keyword does not exists in allKeyWords, push it into allKeyWords.
      if(!tempKeywordArray.includes(img.keyword)) {
        tempKeywordArray.push(img.keyword);
      }
    });
    pageTracker++;
    allImagesArray.push(tempImgArray);
    allKeyWords.push(tempKeywordArray);
    showPage(tempImgArray, tempKeywordArray);


  });

  return;
}

function showPage(allImages, allKeyWords) {
  // Render all of the images

  let $divEle = $('<div></div>');
  allImagesArray[pageTracker-1].sort((a, b) => {
    if (a.title.toUpperCase() > b.title.toUpperCase()) {
      return 1;
    } else {
      return -1;
    }
  });

  allImages.forEach(img => {
    renderWithHandleBars(img, $divEle);
  });
  $('main').append($divEle);

  if(pageTracker > 1) {
    $divEle.hide();
  }
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
  const $dropdown = $('#filter');
  $dropdown.empty();
  $dropdown.append($('<option>', {value: 'default', text: 'Filter by Keyword'}));
  allKeyWords.forEach(keyword => {
    $dropdown.append($('<option>', { value: keyword, text: keyword }));
  });
}

// Create an event handler linked to the dropdown
// --------------------------------------------------
$('#filter').on('change', function(){
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
  if(page === 'Page 1'){
    pageTracker = 1;
    $('main > div').hide();
    $('div:nth-child(2)').show();
    populateDropDown(allKeyWords[0]);
  }
  if(page === 'Page 2'){
    pageTracker = 2;
    $('main > div').hide();
    $('div:nth-child(3)').show();
    populateDropDown(allKeyWords[1]);
  }
});

// Custom sort event handler for titles and horns
$('#sort').on('change', function(){
  // Get value from HTML dropdown
  let $selection = $(this).val();

  if ($selection === 'title') {
    allImagesArray[pageTracker-1].sort((a, b) => {
      if (a.title.toUpperCase() > b.title.toUpperCase()) {
        return 1;
      } else {
        return -1;
      }
    });
    let $divEle = $(`main div:nth-child(${pageTracker+1})`);
    $divEle.children().remove();

    allImagesArray[pageTracker-1].forEach(imgObj => {
      renderWithHandleBars(imgObj,$divEle);
    });
  }

  if ($selection === 'horns') {
    allImagesArray[pageTracker-1].sort((a, b) => {
      if (a.horns > b.horns) {
        return 1;
      } else {
        return -1;
      }
    });

    let $divEle = $(`main div:nth-child(${pageTracker+1})`);
    $divEle.children().remove();

    allImagesArray[pageTracker-1].forEach(imgObj => {
      renderWithHandleBars(imgObj,$divEle);
    });
  }

  // Always hide the section template element
  $('#photo-template').hide();
});


function renderWithHandleBars(imgObject, $parentEle) {
  const source   = document.getElementById('img-template').innerHTML;
  const template = Handlebars.compile(source);

  const context = {
    keyword: imgObject.keyword,
    image_url: imgObject.image_url,
    title: imgObject.title,
    description: imgObject.description
  };

  const html = template(context);
  $parentEle.append(html);
}

// Run on Ready
// --------------------------------------------------
$(document).ready(function() {
  // Read JSON data from local data directory
  readJSON('./data/page-1.json', 'json', allImagesArray, allKeyWords);
  readJSON('./data/page-2.json', 'json', allImagesArray, allKeyWords);
});

