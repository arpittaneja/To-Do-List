/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
import './style/style.css';
import { add, parse, formatISO, isEqual, isWithinInterval } from 'date-fns';

const toDoList = (() => {
  const allToDosList = [];
  const todayToDosList = [];
  const weekToDosList = [];

  const currentDate = new Date();
  const currentDateISO = formatISO(currentDate, { representation: 'date' });
  const weekAfterCurrentDate = add(currentDate, { days: 7 });
  const weekAfterCurrentDateISO = formatISO(weekAfterCurrentDate, {
    representation: 'date',
  });
  console.log(currentDateISO);
  console.log(weekAfterCurrentDateISO);

  const createToDoObject = (...taskKeys) => {
    // console.log(taskKeys);
    const toDoObject = {
      taskTitle: '',
      taskDescription: '',
      dueDate: '',
      priority: '',
    };

    let listIterator = 0;
    Object.keys(toDoObject).forEach((key) => {
      toDoObject[key] = taskKeys[listIterator++];
    });

    console.log(toDoObject);
    displayController.createToDoElement(toDoObject);
    console.log(allToDosList);
    addTaskToList(toDoObject);
    addTaskToTodayList(toDoObject);
    addTaskToWeekList(toDoObject);
  };

  const addTaskToList = (taskObject) => {
    allToDosList.push(taskObject);
    console.log(allToDosList);
  };

  const addTaskToTodayList = (taskObject) => {
    // console.log(parse(taskObject.dueDate, 'yyyy-MM-dd', new Date()));

    if (
      isEqual(
        parse(taskObject.dueDate, 'yyyy-MM-dd', new Date()),
        parse(currentDateISO, 'yyyy-MM-dd', new Date())
      )
    ) {
      todayToDosList.push(taskObject);
    }
    console.log('today', todayToDosList);
  };

  const addTaskToWeekList = (taskObject) => {
    // console.log(parse(taskObject.dueDate, 'yyyy-MM-dd', new Date()));

    if (
      isWithinInterval(parse(taskObject.dueDate, 'yyyy-MM-dd', new Date()), {
        start: parse(currentDateISO, 'yyyy-MM-dd', new Date()),
        end: parse(weekAfterCurrentDateISO, 'yyyy-MM-dd', new Date()),
      })
    ) {
      weekToDosList.push(taskObject);
    }
    console.log('week', weekToDosList);
  };

  const removeToDo = (index) => {
    console.log(allToDosList, index);
    allToDosList.splice(index, 1);
    console.log(allToDosList);

    // displayController.updateToDoList(allToDosList);
  };

  return { createToDoObject, removeToDo };
})();

const displayController = (() => {
  const tabNameContainer = document.querySelector('.tab-selected-name');
  const tabs = Array.from(document.querySelectorAll('li'));
  const addButton = document.querySelector('.add-btn');
  const formDiv = document.querySelector('.form-container');
  const formCloseButton = document.querySelector('.close-form');
  const form = document.querySelector('form');
  const mainContainer = document.querySelector('.container');
  const toDoContainer = document.querySelector('.todo-container');

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.querySelector('#task-title').value;
    const taskDescription = document.querySelector('#task-desc').value;
    const dueDate = document.querySelector('#due-date').value;
    const taskPriority = document.querySelector('#task-priority').checked;
    // if (document.querySelector('#task-priority').checked) {
    //   toDoContainer.style.backgroundColor = 'red';
    // } else {
    //   toDoContainer.style.backgroundColor = 'green';
    // }
    toDoList.createToDoObject(taskName, taskDescription, dueDate, taskPriority);
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
      tabNameContainer.textContent = e.target.textContent;
    })
  );

  const updateToDoList = (index) => {
    toDoContainer.removeChild(Array.from(toDoContainer.children)[index]);

    // console.log(Array.from(toDoContainer.children)[index]);
  };

  const createToDoElement = (toDoObject) => {
    const toDoElement = document.createElement('div');
    const toDoContent = document.createElement('span');
    const clearButton = document.createElement('button');
    const taskPriorityColor = toDoObject.priority ? 'red' : 'green';
    clearButton.addEventListener('click', (e) => {
      // console.log(typeof toDoContainer.children);
      const indexOfTodoToBeRemoved = Array.from(toDoContainer.children).indexOf(
        e.target.parentElement
      );

      toDoList.removeToDo(indexOfTodoToBeRemoved);
      updateToDoList(indexOfTodoToBeRemoved);
      // console.log(toDoContainer.childNodes);
      // console.log(e.target.parentElement);
      // console.log(toDoContainer.children);
    });
    clearButton.textContent = 'X';
    Object.values(toDoObject).forEach((value) => {
      toDoContent.textContent += `  ${value}`;
      toDoElement.style.backgroundColor = taskPriorityColor;
      toDoElement.append(toDoContent, clearButton);
      toDoContainer.appendChild(toDoElement);
    });
  };

  return { createToDoElement };
})();
