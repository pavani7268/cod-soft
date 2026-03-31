document.addEventListener('DOMContentLoaded', () => {
    const taskForm = document.getElementById('task-form');
    const taskContentInput = document.getElementById('task-content');
    const taskPriorityInput = document.getElementById('task-priority');
    const taskList = document.getElementById('task-list');
    const filterBtns = document.querySelectorAll('.filter-btn');
    const remainingCount = document.getElementById('remaining-count');
    const clearCompletedBtn = document.getElementById('clear-completed');
    const loadingIndicator = document.getElementById('loading-indicator');

    let tasks = [];
    let currentFilter = 'all';

    // Initial Fetch
    fetchTasks();

    // Fetch Tasks
    async function fetchTasks() {
        showLoading(true);
        try {
            const response = await fetch('/api/tasks');
            tasks = await response.json();
            renderTasks();
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            showLoading(false);
        }
    }

    // Render Tasks
    function renderTasks() {
        taskList.innerHTML = '';
        
        let filteredTasks = tasks;
        if (currentFilter === 'pending') filteredTasks = tasks.filter(t => !t.completed);
        if (currentFilter === 'completed') filteredTasks = tasks.filter(t => t.completed);

        filteredTasks.forEach((task, index) => {
            const li = document.createElement('li');
            li.className = `task-item ${task.completed ? 'completed' : ''}`;
            li.style.animationDelay = `${index * 0.05}s`;
            
            li.innerHTML = `
                <div class="task-checkbox ${task.completed ? 'completed' : ''}" onclick="toggleTask(${task.id}, ${task.completed})">
                    ${task.completed ? '✓' : ''}
                </div>
                <div class="task-text">${task.content}</div>
                <div class="task-priority-tag priority-${task.priority}">${task.priority}</div>
                <button class="delete-btn" onclick="deleteTask(${task.id})">×</button>
            `;
            
            taskList.appendChild(li);
        });

        // Update Stats
        const remaining = tasks.filter(t => !t.completed).length;
        remainingCount.textContent = remaining;
    }

    // Add Task
    taskForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        const content = taskContentInput.value.trim();
        const priority = taskPriorityInput.value;

        if (!content) return;

        showLoading(true);
        try {
            const response = await fetch('/api/tasks', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ content, priority })
            });
            const newTask = await response.json();
            tasks.unshift(newTask);
            taskContentInput.value = '';
            renderTasks();
            
            // Subtle animation feedback
            taskContentInput.blur();
        } catch (error) {
            console.error('Error adding task:', error);
        } finally {
            showLoading(false);
        }
    });

    // Toggle Task
    window.toggleTask = async (id, currentStatus) => {
        showLoading(true);
        try {
            const response = await fetch(`/api/tasks/${id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ completed: !currentStatus })
            });
            const updatedTask = await response.json();
            tasks = tasks.map(t => t.id === id ? updatedTask : t);
            renderTasks();
        } catch (error) {
            console.error('Error updating task:', error);
        } finally {
            showLoading(false);
        }
    };

    // Delete Task
    window.deleteTask = async (id) => {
        if (!confirm('Are you sure you want to delete this task?')) return;
        
        showLoading(true);
        try {
            await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
            tasks = tasks.filter(t => t.id !== id);
            renderTasks();
        } catch (error) {
            console.error('Error deleting task:', error);
        } finally {
            showLoading(false);
        }
    };

    // Filters
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentFilter = btn.dataset.filter;
            renderTasks();
        });
    });

    // Clear Completed
    clearCompletedBtn.addEventListener('click', async () => {
        const completedTasks = tasks.filter(t => t.completed);
        if (completedTasks.length === 0) return;
        
        if (!confirm('Clear all completed tasks?')) return;

        showLoading(true);
        try {
            for (const task of completedTasks) {
                await fetch(`/api/tasks/${task.id}`, { method: 'DELETE' });
            }
            tasks = tasks.filter(t => !t.completed);
            renderTasks();
        } catch (error) {
            console.error('Error clearing tasks:', error);
        } finally {
            showLoading(false);
        }
    });

    function showLoading(show) {
        if (show) {
            loadingIndicator.classList.remove('hidden');
        } else {
            loadingIndicator.classList.add('hidden');
        }
    }
});
