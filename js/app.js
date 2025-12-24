// Vanila JavaScript todo list app
var taskInput = document.getElementById("new-task");                      // New-task
var addButton = document.getElementsByTagName("button")[0];               // First button
var incompleteTasksHolder = document.getElementById("incomplete-tasks");  // Incomplete-tasks
var completedTasksHolder = document.getElementById("completed-tasks");    // Completed-tasks

// New elements for filters and stats
var filterButtons = document.querySelectorAll(".filter-btn");
var taskCountSpan = document.getElementById("task-count");
var clearCompletedButton = document.getElementById("clear-completed");
var currentFilter = "all";

var createNewTaskElement = function(taskString) {       // New Task List Item
  var listItem = document.createElement("li");          // Create List Item
  var checkBox = document.createElement("input");       // Input (checkbox)
  var label = document.createElement("label");          // Label
  var editInput = document.createElement("input");      // Input (text)
  var editButton = document.createElement("button");    // Button.edit
  var deleteButton = document.createElement("button");  // Button.delete

  checkBox.type = "checkbox";         // Each element needs to be modified
  editInput.type = "text";            //
  editButton.innerText = "Edit";      //
  editButton.className = "edit";      //
  deleteButton.innerText = "Delete";  //
  deleteButton.className = "delete";  //
  label.innerText = taskString;       //

  listItem.appendChild(checkBox);      // Each element needs to be appended
  listItem.appendChild(label);         //
  listItem.appendChild(editInput);     //
  listItem.appendChild(editButton);    //
  listItem.appendChild(deleteButton);  //

  return listItem;
};

var addTask = function() {                            // Add a new task
  var listItemName = taskInput.value || "New Item";   // We hold the current value or provide the default one
  var listItem = createNewTaskElement(listItemName);  // Create a new list item with the text from #new-task
  incompleteTasksHolder.appendChild(listItem);        // Append listItem to incompleteTasksHolder
  bindTaskEvents(listItem, taskCompleted);            // We bind it to the incomplete holder
  taskInput.value = "";                               // Resets the field
  updateStats();                                      // Update stats after adding task
  applyFilter();                                      // Apply current filter
  saveToLocalStorage();                               // Save to localStorage
};

var editTask = function() {                                     // Edit an existing task
  var listItem = this.parentNode;                               // Create List Item
  var editInput = listItem.querySelector("input[type=text]");    // Input (text)
  var label = listItem.querySelector("label");                  // Label
  var button = listItem.getElementsByTagName("button")[0];      // Button

  var containsClass = listItem.classList.contains("editMode");  // We check for .editMode and assign it a variable
  if(containsClass) {                                           // Switch from .editMode
      label.innerText = editInput.value;                        // Label text become the input's value
      button.innerText = "Edit";                                // Buttons name modified to Edit
      saveToLocalStorage();                                     // Save to localStorage after edit
  } else {                                                      // Switch to .editMode
     editInput.value = label.innerText;                         // Input value becomes the label's text
     button.innerText = "Save";                                 // Button name modified to Save
  }
    listItem.classList.toggle("editMode");                      // Toggle .editMode on the parent
};

var deleteTask = function() {      // Delete an existing task
  var listItem = this.parentNode;  // We use parentNode to target the object containing the delete button
  var ul = listItem.parentNode;    // We use parentNode again to target the list containing the task
  ul.removeChild(listItem);        // Remove the parent list item from the ul
  updateStats();                    // Update stats after deleting task
  saveToLocalStorage();             // Save to localStorage
};

var taskCompleted = function() {               // Mark a task as complete
  var listItem = this.parentNode;              // We assign it for readability
  completedTasksHolder.appendChild(listItem);  // Append the task list item to the #completed-tasks
  bindTaskEvents(listItem, taskIncomplete);    // We bind it to the opposite holder
  updateStats();                                // Update stats after completing task
  applyFilter();                                // Apply current filter
  saveToLocalStorage();                         // Save to localStorage
};

var taskIncomplete = function() {               // Mark a task as incomplete
  var listItem = this.parentNode;               // We assign it for readability
  incompleteTasksHolder.appendChild(listItem);  // Append the task list item to the #incomplete-tasks
  bindTaskEvents(listItem, taskCompleted);      // We bind it to the opposite holder
  updateStats();                                // Update stats after incompleting task
  applyFilter();                                // Apply current filter
  saveToLocalStorage();                         // Save to localStorage
};

var bindTaskEvents = function(taskListItem, checkBoxEventHandler) {   // Select it's children
  var checkBox = taskListItem.querySelector("input[type=checkbox]");  //
  var editButton = taskListItem.querySelector("button.edit");         //
  var deleteButton = taskListItem.querySelector("button.delete");     //
  editButton.onclick = editTask;                                      // Bind editTask to edit button
  deleteButton.onclick = deleteTask;                                  // Bind deleteTask to delete button
  checkBox.onchange = checkBoxEventHandler;                           // Bind checkBoxEventHandler to checkbox
};

// Filter functions
var applyFilter = function() {
  var incompleteTasks = incompleteTasksHolder.children;
  var completedTasks = completedTasksHolder.children;
  
  // Show/hide incomplete tasks based on filter
  for(var i = 0; i < incompleteTasks.length; i++) {
    var task = incompleteTasks[i];
    if(currentFilter === "all" || currentFilter === "active") {
      task.style.display = "list-item";
    } else if(currentFilter === "completed") {
      task.style.display = "none";
    }
  }
  
  // Show/hide completed tasks based on filter
  for(var i = 0; i < completedTasks.length; i++) {
    var task = completedTasks[i];
    if(currentFilter === "all" || currentFilter === "completed") {
      task.style.display = "list-item";
    } else if(currentFilter === "active") {
      task.style.display = "none";
    }
  }
  
  // Update h3 visibility based on filter and task counts
  var hasIncomplete = incompleteTasksHolder.children.length > 0 && (currentFilter === "all" || currentFilter === "active");
  var hasCompleted = completedTasksHolder.children.length > 0 && (currentFilter === "all" || currentFilter === "completed");
  
  document.querySelector("h3:nth-of-type(1)").style.display = hasIncomplete ? "block" : "none";
  document.querySelector("h3:nth-of-type(2)").style.display = hasCompleted ? "block" : "none";
};

var setFilter = function(filter) {
  currentFilter = filter;
  
  // Update button states
  filterButtons.forEach(function(button) {
    if(button.dataset.filter === filter) {
      button.classList.add("active");
    } else {
      button.classList.remove("active");
    }
  });
  
  applyFilter();
};

// Stats functions
var updateStats = function() {
  var totalTasks = incompleteTasksHolder.children.length + completedTasksHolder.children.length;
  var completedTasks = completedTasksHolder.children.length;
  var activeTasks = incompleteTasksHolder.children.length;
  
  taskCountSpan.innerText = totalTasks + " tasks · " + completedTasks + " completed · " + activeTasks + " active";
};

// Clear completed tasks
var clearCompleted = function() {
  while(completedTasksHolder.firstChild) {
    completedTasksHolder.removeChild(completedTasksHolder.firstChild);
  }
  updateStats();
  applyFilter();
  saveToLocalStorage();
};

// LocalStorage functions
var saveToLocalStorage = function() {
  var tasks = {
    incomplete: [],
    completed: []
  };
  
  // Save incomplete tasks
  for(var i = 0; i < incompleteTasksHolder.children.length; i++) {
    var task = incompleteTasksHolder.children[i];
    var label = task.querySelector("label");
    tasks.incomplete.push(label.innerText);
  }
  
  // Save completed tasks
  for(var i = 0; i < completedTasksHolder.children.length; i++) {
    var task = completedTasksHolder.children[i];
    var label = task.querySelector("label");
    tasks.completed.push(label.innerText);
  }
  
  localStorage.setItem("todoTasks", JSON.stringify(tasks));
};

var loadFromLocalStorage = function() {
  var tasks = JSON.parse(localStorage.getItem("todoTasks"));
  
  if(tasks) {
    // Clear existing tasks
    while(incompleteTasksHolder.firstChild) {
      incompleteTasksHolder.removeChild(incompleteTasksHolder.firstChild);
    }
    while(completedTasksHolder.firstChild) {
      completedTasksHolder.removeChild(completedTasksHolder.firstChild);
    }
    
    // Load incomplete tasks
    for(var i = 0; i < tasks.incomplete.length; i++) {
      var taskString = tasks.incomplete[i];
      var listItem = createNewTaskElement(taskString);
      incompleteTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskCompleted);
    }
    
    // Load completed tasks
    for(var i = 0; i < tasks.completed.length; i++) {
      var taskString = tasks.completed[i];
      var listItem = createNewTaskElement(taskString);
      var checkBox = listItem.querySelector("input[type=checkbox]");
      checkBox.checked = true;
      completedTasksHolder.appendChild(listItem);
      bindTaskEvents(listItem, taskIncomplete);
    }
    
    updateStats();
    applyFilter();
  }
};

var ajaxRequest = function() {
  console.log("AJAX request");
};

// Event listeners
addButton.addEventListener("click", addTask);      // Adds event listener for the click handler to the addTask function
addButton.addEventListener("click", ajaxRequest);  // Adds an event listener for AJAX

// Filter button event listeners
filterButtons.forEach(function(button) {
  button.addEventListener("click", function() {
    setFilter(this.dataset.filter);
  });
});

// Clear completed button event listener
clearCompletedButton.addEventListener("click", clearCompleted);

// Load tasks from localStorage on page load
window.addEventListener("load", function() {
  loadFromLocalStorage();
});

for(var i = 0; i < incompleteTasksHolder.children.length; i++) {     // Cycle over incompleteTasksHolder ul list items
  bindTaskEvents(incompleteTasksHolder.children[i], taskCompleted);  // Bind events to list item's children (taskCompleted)
}

for(var i = 0; i < completedTasksHolder.children.length; i++) {      // Cycle over completedTasksHolder ul list items
  bindTaskEvents(completedTasksHolder.children[i], taskIncomplete);   // Bind events to list item's children (taskIncomplete)
}

// Initial stats update
updateStats();