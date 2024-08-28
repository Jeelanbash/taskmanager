// script.js
document.addEventListener('DOMContentLoaded', function() {
    const taskForm = document.getElementById('taskForm');
    const taskList = document.getElementById('taskList');
    const filterTasks = document.getElementById('filterTasks');
    const searchTasks = document.getElementById('searchTasks');

    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];

    function saveTasks() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }

    function renderTasks() {
        taskList.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            if (filterTasks.value === 'completed') return task.completed;
            if (filterTasks.value === 'incomplete') return !task.completed;
            return true;
        }).filter(task => {
            return task.title.toLowerCase().includes(searchTasks.value.toLowerCase()) ||
                   task.description.toLowerCase().includes(searchTasks.value.toLowerCase());
        });

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = 'task-item' + (task.completed ? ' completed' : '');
            li.innerHTML = `
                <div>
                    <strong>${task.title}</strong>
                    <p>${task.description}</p>
                    <small>Due: ${task.dueDate}</small>
                </div>
                <div class="task-actions">
                    <button onclick="editTask(${index})">Edit</button>
                    <button onclick="deleteTask(${index})">Delete</button>
                    <button onclick="toggleCompleted(${index})">${task.completed ? 'Unmark' : 'Complete'}</button>
                </div>
            `;
            taskList.appendChild(li);
        });
    }

    taskForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const newTask = {
            title: taskForm.taskTitle.value,
            description: taskForm.taskDescription.value,
            dueDate: taskForm.taskDueDate.value,
            completed: false
        };
        tasks.push(newTask);
        saveTasks();
        renderTasks();
        taskForm.reset();
    });

    filterTasks.addEventListener('change', renderTasks);
    searchTasks.addEventListener('input', renderTasks);

    window.editTask = function(index) {
        const task = tasks[index];
        taskForm.taskTitle.value = task.title;
        taskForm.taskDescription.value = task.description;
        taskForm.taskDueDate.value = task.dueDate;
        tasks.splice(index, 1);
        renderTasks();
    };

    window.deleteTask = function(index) {
        if (confirm('Are you sure you want to delete this task?')) {
            tasks.splice(index, 1);
            saveTasks();
            renderTasks();
        }
    };

    window.toggleCompleted = function(index) {
        tasks[index].completed = !tasks[index].completed;
        saveTasks();
        renderTasks();
    };

    renderTasks();
});
