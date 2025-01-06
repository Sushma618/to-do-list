class TodoList {
    constructor() {
        this.inputBox = document.getElementById("input-box");
        this.listContainer = document.getElementById("list-container");
        this.setupEventListeners();
        this.loadTasks();
    }

    setupEventListeners() {
        this.listContainer.addEventListener("click", (e) => this.handleListClick(e));
    }

    handleListClick(e) {
        const item = e.target.closest('li');
        if (e.target.classList.contains('checkbox')) {
            this.toggleTask(item);
        } else if (e.target.classList.contains('delete-btn')) {
            this.deleteTask(item);
        }
    }

    toggleTask(taskElement) {
        taskElement.classList.toggle("checked");
        this.saveData();
    }

    addTask(taskText) {
        if (!taskText.trim()) {
            alert("Please enter a task!");
            return false;
        }

        const li = document.createElement("li");
        
        const taskContent = document.createElement("div");
        taskContent.className = "task-content";
        
        const checkbox = document.createElement("div");
        checkbox.className = "checkbox";
        
        const taskTextSpan = document.createElement("span");
        taskTextSpan.className = "task-text";
        taskTextSpan.textContent = taskText;
        
        const deleteBtn = document.createElement("span");
        deleteBtn.className = "delete-btn";
        deleteBtn.innerHTML = "×";

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextSpan);
        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        
        this.listContainer.appendChild(li);
        this.saveData();
        return true;
    }

    deleteTask(taskElement) {
        taskElement.classList.add("fade-out");
        setTimeout(() => {
            taskElement.remove();
            this.saveData();
        }, 300);
    }

    saveData() {
        localStorage.setItem("todoData", this.listContainer.innerHTML);
    }

    loadTasks() {
        this.listContainer.innerHTML = localStorage.getItem("todoData") || "";
    }
}

const todoApp = new TodoList();

function handleSubmit(event) {
    event.preventDefault();
    const taskText = document.getElementById("input-box").value;
    if (todoApp.addTask(taskText)) {
        event.target.reset();
    }
} 