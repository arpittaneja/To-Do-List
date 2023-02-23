/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
import './style/style.css';
import { add, parse, formatISO, isEqual, isWithinInterval } from 'date-fns';

const createTask = (title, project, description, dueDate, priority) => {
  return {
    title,
    description,
    dueDate,
    priority,
  };
};

const toDoList = (() => {
  const inboxTaskList = [];
  let todayToDosList = [];
  let weekToDosList = [];

  const currentDate = new Date();
  const currentDateISO = formatISO(currentDate, { representation: 'date' });
  const weekAfterCurrentDate = add(currentDate, { days: 7 });
  const weekAfterCurrentDateISO = formatISO(weekAfterCurrentDate, {
    representation: 'date',
  });
  console.log(currentDateISO);
  console.log(weekAfterCurrentDateISO);

  const getInboxTaskList = () => inboxTaskList;
  const getTodayToDosList = () => todayToDosList;
  const getWeekToDosList = () => weekToDosList;

  const addTaskToToDoList = (taskObject) => {
    addTaskToInbox(taskObject);
    addTaskToTodayList(taskObject);
    addTaskToWeekList(taskObject);
  };

  const addTaskToInbox = (taskObject) => {
    inboxTaskList.push(taskObject);
    console.log('inbox', inboxTaskList);
  };

  const addTaskToTodayList = (taskObject) => {
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

  const removeTaskFromInbox = (index) => {
    // console.log(inboxTaskList, index);
    inboxTaskList.splice(index, 1);
    updateTodayList();
    updateWeekList();
  };

  const updateTodayList = () => {
    todayToDosList = [];
    inboxTaskList.forEach((task) => {
      console.log(task.dueDate === currentDateISO);
      if (task.dueDate === currentDateISO) {
        todayToDosList.push(task);
      }
    });
    console.log(todayToDosList);
  };

  const updateWeekList = () => {
    weekToDosList = [];
    console.log('all', inboxTaskList);
    inboxTaskList.forEach((task) => {
      console.log(
        isWithinInterval(parse(task.dueDate, 'yyyy-MM-dd', new Date()), {
          start: parse(currentDateISO, 'yyyy-MM-dd', new Date()),
          end: parse(weekAfterCurrentDateISO, 'yyyy-MM-dd', new Date()),
        })
      );
      if (
        isWithinInterval(parse(task.dueDate, 'yyyy-MM-dd', new Date()), {
          start: parse(currentDateISO, 'yyyy-MM-dd', new Date()),
          end: parse(weekAfterCurrentDateISO, 'yyyy-MM-dd', new Date()),
        })
      ) {
        weekToDosList.push(task);
      }
    });
    console.log('week', weekToDosList);
  };

  const removeTaskFromTodayList = (index) => {
    console.log(todayToDosList, index);
    todayToDosList.splice(index, 1);
    // console.log(allToDosList);
  };

  return {
    getInboxTaskList,
    getTodayToDosList,
    getWeekToDosList,
    removeTaskFromAllLists: removeTaskFromInbox,
    removeTaskFromTodayList,
    updateTodayList,
    updateWeekList,
    addTaskToToDoList,
  };
})();

const displayController = (() => {
  const tabNameContainer = document.querySelector('.tab-selected-name');
  const inboxTabs = Array.from(document.querySelectorAll('.inbox>li'));
  const addButton = document.querySelector('.add-btn');
  const formDiv = document.querySelector('.form-container');
  const formCloseButton = document.querySelector('.close-form');
  const form = document.querySelector('form');
  const toDoContainer = document.querySelector('.todo-container');
  let previouslySelectedTab = 'Inbox';
  const addNewProject = document.querySelector('.add-new-project');
  const addNewProjectInputTab = document.querySelector('.input-project');
  const addProjectButton = document.querySelector('.add-project-btn');
  const cancelProjectButton = document.querySelector('.cancel-project-btn');
  const projectInput = document.querySelector('.project-input');
  const insertBeforeLi = document.querySelector('.insert-before-li');

  const projectsContainer = document.querySelector('.projects-container');

  addNewProject.addEventListener('click', (e) => {
    addNewProject.style.display = 'none';
    addNewProjectInputTab.style.display = 'block';
  });

  addProjectButton.addEventListener('click', (ev) => {
    const newProject = document.createElement('li');
    newProject.classList.add('project-tab');
    newProject.textContent = projectInput.value;
    projectsContainer.append(newProject);
    addNewProject.style.display = 'block';
    addNewProjectInputTab.style.display = 'none';
    projectInput.value = '';

    const projectTabs = Array.from(document.querySelectorAll('.project-tab'));
    console.log(projectTabs);

    projectTabs.forEach((tab) => {
      tab.addEventListener(
        'click',
        (e) => {
          // e.stopPropagation();
          console.log(tab.textContent);
          console.log('clicked');
          // console.log(tab.textContent, previouslySelectedTab);
          // if (tab.textContent !== previouslySelectedTab) {
          //   previouslySelectedTab = tab.textContent;
          //   console.log(previouslySelectedTab);
          // }
        },
        true
      );
    });
  });

  inboxTabs.forEach((tab) => {
    tab.addEventListener('click', (e) => {
      console.log('jnfejen');
      tabNameContainer.textContent = e.target.textContent;
      console.log(tab.textContent, previouslySelectedTab);

      if (tab.textContent !== previouslySelectedTab) {
        previouslySelectedTab = tab.textContent;
        console.log('different tab');

        selectTab(tab);

        // logic to display the to do list of the selected tab
        // if (previouslySelectedTab === 'Inbox') {
        // }

        makeDivsOnChange();
      }
    });
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.querySelector('#task-title').value;
    const taskDescription = document.querySelector('#task-desc').value;
    const dueDate = document.querySelector('#due-date').value;
    const taskPriority = document.querySelector('#task-priority').checked;

    const task = createTask(
      taskName,
      null,
      taskDescription,
      dueDate,
      taskPriority
    );

    toDoList.addTaskToToDoList(task);

    form.reset();
    formDiv.style.display = 'none';
    previouslySelectedTab = 'Inbox';
    selectTab(inboxTabs[0]);
    makeAllDivs(toDoList.getInboxTaskList());
  });

  formCloseButton.addEventListener('click', () => {
    formDiv.style.display = 'none';
  });

  addButton.addEventListener('click', () => {
    formDiv.style.display = 'block';
  });

  const selectTab = (tab) => {
    tab.classList.remove('unselected');
    tab.classList.add('selected');

    // logic to remove the selected class on remaning tabs
    inboxTabs.forEach((tb) => {
      if (tb.textContent !== previouslySelectedTab) {
        tb.classList.remove('selected');
        tb.classList.add('unselected');
      }
    });
    console.log(tab);
  };

  // inboxTabs.forEach((tab) =>
  //   tab.addEventListener('click', (e) => {
  //     tabNameContainer.textContent = e.target.textContent;
  //     if (e.target.classList.contains('unselected')) {
  //       e.target.classList.remove('unselected');
  //       e.target.classList.add('selected');
  //       if (e.target.textContent === 'Inbox') {
  //         toDoContainer.textContent = '';
  //         makeAllToDoListDivs(toDoList.allToDosList);
  //       } else if (e.target.textContent === 'Today') {
  //         toDoContainer.textContent = '';
  //         makeAllToDoListDivs(toDoList.todayToDosList);
  //       } else if (e.target.textContent === 'Week') {
  //         toDoContainer.textContent = '';
  //         makeAllToDoListDivs(toDoList.weekToDosList);
  //       }
  //     }
  //     inboxTabs.forEach((tb) => {
  //       if (tb !== e.target) {
  //         tb.classList.remove('selected');
  //         tb.classList.add('unselected');
  //       }
  //     });
  //   })
  // );

  // const updateToDoList = (index) => {
  //   // toDoContainer.removeChild(Array.from(toDoContainer.children)[index]);
  //   // console.log(Array.from(toDoContainer.children)[index]);
  // };

  // const makeAllToDoListDivs = (list) => {
  //   console.log(11);
  // };

  const makeAllDivs = (list) => {
    toDoContainer.textContent = '';
    list.forEach((toDoObject) => {
      const toDoElement = document.createElement('div');
      const toDoContent = document.createElement('span');
      const clearButton = document.createElement('button');
      const taskPriorityColor = toDoObject.priority ? 'red' : 'green';
      clearButton.textContent = 'X';

      clearButton.addEventListener('click', (e) => {
        const indexOfTodoToBeRemoved = Array.from(
          toDoContainer.children
        ).indexOf(e.target.parentElement);

        toDoList.removeTaskFromAllLists(indexOfTodoToBeRemoved);

        console.log('all', toDoList.getInboxTaskList());
        console.log('today', toDoList.getTodayToDosList());
        console.log('week', toDoList.getWeekToDosList());

        makeDivsOnChange();
      });

      Object.values(toDoObject).forEach((value) => {
        console.log('dffdsfsgs');
        console.log(value);
        toDoContent.textContent += `  ${value}`;
        toDoElement.style.backgroundColor = taskPriorityColor;
        toDoElement.append(toDoContent, clearButton);
        toDoContainer.append(toDoElement);
      });
    });
  };

  const makeDivsOnChange = () => {
    if (previouslySelectedTab === 'Inbox') {
      makeAllDivs(toDoList.getInboxTaskList());
    } else if (previouslySelectedTab === 'Today') {
      makeAllDivs(toDoList.getTodayToDosList());
    } else {
      makeAllDivs(toDoList.getWeekToDosList());
    }
  };
  // return { createToDoElement: makeAllToDoListDivs };
})();
