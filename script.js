class TodoList {
    constructor() {
        this.inputBox = document.getElementById("input-box");
        this.listContainer = document.getElementById("list-container");
        this.emptyState = document.getElementById("empty-state");
        this.setupEventListeners();
        this.loadTasks();
        this.updateEmptyState();
    }

    setupEventListeners() {
        this.listContainer.addEventListener("click", (e) => this.handleListClick(e));
    }

    handleListClick(e) {
        const item = e.target.closest('li');
        if (e.target.classList.contains('checkbox')) {
            this.toggleTask(item);
            this.playCompletionSound();
        } else if (e.target.classList.contains('delete-btn')) {
            this.deleteTask(item);
        }
    }

    playCompletionSound() {
        const audio = new Audio('https://www.soundjay.com/buttons/sounds/button-09.mp3');
        audio.volume = 0.2;
        audio.play().catch(e => console.log('Sound autoplay prevented'));
        
        const emoji = document.createElement('div');
        emoji.textContent = '✨';
        emoji.style.cssText = `
            position: fixed;
            font-size: 2rem;
            pointer-events: none;
            animation: floatUp 1s ease-out forwards;
        `;
        document.body.appendChild(emoji);
        
        setTimeout(() => emoji.remove(), 1000);
    }

    updateEmptyState() {
        const isEmpty = this.listContainer.children.length === 0;
        this.emptyState.classList.toggle('visible', isEmpty);
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
        deleteBtn.innerHTML = "❌";

        taskContent.appendChild(checkbox);
        taskContent.appendChild(taskTextSpan);
        li.appendChild(taskContent);
        li.appendChild(deleteBtn);
        
        this.listContainer.appendChild(li);
        this.saveData();
        this.updateEmptyState();
        return true;
    }

    deleteTask(taskElement) {
        taskElement.classList.add("fade-out");
        setTimeout(() => {
            taskElement.remove();
            this.saveData();
            this.updateEmptyState();
        }, 300);
    }

    toggleTask(taskElement) {
        taskElement.classList.toggle("checked");
        this.saveData();
    }

    saveData() {
        localStorage.setItem("todoData", this.listContainer.innerHTML);
    }

    loadTasks() {
        this.listContainer.innerHTML = localStorage.getItem("todoData") || "";
        this.updateEmptyState();
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