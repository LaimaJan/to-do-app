const inputField = document.getElementById('input-field');
const dateTime = document.getElementById('date-time');
const addButton = document.getElementById('submit-btn');
const toDoListDiv = document.querySelector('.to-do-list');
const recentlyAddedBtn = document.querySelector('.recently-added');
const deadlineBtn = document.querySelector('.deadline');
const recentlyCompletedBtn = document.querySelector('.recently-completed');

let listElements = [];
displayList();

let exampleToDoList = [
	{
		text: 'Wash the car',
		date: '2023-03-31T04:00',
		checked: false,
		id: 1679568476388,
	},
	{
		text: 'Fix the shed outside',
		date: '2023-03-29T08:00',
		checked: false,
		id: 1679568465355,
	},
	{
		text: 'Call family doctor',
		date: '2023-03-31T00:00',
		checked: true,
		id: 1679568445442,
	},
	{
		text: 'Drink vitamins',
		date: 0,
		checked: false,
		id: 1679568445442,
	},
	{
		text: 'Eat lunch',
		date: 0,
		checked: true,
		id: 1679568445442,
	},
];

function addTodo(text, date) {
	const todo = {
		text,
		date,
		checked: false,
		id: Date.now(),
	};

	listElements.unshift(todo);
}

addButton.addEventListener('click', () => {
	let inputFieldValue = inputField.value;
	let dateTimeValue = dateTime.value;

	if (inputFieldValue !== '') {
		if (dateTimeValue !== '') {
			let todoTimestamp = new Date(dateTimeValue).getTime();
			let currentTimestamp = new Date().getTime();

			//   logic for to-do list tasks date, it cannot be in the past
			if (todoTimestamp > currentTimestamp) {
				addTodo(inputFieldValue, dateTimeValue);
			} else {
				alert('Please select a date in the future');
			}
		} else {
			addTodo(inputFieldValue, 0);
		}
	} else {
		alert('Please fill in the task');
	}

	sessionStorage.setItem('toDoListElement', JSON.stringify(listElements));
	inputField.value = null;

	displayList();
});

//  prefilling sessionStorage with some data
if (sessionStorage.getItem('toDoListElement') === null) {
	sessionStorage.setItem('toDoListElement', JSON.stringify(exampleToDoList));
}

function displayList() {
	listElements = JSON.parse(sessionStorage.getItem('toDoListElement')) || [];

	let myToDoList = document.querySelector('ul');
	checkIfListExists(myToDoList);

	let ul = createElement('ul', 'to-do-list');

	for (let i = 0; i < listElements.length; i++) {
		let newElementDiv = createElement('div', 'task-holder');
		newElementDiv.setAttribute('data-key', listElements[i].id);

		let newElementTask = document.createElement('p');
		let text = document.createTextNode(listElements[i].text);

		let newElementDate = document.createElement('p');
		let date = document.createTextNode(timeToDate(listElements[i].date));

		//  Delete button creation and functionality
		let deleteBtn = createElement('button', 'delete-btn');
		deleteBtn.textContent = 'Delete';
		deleteButtonFunctionality(deleteBtn);

		//  Checkbox creation and functionality
		let checkbox = createElement('input', 'element-checkbox');
		checkbox.type = 'checkbox';

		if (listElements[i].checked) {
			newElementTask.classList.toggle(`work-done`);

			newElementDate.classList.toggle(`display-none`);
			checkbox.checked = true;
		}

		checkBoxFunctionality(checkbox, listElements, i);

		//  Appending elements
		newElementDiv.appendChild(newElementTask);
		newElementDiv.appendChild(newElementDate);
		newElementTask.appendChild(text);
		newElementDate.appendChild(date);

		newElementDiv.appendChild(deleteBtn);
		newElementDiv.appendChild(checkbox);
		ul.appendChild(newElementDiv);
	}

	toDoListDiv.appendChild(ul);
}

setInterval(displayList, 1000);

function checkIfListExists(myToDoList) {
	if (myToDoList !== null) {
		myToDoList.remove();
	}
}

function createElement(type, attribute) {
	let element = document.createElement(type);
	element.setAttribute('class', attribute);

	return element;
}

function deleteButtonFunctionality(deleteBtn) {
	deleteBtn.addEventListener('click', (event) => {
		let confirmDelete = confirm('Do you really want to delete the item?');
		if (confirmDelete) {
			const itemKey = event.target.parentElement.dataset.key;

			let newListElements = listElements.filter((element) => {
				let elementId = element.id.toString();
				if (elementId !== itemKey) {
					return element;
				}
			});

			sessionStorage.setItem(
				'toDoListElement',
				JSON.stringify(newListElements)
			);
			displayList();
		}
	});
}

function checkBoxFunctionality(checkbox, listElements, i) {
	checkbox.addEventListener('click', (event) => {
		listElements[i].checked = !listElements[i].checked;

		const itemKey = event.target.parentElement.dataset.key;
		let checkedElement = listElements.filter((element) => {
			let elementId = element.id.toString();
			if (elementId == itemKey) {
				return element;
			}
		});

		let uncheckedElements = listElements.filter((element) => {
			let elementId = element.id.toString();
			if (elementId !== itemKey) {
				return element;
			}
		});

		let checkedToEnd = [...uncheckedElements, ...checkedElement];

		sessionStorage.setItem('toDoListElement', JSON.stringify(checkedToEnd));
		displayList();
	});
}

function timeToDate(date) {
	let response = '';
	if (date !== 0) {
		let countDownDate = new Date(date).getTime();
		let now = new Date().getTime();
		let distance = countDownDate - now;
		let days = Math.floor(distance / (1000 * 60 * 60 * 24));
		let hours = Math.floor(
			(distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)
		);
		let minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));

		response = days + 'd ' + hours + 'h ' + minutes + 'm ';
	}
	return response;
}

recentlyAddedBtn.addEventListener('click', () => {
	let recentlyAdded = listElements.sort(function (a, b) {
		var c = new Date(a.id);
		var d = new Date(b.id);

		return d - c;
	});

	let checkedDateZero = recentlyAdded.filter(
		(element) => element.checked == true && element.date == 0
	);

	let notCheckedDateZero = recentlyAdded.filter(
		(element) => element.checked == false && element.date == 0
	);

	let checkedDateNotZero = recentlyAdded.filter(
		(element) => element.checked == true && element.date !== 0
	);

	let notCheckedDateNotZero = recentlyAdded.filter(
		(element) => element.checked == false && element.date !== 0
	);

	let x = [
		...notCheckedDateNotZero,
		...notCheckedDateZero,
		...checkedDateZero,
		...checkedDateNotZero,
	];

	sessionStorage.setItem('toDoListElement', JSON.stringify(x));
	displayList();
});

deadlineBtn.addEventListener('click', () => {
	let deadlineListElements = listElements.sort(function (a, b) {
		var c = new Date(a.date);
		var d = new Date(b.date);

		return c - d;
	});

	let checkedDateZero = deadlineListElements.filter(
		(element) => element.checked == true && element.date == 0
	);

	let notCheckedDateZero = deadlineListElements.filter(
		(element) => element.checked == false && element.date == 0
	);

	let checkedDateNotZero = deadlineListElements.filter(
		(element) => element.checked == true && element.date !== 0
	);

	let notCheckedDateNotZero = deadlineListElements.filter(
		(element) => element.checked == false && element.date !== 0
	);

	let x = [
		...notCheckedDateNotZero,
		...notCheckedDateZero,
		...checkedDateZero,
		...checkedDateNotZero,
	];

	sessionStorage.setItem('toDoListElement', JSON.stringify(x));
	displayList();
});

recentlyCompletedBtn.addEventListener('click', () => {
	let notDoneTasks = listElements.filter((element) => element.checked == false);
	let completedTasks = listElements.filter(
		(element) => element.checked == true
	);

	let recentlyCheckedTasks = completedTasks.sort(function (a, b) {
		var c = new Date(a.date);
		var d = new Date(b.date);

		return c - d;
	});

	let recentlyCompletedTasks = [...recentlyCheckedTasks, ...notDoneTasks];

	sessionStorage.setItem(
		'toDoListElement',
		JSON.stringify(recentlyCompletedTasks)
	);
	displayList();
});
