'use strict';

const initialize = function() {
  $.ajax({
    method: "get",
    url: "/todos",
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      render(data.items);
    },
    error: function() {
      console.log('Request was not successful');
    },
  });
}

const render = function(arr) {
  const listContainer = $('#todo-container').html("");
  if(arr.length === 0) {
    const errMessage = `<h2 class="error">Sorry, no element was found</h2>`
    listContainer.append(errMessage);
  }
  else {
    arr.forEach(function(currentElement) {
      const newListItem = `<li>${currentElement.name}</li>
                          <input type='checkbox' id="${currentElement.id}"></input>
                          <button id="${currentElement.id}" class="delBtn">Delete</button>`
      listContainer.append($(newListItem));
      $(newListItem).prop('checked', currentElement.completed);
    })
  }
};

const checkboxTrigger = function(e) {
    console.log(e);
};

const getAndDraw = function(){
  const searchBox = $('#search').val();
  $.ajax({
    url      : "/todos",
    type     : 'get',
    dataType : 'json',
    data     : {
       searchtext : searchBox
    },
    success  : function(data) {
       render(data.items);
    },
    error    : function(data) {
       alert('Error searching');
    }
   });
}

initialize();
$('#searchButton').on('click', getAndDraw);

$('#addButton').on('click', function() {
  const newName = $('#add').val();
  if(newName.trim() !== '') {
   $('#add').val('');
   $.ajax({
     url         : "/todos",
     type        : 'post',
     dataType    : 'json',
     data        : JSON.stringify({
         name   : newName,
         completed : false
     }),
     contentType : "application/json; charset=utf-8",
     success     : function(data) {
         getAndDraw();
     },
     error       : function(data) {
         alert('Error creating todo');
     }
   });
  }
 })

$('#todo-container').on('click', '.delBtn', function(e) {
  const targetID = e.target.id;
  $.ajax({
    url     : "/todos/" + targetID,
    type    : 'delete',
    success : function(data) {
        getAndDraw();
    },
    error   : function(data) {
        alert('Error deleting the item');
    }
  });
})
