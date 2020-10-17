document.addEventListener('DOMContentLoaded', () => {

    // Add an event listener to the form upon loading
    document.querySelector('[data-new-list-form]').addEventListener('submit', addCategory);
    document.querySelector('[data-new-task-form]').addEventListener('submit', addTask);

    // Load the categories
    showCategories();
});

/**
 * Displays all the categories in the DOM
 */
function showCategories() {

    // Empty the inner HTML of the parent container every reload
    document.querySelector('.categories-list').innerHTML = '';

    fetch('/api/category-list/')
    .then(response => response.json())
    .then(categories => {
        console.log(categories)
        categories.forEach(category => {

            // Clear category input
            document.querySelector('#create-category-input').value = '';

            // Create new list item
            const element = document.createElement('li');
            element.innerText = category.name;

            // Set list item attributes
            element.setAttribute("id", `category-${category.id}`);
            element.setAttribute("class", "category");

            // Add an event listener to each list item
            element.addEventListener('click', () => {
                setCategoryActive(element);
                showTasks(category);
            });

            // Append to parent element
            document.querySelector('.categories-list').append(element);
        });
    });
}

/**
 * Add a category
 * @param {Object} event An event object
 */
function addCategory(event) {
    event.preventDefault();

    // Check if input is null or blank
    const input = document.querySelector('#create-category-input');
    if (input.value === null || input.value === '') {
        return false;
    }

    fetch('/api/create-category/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            name: document.querySelector('#create-category-input').value
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
        showCategories();
    });
}

/**
 * Show the tasks of a category
 * @param {Object} category An object that contains the category's details
 */
function showTasks(category) {

    // Empty the inner HTML of the parent container
    document.querySelector('.tasks-body').innerHTML = '';

    // Clear the task input field every reload
    document.querySelector('#create-task-input').value = '';

    // Set task div to appear
    const tasks = document.querySelector('.tasks');
    if (window.getComputedStyle(tasks).display === 'none') {
        document.querySelector('#no-selected').style.display = 'none';
        tasks.style.display = 'block';
    }

    // Set the header title
    document.querySelector('.tasks-title').innerText = category.name;

    fetch(`/api/category-tasks-list/${category.id}`)
    .then(response => response.json())
    .then(tasks => {
        console.log(tasks);

        // Show the number of active tasks remaining
        const activeTasks = tasks.filter(task => task.is_done == false).length;
        document.querySelector('.tasks-items').innerText = activeTasks > 1 ? `${activeTasks} tasks remaining` : `${activeTasks} task remaining`;

        tasks.forEach(task => {

            // Create the necessary elements
            const taskDiv = document.createElement('div');
            const input = document.createElement('input');
            const label = document.createElement('label');
            const customCB = document.createElement('span');

            // Toggle the checkbox if the task is done
            if (task.is_done == true) {
                input.checked = true;
            }

            // Set corresponding attributes
            taskDiv.setAttribute('class', 'task');
            input.setAttribute('type', 'checkbox');
            input.setAttribute('id', `task-${task.id}`);
            label.setAttribute('for', `task-${task.id}`);
            customCB.setAttribute('class', 'custom-checkbox');

            // Set the elements' order
            taskDiv.append(input);
            taskDiv.append(label);
            label.append(customCB);
            label.append(task.name);

            // Append to parent element
            document.querySelector('.tasks-body').append(taskDiv);

            // Toggle task as done or not
            label.addEventListener('click', () => { toggleTask(task); });
        });
    });
}

/**
 * Set the clicked category as active
 * @param {Object} listItem The HTML Element to be set as active
 */
function setCategoryActive(listItem) {

    // Get all list items with the 'active' class
    const current = document.getElementsByClassName('active');

    // If there is an 'active' class, remove it
    if (current.length > 0) {
        current[0].className = current[0].className.replace(' active', '');
    }

    // Give the current list item and 'active' class
    listItem.className += ' active';
}

/**
 * Get the ID of the active Category
 * @return {Number} ID of the active category
 */
function getActiveCategory() {

    // Get the HTML element which is "active"
    const category = document.getElementsByClassName('active')[0];

    // Get the last character of the ID
    const categoryID = category.id.substr(category.id.length - 1);

    return categoryID;
}

/**
 * Add a task to a specific category
 * @param {Object} event An event object
 */
function addTask(event) {
    event.preventDefault();

    // Check if input is null or blank
    const input = document.querySelector('#create-task-input');
    if (input.value === null || input.value === '') {
        return false;
    }

    // Get the last character of the ID
    const categoryID = getActiveCategory();

    // Create the task to the corresponding category
    fetch('/api/create-task/', {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            name: document.querySelector('#create-task-input').value,
            category: categoryID
        })
    });

    // Get the category's details using the acquired category ID
    // then show the tasks of that category
    fetch(`/api/category-details/${categoryID}`)
    .then(response => response.json())
    .then(category => {
        showTasks(category);
    });
}

/**
 * Toggle the task as complete/incomplete
 * @param {Object} task An object containing the task's details
 */
function toggleTask(task) {
    fetch(`/api/toggle-task/${task.id}`, {
        method: 'POST',
        headers: {
            'Content-type': 'application/json',
            'X-CSRFToken': getCookie('csrftoken')
        },
        body: JSON.stringify({
            name: task.name,
            category: task.category,
            is_done: !task.is_done
        })
    })
    .then(response => response.json())
    .then(result => {
        console.log(result);
    });
}

/**
 * Gets the CSRF token
 * @param  {String} name        Name of the cookie to get
 * @return {String} Value of the cookie
 */
function getCookie(name) {
    let cookieValue = null;
    if (document.cookie && document.cookie !== '') {
        const cookies = document.cookie.split(';');
        for (let i = 0; i < cookies.length; i++) {
            const cookie = cookies[i].trim();
            // Does this cookie string begin with the name we want?
            if (cookie.substring(0, name.length + 1) === (name + '=')) {
                cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                break;
            }
        }
    }
    return cookieValue;
}

// TODO: Clear completed tasks
// TODO: Delete category
