/* eslint-disable no-use-before-define */
import './style/style.css';

const toDoList = (() => {
  const allTaskList = [];
  const createToDoObject = (taskObject) => {
    const toDoObject = { taskObject };
    displayController.createToDoElement(toDoObject);
    addTaskToList(taskObject);
    console.log(allTaskList);
  };

  const addTaskToList = (taskObject) => {
    allTaskList.push(taskObject);
  };

  return { createToDoObject };
})();

const displayController = (() => {
  const nameCont = document.querySelector('.tab-name');
  const tabs = Array.from(document.querySelectorAll('li'));
  const addButton = document.querySelector('.add-btn');
  const formDiv = document.querySelector('.add-form');
  const formCloseButton = document.querySelector('.close-form');
  const form = document.querySelector('form');
  const container = document.querySelector('.container');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.querySelector('#task-name').value;

    toDoList.createToDoObject(taskName);
    form.reset();
    formDiv.style.display = 'none';
  });

  formCloseButton.addEventListener('click', () => {
    formDiv.style.display = 'none';
  });

  addButton.addEventListener('click', () => {
    formDiv.style.display = 'block';
  });

  tabs.forEach((tab) =>
    tab.addEventListener('click', (e) => {
      nameCont.textContent = e.target.textContent;
    })
  );

  const createToDoElement = (toDoObject) => {
    const toDoElement = document.createElement('div');
    Object.values(toDoObject).forEach((value) => {
      toDoElement.textContent += value;
      container.appendChild(toDoElement);
    });
  };

  return { createToDoElement };
})();
