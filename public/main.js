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
  const listCont = $('#todo-container').html("");
  if(arr.length === 0) {
    const errMessage = `<h3 style="color:blue"> No element found </h3>`
    listCont.append(errMessage);
  }
  else {
    arr.forEach(function(currentElement) {
      const newListItem = `<li id="${currentElement.id}">${currentElement.name}</li>
                          <input type='checkbox' id="${currentElement.id}"
                          class="completedCheckbox" ${currentElement.completed ? 'checked' : ''}></input>
                          <button id="${currentElement.id}" class="delBtn">Delete</button>`
      listCont.append($(newListItem));
    })
  }
};

const get = function(){
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
       alert('Error');
    }
   });
}

initialize();
$('#searchButton').on('click', get);

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
         get();
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
        get();
    },
    error   : function(data) {
        alert('Error deleting the item');
    }
  });
})

$('#todo-container').on('change', '.completedCheckbox', function(e) {
  const targetID = e.target.id;
  const todoItem = {
    completed: e.target.checked,
    id: targetID
  }
  $.ajax({
       url         : "/todos/" + targetID,
       type        : 'put',
       dataType    : 'json',
       data        : JSON.stringify(todoItem),
       contentType : "application/json; charset=utf-8",
       success     : function(data) {
         get();
       },
       error       : function(data) {
           alert('Error creating todo');
       }
  });
});
