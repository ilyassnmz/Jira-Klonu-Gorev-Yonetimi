const listColumns = document.querySelectorAll('.drag-item-list');
const todoList = document.getElementById('todo-list');
const progressList = document.getElementById('progress-list');
const doneList = document.getElementById('done-list');

const addButtons = document.querySelectorAll('.add-btn:not(.update)');
const saveButtons = document.querySelectorAll('.update');
const addItemContainers = document.querySelectorAll('.add-container');
const addItems = document.querySelectorAll('.add-item');
const dueDates = document.querySelectorAll('.due-date');

const toggleBtn = document.getElementById('toggle-theme');

let todoListArray = [];
let progressListArray = [];
let doneListArray = [];
let listArrays = [];

let draggedItem;
let currentColumn;
let dragging = false;
let updatedOnLoad = false;

function getSavedColumns() {
  if (localStorage.getItem('todoItems')) {
    todoListArray = JSON.parse(localStorage.getItem('todoItems'));
    progressListArray = JSON.parse(localStorage.getItem('progressItems'));
    doneListArray = JSON.parse(localStorage.getItem('doneItems'));
  } else {
    todoListArray = ['React Entegrasyonu||DATE:2025-08-01'];
    progressListArray = ['Sendgrid Entegrasyonu||DATE:2025-08-02'];
    doneListArray = ['Verimor Entegrasyonu||DATE:2025-07-25'];
  }
}

function updateSavedColumns() {
  listArrays = [todoListArray, progressListArray, doneListArray];
  const arrayNames = ['todo', 'progress', 'done'];
  arrayNames.forEach((arrayName, index) => {
    localStorage.setItem(`${arrayName}Items`, JSON.stringify(listArrays[index]));
  });
}

function createItem(columnItem, column, item, index) {
  const listItem = document.createElement('li');
  listItem.classList.add('drag-item');
  listItem.draggable = true;
  listItem.contentEditable = true;
  listItem.setAttribute('onfocusout', `updateItem(${index},${column})`);
  listItem.setAttribute('ondragstart', 'drag(event)');

  const dateMatch = item.match(/\|\|DATE:(.*)$/);
  const taskText = dateMatch ? item.replace(/\|\|DATE:.*/, '') : item;
  const taskDate = dateMatch ? dateMatch[1] : null;

  listItem.textContent = taskText;

  if (taskDate) {
    const dateTag = document.createElement('div');
    dateTag.textContent = `⏰ ${taskDate}`;
    dateTag.style.fontSize = '12px';
    dateTag.style.color = '#5e6c84';
    listItem.appendChild(document.createElement('br'));
    listItem.appendChild(dateTag);
  }

  columnItem.appendChild(listItem);
}

function updateItem(id, column) {
  const selectedArray = listArrays[column];
  const selectedColumn = listColumns[column].children;
  if (!dragging) {
    if (!selectedColumn[id].textContent.trim()) {
      delete selectedArray[id];
    } else {
      selectedArray[id] = selectedColumn[id].textContent.trim();
    }
    updateDOM();
  }
}

function allowDrop(e) {
  e.preventDefault();
}

function dragEnter(column) {
  listColumns[column].classList.add('over');
  currentColumn = column;
}

function drop(e) {
  e.preventDefault();
  const parent = listColumns[currentColumn];
  listColumns.forEach((column) => column.classList.remove('over'));
  parent.appendChild(draggedItem);
  dragging = false;
  updateInsideArrays();
}

function drag(e) {
  draggedItem = e.target;
  dragging = true;
}

function updateInsideArrays() {
  todoListArray = Array.from(todoList.children).map(item => item.textContent);
  progressListArray = Array.from(progressList.children).map(item => item.textContent);
  doneListArray = Array.from(doneList.children).map(item => item.textContent);
  updateDOM();
}

function filterArray(array) {
  return array.filter((item) => item !== null);
}

function updateDOM() {
  if (!updatedOnLoad) getSavedColumns();

  todoList.textContent = '';
  todoListArray.forEach((item, index) => createItem(todoList, 0, item, index));
  todoListArray = filterArray(todoListArray);

  progressList.textContent = '';
  progressListArray.forEach((item, index) => createItem(progressList, 1, item, index));
  progressListArray = filterArray(progressListArray);

  doneList.textContent = '';
  doneListArray.forEach((item, index) => createItem(doneList, 2, item, index));
  doneListArray = filterArray(doneListArray);

  updatedOnLoad = true;
  updateSavedColumns();
}

function showItemDiv(column) {
  addButtons[column].style.visibility = 'hidden';
  addItemContainers[column].style.display = 'flex';
  saveButtons[column].style.display = 'flex';
}

function hideItemDiv(column) {
  addButtons[column].style.visibility = 'visible';
  addItemContainers[column].style.display = 'none';
  saveButtons[column].style.display = 'none';
  addToColumn(column);
}

function addToColumn(column) {
  const itemText = addItems[column].textContent.trim();
  const dateValue = dueDates[column].value;
  const selectedArray = listArrays[column];

  if (!itemText) return;

  let fullItem = itemText;
  if (dateValue) fullItem += `||DATE:${dateValue}`;

  selectedArray.push(fullItem);
  addItems[column].textContent = '';
  dueDates[column].value = '';
  updateDOM();
}

updateDOM();

function setTheme(isDark) {
  document.body.classList.toggle('dark-mode', isDark);
  toggleBtn.textContent = isDark ? '☀️ Light Mode' : '🌙 Dark Mode';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

const savedTheme = localStorage.getItem('theme');
setTheme(savedTheme === 'dark');

toggleBtn.addEventListener('click', () => {
  const isDark = !document.body.classList.contains('dark-mode');
  setTheme(isDark);
});
