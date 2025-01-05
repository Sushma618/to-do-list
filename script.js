class TodoList {
    constructor() {
        this.inputBox = document.getElementById("input-box");
        this.listContainer = document.getElementById("list-container");
        this.tasksCount = document.getElementById("tasks-count");
        this.completedCount = document.getElementById("completed-count");
        this.currentFilter = 'all';
        this.currentSort = 'newest';
        this.setupEventListeners();
        this.loadTasks();
        this.updateStats();
    }

    setupEventListeners() {
        this.listContainer.addEventListener("click", (e) => this.handleListClick(e));
        
        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');
                this.currentFilter = e.target.dataset.filter;
                this.filterTasks();
            });
        });

        // Sort select
        document.getElementById('sort-tasks').addEventListener('change', (e) => {
            this.currentSort = e.target.value;
            this.sortTasks();
        });

        // Clear buttons
        document.getElementById('clear-completed').addEventListener('click', () => this.clearCompleted());
        document.getElementById('clear-all').addEventListener('click', () => this.clearAll());
    }

    handleListClick(e) {
        if (e.target.tagName === "LI") {
            e.target.classList.toggle("checked");
            this.saveData();
        } else if (e.target.tagName === "SPAN") {
            this.deleteTask(e.target.parentElement);
        }
    }

    addTask(taskText, dueDate, priority) {
        try {
            if (!taskText.trim()) {
                throw new Error("Please enter a task!");
            }

            const li = document.createElement("li");
            li.dataset.createdAt = new Date().toISOString();
            li.dataset.priority = priority;
            
            const taskContent = document.createElement("div");
            taskContent.className = "task-content";
            
            const taskTitle = document.createElement("span");
            taskTitle.className = "task-title";
            taskTitle.textContent = taskText;
            
            const taskMeta = document.createElement("div");
            taskMeta.className = "task-meta";
            
            if (dueDate) {
                const dueDateSpan = document.createElement("span");
                dueDateSpan.className = "due-date";
                dueDateSpan.textContent = new Date(dueDate).toLocaleDateString();
                taskMeta.appendChild(dueDateSpan);
            }
            
            const priorityBadge = document.createElement("span");
            priorityBadge.className = `priority-badge ${priority}`;
            priorityBadge.textContent = priority;
            taskMeta.appendChild(priorityBadge);
            
            taskContent.appendChild(taskTitle);
            taskContent.appendChild(taskMeta);
            li.appendChild(taskContent);
            
            const deleteBtn = document.createElement("span");
            deleteBtn.className = "delete-btn";
            deleteBtn.innerHTML = "\u00d7";
            li.appendChild(deleteBtn);
            
            this.listContainer.appendChild(li);
            this.saveData();
            this.updateStats();
            return true;
        } catch (error) {
            alert(error.message);
            return false;
        }
    }

    filterTasks() {
        const tasks = this.listContainer.querySelectorAll('li');
        tasks.forEach(task => {
            switch(this.currentFilter) {
                case 'active':
                    task.style.display = task.classList.contains('checked') ? 'none' : '';
                    break;
                case 'completed':
                    task.style.display = task.classList.contains('checked') ? '' : 'none';
                    break;
                default:
                    task.style.display = '';
            }
        });
    }

    sortTasks() {
        const tasks = Array.from(this.listContainer.querySelectorAll('li'));
        tasks.sort((a, b) => {
            switch(this.currentSort) {
                case 'oldest':
                    return new Date(a.dataset.createdAt) - new Date(b.dataset.createdAt);
                case 'az':
                    return a.querySelector('.task-title').textContent.localeCompare(b.querySelector('.task-title').textContent);
                case 'za':
                    return b.querySelector('.task-title').textContent.localeCompare(a.querySelector('.task-title').textContent);
                default: // newest
                    return new Date(b.dataset.createdAt) - new Date(a.dataset.createdAt);
            }
        });
        
        tasks.forEach(task => this.listContainer.appendChild(task));
    }

    clearCompleted() {
        const completed = this.listContainer.querySelectorAll('li.checked');
        completed.forEach(task => this.deleteTask(task));
    }

    clearAll() {
        if (confirm('Are you sure you want to clear all tasks?')) {
            this.listContainer.innerHTML = '';
            this.saveData();
            this.updateStats();
        }
    }

    updateStats() {
        const total = this.listContainer.querySelectorAll('li').length;
        const completed = this.listContainer.querySelectorAll('li.checked').length;
        
        this.tasksCount.textContent = `${total} task${total !== 1 ? 's' : ''}`;
        this.completedCount.textContent = `${completed} completed`;
    }

    deleteTask(taskElement) {
        taskElement.classList.add("fade-out");
        setTimeout(() => {
            taskElement.remove();
            this.saveData();
        }, 300);
    }

    saveData() {
        localStorage.setItem("todoTasks", this.listContainer.innerHTML);
    }

    loadTasks() {
        this.listContainer.innerHTML = localStorage.getItem("todoTasks") || "";
    }
}

// Initialize the app
const todoApp = new TodoList();

// Handle form submission
function handleSubmit(event) {
    event.preventDefault();
    const taskText = document.getElementById("input-box").value;
    const dueDate = document.getElementById("due-date").value;
    const priority = document.getElementById("priority").value;
    
    if (todoApp.addTask(taskText, dueDate, priority)) {
        event.target.reset();
    }
} 