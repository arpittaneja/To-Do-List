/* eslint-disable no-plusplus */
/* eslint-disable no-use-before-define */
import './style/style.css';
import { add, parse, formatISO, isEqual, isWithinInterval } from 'date-fns';

const createTask = (title, project, description, dueDate, priority) => {
  return {
    title,
    project,
    description,
    dueDate,
    priority,
  };
};

const lS = (() => {
  const addValue = (value) => {
    window.localStorage.setItem('toDoList', JSON.stringify(value));
  };

  const updateValue = (value) => {
    let val = localStorage.getItem('toDoList');
    val = JSON.stringify(value);
    localStorage.setItem('toDoList', val);
    console.log('updating value');
    console.log('current value', localStorage.getItem('toDoList'));
  };

  const getValue = (key) => {
    const val = localStorage.getItem(key);
    return JSON.parse(val);
  };

  // const getLocalStorage = () => localStorage;
  return { addValue, updateValue, getValue };
})();

const toDoList = (() => {
  const inboxTaskList = lS.getValue('toDoList') || [];

  console.log(inboxTaskList);
  let todayToDosList = [];
  let weekToDosList = [];
  const projectToDosList = [];

  const currentDate = new Date();
  const currentDateISO = formatISO(currentDate, { representation: 'date' });
  const weekAfterCurrentDate = add(currentDate, { days: 7 });
  const weekAfterCurrentDateISO = formatISO(weekAfterCurrentDate, {
    representation: 'date',
  });

  const getInboxTaskList = () => inboxTaskList;
  const getTodayToDosList = () => todayToDosList;
  const getWeekToDosList = () => weekToDosList;
  const getProjectToDosList = () => projectToDosList;

  const addTaskToToDoList = (taskObject) => {
    addTaskToInbox(taskObject);
    lS.addValue(inboxTaskList);
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
    inboxTaskList.splice(index, 1);
    lS.updateValue(inboxTaskList);
    updateTodayList();
    updateWeekList();
  };

  const updateTodayList = () => {
    todayToDosList = [];
    console.log('all', inboxTaskList);
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
  updateTodayList();
  updateWeekList();

  return {
    getInboxTaskList,
    getTodayToDosList,
    getWeekToDosList,
    getProjectToDosList,
    removeTaskFromAllLists: removeTaskFromInbox,
    removeTaskFromTodayList,
    updateTodayList,
    updateWeekList,
    addTaskToToDoList,
  };
})();

const displayController = (() => {
  const tabNameContainer = document.querySelector('.tab-selected-name');
  const navBarTabs = Array.from(document.querySelectorAll('li'));
  const addButton = document.querySelector('.add-btn');
  const formDiv = document.querySelector('.form-container');
  const formCloseButton = document.querySelector('.close-form');
  const form = document.querySelector('form');
  const toDoContainer = document.querySelector('.todo-container');
  let previouslySelectedTab = navBarTabs[0];
  const addNewProject = document.querySelector('.add-new-project');
  const addNewProjectInputTab = document.querySelector('.input-project');
  const addProjectButton = document.querySelector('.add-project-btn');
  const cancelProjectButton = document.querySelector('.cancel-project-btn');
  const projectInput = document.querySelector('.project-input');
  // const insertBeforeLi = document.querySelector('.insert-before-li');
  const projectsContainer = document.querySelector('.projects-container');

  addNewProject.addEventListener('click', (e) => {
    addNewProject.style.display = 'none';
    addNewProjectInputTab.style.display = 'block';
  });

  // create the project tab and add a plus button to it
  addProjectButton.addEventListener('click', (ev) => {
    const newProject = document.createElement('li');
    const addProjectTaskButton = document.createElement('button');
    addProjectTaskButton.textContent = '  +  ';
    const projectName = projectInput.value;
    newProject.classList.add('project-tab');

    newProject.addEventListener('click', (e) => {
      e.stopPropagation();
      console.log('tab ka hai', e.target.textContent);
    });

    const projectList = toDoList
      .getInboxTaskList()
      .filter((task) => task.project === projectName);
    makeAllDivs(projectList);
    newProject.textContent = projectName;
    // newProject.append(addProjectTaskButton);

    addProjectTaskButton.addEventListener('click', (e) => {
      e.stopPropagation();
      formDiv.style.display = 'block';
      document.querySelector('#project-name').value = projectName;
      // console.log('clicked saadha button bhirchulla');
    });

    newProject.addEventListener('click', onTabClick);

    projectsContainer.append(newProject, addProjectTaskButton);

    navBarTabs.push(newProject);

    selectTab(newProject);
    addNewProject.style.display = 'block';
    addNewProjectInputTab.style.display = 'none';
    projectInput.value = '';
  });

  const selectTab = (tab) => {
    console.log('selecting tab');
    console.log(tab);
    tab.classList.remove('unselected');
    tab.classList.add('selected');

    // logic to remove the selected class on remaning tabs
    navBarTabs.forEach((tb) => {
      if (tb !== tab) {
        tb.classList.remove('selected');
        tb.classList.add('unselected');
      }
    });
    console.log(tab);
    console.log(navBarTabs);
  };

  const onTabClick = (e) => {
    const currentlySelectedTab = e.target;

    // if a new different tab is clicked
    if (currentlySelectedTab !== previouslySelectedTab) {
      // select that tab
      selectTab(currentlySelectedTab);

      // change name of tabNameContainer
      tabNameContainer.textContent = currentlySelectedTab.textContent;

      // change the value of previouslySelectedTab to the newly selected tab
      previouslySelectedTab = currentlySelectedTab;
      console.log('different tab');
      makeDivsForNewlySelectedTab(currentlySelectedTab);
    }
  };

  navBarTabs.forEach((tab) => {
    tab.addEventListener('click', onTabClick);
  });

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const taskName = document.querySelector('#task-title').value;
    const taskDescription = document.querySelector('#task-desc').value;
    let projectName = document.querySelector('#project-name').value;
    const dueDate = document.querySelector('#due-date').value;
    const taskPriority = document.querySelector('#task-priority').checked;

    const task = createTask(
      taskName,
      projectName,
      taskDescription,
      dueDate,
      taskPriority
    );

    toDoList.addTaskToToDoList(task);

    // if the form is clicked from the main inbox tab
    if (projectName === 'None') {
      projectName = null;
      previouslySelectedTab = navBarTabs[0];
    } else {
      console.log('im here');
      // previouslySelectedTab = projectName;
      previouslySelectedTab = navBarTabs.filter(
        (tab) => tab.textContent === projectName
      )[0];
    }

    selectTab(previouslySelectedTab);
    makeDivsForNewlySelectedTab(previouslySelectedTab);
    form.reset();
    formDiv.style.display = 'none';
  });

  formCloseButton.addEventListener('click', () => {
    if (document.querySelector('#project-name').value !== '  None') {
      form.reset();
    }
    formDiv.style.display = 'none';
  });

  addButton.addEventListener('click', () => {
    formDiv.style.display = 'block';
  });

  const makeAllDivs = (list) => {
    console.log(list);
    toDoContainer.textContent = '';
    list.forEach((toDoObject) => {
      const toDoElement = document.createElement('div');
      const toDoContent = document.createElement('span');
      const clearButton = document.createElement('button');
      const taskPriorityColor = toDoObject.priority ? 'red' : 'green';
      clearButton.textContent = 'X';

      clearButton.addEventListener('click', (e) => {
        const indexOfTodoToBeRemoved = toDoList
          .getInboxTaskList()
          .indexOf(toDoObject);

        console.log('------------------------');
        console.log(toDoList.getInboxTaskList());
        console.log(toDoObject);
        console.log('------------------------');
        console.log('index', indexOfTodoToBeRemoved);
        console.log(toDoList.getInboxTaskList());
        toDoList.removeTaskFromAllLists(indexOfTodoToBeRemoved);
        console.log(toDoList.getInboxTaskList());
        lS.updateValue(toDoList.getInboxTaskList());
        console.log('all', toDoList.getInboxTaskList());
        console.log('today', toDoList.getTodayToDosList());
        console.log('week', toDoList.getWeekToDosList());

        console.log(
          'deleting elements from tab',
          navBarTabs.filter((tab) => tab.classList.contains('selected'))[0]
        );

        makeDivsForNewlySelectedTab(
          navBarTabs.filter((tab) => tab.classList.contains('selected'))[0]
        );
      });

      Object.values(toDoObject).forEach((value) => {
        console.log(value);
        toDoContent.textContent += `  ${value}`;
        toDoElement.style.backgroundColor = taskPriorityColor;
        toDoElement.append(toDoContent, clearButton);
        toDoContainer.append(toDoElement);
      });
    });
  };

  const makeDivsForNewlySelectedTab = (tab) => {
    if (tab === navBarTabs[0]) {
      makeAllDivs(toDoList.getInboxTaskList());
    } else if (tab === navBarTabs[1]) {
      makeAllDivs(toDoList.getTodayToDosList());
    } else if (tab === navBarTabs[2]) {
      makeAllDivs(toDoList.getWeekToDosList());
    } else {
      const projectTaskList = toDoList
        .getInboxTaskList()
        .filter((task) => task.project === tab.textContent);
      makeAllDivs(projectTaskList);
    }
  };
  return { makeAllDivs };
})();

// displayController.makeAllDivs(lS.getValue('toDoList'));
displayController.makeAllDivs(toDoList.getInboxTaskList());
