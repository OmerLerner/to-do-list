//Container of all the lists
const listsContainer = document.querySelector('[data-lists]');

//Form when you create a new list
const newListForm = document.querySelector('[data-new-list-form]');

//Input for creating a new list
const newListInput = document.querySelector('[data-new-list-input]');

//Button you click when you want to delete a list
const deleteListButton=document.querySelector('[data-delete-list-button]');

//Container for current todo list
const listDisplayContainer = document.querySelector('[data-list-display-container]');

//Element for title of list
const listTitleElement= document.querySelector('[data-list-title');

//Counter for remaining tasks
const listCountElement= document.querySelector('[data-list-count');

//Container for all of the tasks in the todo list
const tasksContainer= document.querySelector('[data-tasks]');

//Template for a task, saved in HTML
const taskTemplate= document.getElementById("task-template");

//Form for creating a new task
const newTaskForm = document.querySelector('[data-new-task-form]');

//Input of the new task name
const newTaskInput = document.querySelector('[data-new-task-input]');

//Button that clears completed tasks
const clearCompletedTasksButton = document.querySelector('[data-clear-complete-tasks-button]');


//Local storage keys
const LOCAL_STORAGE_LIST_KEY='task.lists';
const LOCAL_STORAGE_LIST_ID_KEY='task.selectedListId';

//Fetches the list from local storage, if it doesn't exist, use the default list
let lists= JSON.parse(localStorage.getItem(LOCAL_STORAGE_LIST_KEY)) || 
[{id: "1", name:'Daily Chores', tasks:[]},
{id: "2", name:'Grocery List', tasks:[]}];

//The ID for the currently selected list, this is a string
let selectedListId= localStorage.getItem(LOCAL_STORAGE_LIST_ID_KEY);


//List Container Listeners & Functions

//Adds an event listener ONLY TO THE LIST ELEMENTS in the container
listsContainer.addEventListener('click', e =>{
    //Check if we clicked an "li" element//
    if (e.target.tagName.toLowerCase() === "li")
    {
        selectedListId= e.target.dataset.listId;
        saveAndRender();
    }
})
//Event listener that creates a new list when we click submit/enter
newListForm.addEventListener('submit', e =>{
    e.preventDefault();
    const listName= newListInput.value;
    if (listName == null || listName === '') return;
    const list=createList(listName);
    newListInput.value = null;
    lists.push(list);
    saveAndRender();
});

//Creates a new list object
function createList(name){
    return {id: Date.now().toString(), name: name, tasks: []};
}



//Task Container Listeners & Functions

//Event listener that creates a new task when we click submit/enter
newTaskForm.addEventListener('submit', e =>{
    e.preventDefault();
    const taskName= newTaskInput.value;
    if (taskName == null || taskName === '') return;
    const task=createTask(taskName);
    newTaskInput.value = null;
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks.push(task);
    saveAndRender();
});

//Creates new task object - taskContainer
function createTask(name){
    return {id: Date.now().toString(), name: name, complete: false};

}

function addCollapsibleEventListener(task){
    task.addEventListener("click", function(){
        
    })
}

//Event listener that edits task count when we complete a task
tasksContainer.addEventListener('click', e=>{
    if(e.target.tagName.toLowerCase()==='input'){
        const selectedList =lists.find(list => list.id === selectedListId);
        const selectedTask = selectedList.tasks.find(task => task.id === e.target.id);
        selectedTask.complete = e.target.checked;
        save();
        renderTaskCount(selectedList);

    }
})
//Event listener that deletes the currently selected list (delete list button)
deleteListButton.addEventListener('click', e=>{
    lists=lists.filter(list => list.id!==selectedListId);
    selectedListId=null;
    saveAndRender();
})

//Event listener that clears completed tasks when you click the button 
clearCompletedTasksButton.addEventListener('click', e=>{
    const selectedList = lists.find(list => list.id === selectedListId);
    selectedList.tasks = selectedList.tasks.filter(task => !task.complete);
    saveAndRender();
})






//DOM Manipulation Functions

function saveAndRender()
{
    save();
    render();
}
//Saves the list of tasks onto the local storage so it remembers choices on refresh
function save()
{
    localStorage.setItem(LOCAL_STORAGE_LIST_KEY, JSON.stringify(lists));
    localStorage.setItem(LOCAL_STORAGE_LIST_ID_KEY, selectedListId);
}

//Recieves an array of list names, adds them to the page
function render(){
    clearElement(listsContainer);
    renderLists();
    const selectedList = lists.find(list => list.id === selectedListId);
    //Checks if the list that we deleted was the selected one
    if (selectedListId == null)
    {
        listDisplayContainer.style.display= "none";
    }
    else
    {
        listDisplayContainer.style.display = '';
        listTitleElement.innerText = selectedList.name;
        renderTaskCount(selectedList);
        clearElement(tasksContainer);
        renderTasks(selectedList);
    }
}

//Recieves a task list, counts the remaining tasks left in order to edit the string for amount of remaining tasks
function renderTaskCount(selectedList){
    const incompleteTaskCount = selectedList.tasks.filter(task => !task.complete).length;
    const taskString = incompleteTaskCount === 1 ? "task" : "tasks";
    listCountElement.innerText= `${incompleteTaskCount} ${taskString} remaining`;
}

//Renders all of the tasks in the given list in order to display them in the container
function renderTasks(selectedList){
    selectedList.tasks.forEach(task =>{
        const taskElement = document.importNode(taskTemplate.content, true);
        const checkbox = taskElement.querySelector('input');
        checkbox.id = task.id;
        checkbox.checked = task.complete;
        const label = taskElement.querySelector('label');
        label.htmlFor = task.id;
        label.append(task.name);
        tasksContainer.appendChild(taskElement);

    })

}
//Renders a list
function renderLists(){
    lists.forEach(list =>{
        const listElement=document.createElement('li');
        listElement.dataset.listId = list.id;
        listElement.classList.add("list-name");
        listElement.innerText=list.name;
        if (list.id == selectedListId){
            listElement.classList.add('active-list');
        }
        listsContainer.appendChild(listElement);
    });
}
//Clears a list
function clearElement(element){
    while(element.firstChild){
        element.removeChild(element.firstChild);
    }
}

render();