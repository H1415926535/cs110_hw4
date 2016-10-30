'use strict';

const searchBox = $('#search');
let todoList = {}

const initialize = function() {
  $.ajax({
    method: "get",
    url: "/todos",
    contentType: "application/json",
    dataType: "json",
    success: function(data) {
      todoList = data;
      render(todoList);
    },
    error: function() {
      console.log('Request was not successful');
    },
  });
}

const checkState = function() {
  const prompt = searchBox.val();
  let filteredList = todoList;
  if(prompt.trim() !== ""){
    filteredList = todoList.filter(function(currentElement, index, array) {
      return currentElement.name.toLowerCase().indexOf(prompt.toLowerCase()) >= 0;
    });
  }
  render(filteredList);
};

const render = function(arr) {
  const listContainer = $('#todo-container').html("");
  if(arr.length === 0) {
    const errMessage = `<h2 class="error">Sorry, no element was found</h2>`
    listContainer.append(errMessage);
  }
  else {
    arr.forEach(function(currentElement) {
      const liContent = `<li>${currentElement.name}</li>
                          <input type='checkbox' onChange='checkboxTrigger'></input>
                          <button onClick='clickHandler'>Delete</button>`
      const newListItem = $(liContent);
      listContainer.append(newListItem);
    })
  }
};

const checkboxTrigger = function(e) {
    console.log(e);
};

initialize();
searchBox.on('change', checkState);
