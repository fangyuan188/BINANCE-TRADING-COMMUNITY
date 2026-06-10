// ========================================
// PREMIUM TO-DO LIST APPLICATION
// ========================================

class TodoApp {
    constructor() {
        this.tasks = [];
        this.currentFilter = 'all';
        this.currentView = 'list';
        this.selectedPriorities = ['high', 'medium', 'low'];
        this.searchQuery = '';
        this.sortBy = 'date-desc';

        this.initializeElements();
        this.loadTasks();
        this.setupEventListeners();
        this.render();
    }

    // ========== INITIALIZATION ==========

    initializeElements() {
        // Sidebar
        this.categoryBtns = document.querySelectorAll('.category-btn');
        this.priorityCheckboxes = document.querySelectorAll('.priority-checkbox');
        this.exportBtn = document.getElementById('export-btn');
        this.importBtn = document.getElementById('import-btn');
        this.clearBtn = document.getElementById('clear-btn');

        // Controls
        this.searchInput = document.getElementById('search-input');
        this.clearSearchBtn = document.getElementById('clear-search-btn');
        this.sortSelect = document.getElementById('sort-select');
        this.viewBtns = document.querySelectorAll('.view-btn');

        // Add Task Form
        this.taskForm = document.getElementById('add-task-form');
        this.taskInput = document.getElementById('task-input');
        this.expandBtn = document.getElementById('expand-btn');
        this.extendedOptions = document.getElementById('extended-options');
        this.cancelBtn = document.getElementById('cancel-btn');
        this.priorityBtns = document.querySelectorAll('.priority-btn');
        this.categoryInput = document.getElementById('task-category');
        this.dueDateInput = document.getElementById('task-due-date');
        this.timeInput = document.getElementById('task-time');
        this.descriptionInput = document.getElementById('task-description');
        this.tagsInput = document.getElementById('task-tags');

        // Display
        this.tasksList = document.getElementById('tasks-list');
        this.emptyState = document.getElementById('empty-state');

        // Modal
        this.modal = document.getElementById('task-detail-modal');
        this.modalClose = document.getElementById('modal-close');
        this.modalBody = document.getElementById('modal-body');

        // File input
        this.fileInput = document.getElementById('import-file');

        // Stats
        this.countEls = {};
        ['all', 'today', 'important', 'completed'].forEach(cat => {
            this.countEls[cat] = document.getElementById(`count-${cat}`);
        });
        this.totalTasksEl = document.getElementById('total-tasks');
        this.completedTasksEl = document.getElementById('completed-tasks');
        this.progressPercentEl = document.getElementById('progress-percent');
    }

    setupEventListeners() {
        // Sidebar
        this.categoryBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.categoryBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentFilter = btn.dataset.category;
                this.render();
            });
        });

        this.priorityCheckboxes.forEach(cb => {
            cb.addEventListener('change', () => {
                this.selectedPriorities = Array.from(this.priorityCheckboxes)
                    .filter(cb => cb.checked)
                    .map(cb => cb.value);
                this.render();
            });
        });

        this.exportBtn.addEventListener('click', () => this.exportTasks());
        this.importBtn.addEventListener('click', () => this.fileInput.click());
        this.clearBtn.addEventListener('click', () => this.clearAllTasks());
        this.fileInput.addEventListener('change', (e) => this.importTasks(e));

        // Controls
        this.searchInput.addEventListener('input', (e) => {
            this.searchQuery = e.target.value;
            this.clearSearchBtn.style.display = this.searchQuery ? 'block' : 'none';
            this.render();
        });

        this.clearSearchBtn.addEventListener('click', () => {
            this.searchInput.value = '';
            this.searchQuery = '';
            this.clearSearchBtn.style.display = 'none';
            this.render();
        });

        this.sortSelect.addEventListener('change', (e) => {
            this.sortBy = e.target.value;
            this.render();
        });

        this.viewBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.viewBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                this.currentView = btn.dataset.view;
                this.render();
            });
        });

        // Add Task Form
        this.taskForm.addEventListener('submit', (e) => this.handleAddTask(e));
        this.expandBtn.addEventListener('click', () => this.toggleExtendedOptions());
        this.cancelBtn.addEventListener('click', () => this.resetForm());

        this.priorityBtns.forEach(btn => {
            btn.addEventListener('click', (e) => {
                e.preventDefault();
                this.priorityBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
            });
        });

        // Modal
        this.modalClose.addEventListener('click', () => this.closeModal());
        this.modal.addEventListener('click', (e) => {
            if (e.target === this.modal) this.closeModal();
        });
    }

    // ========== ADD TASK ==========

    toggleExtendedOptions() {
        const isHidden = this.extendedOptions.style.display === 'none';
        this.extendedOptions.style.display = isHidden ? 'block' : 'none';
        this.expandBtn.style.transform = isHidden ? 'rotate(180deg)' : '';
        this.cancelBtn.style.display = isHidden ? 'block' : 'none';
    }

    handleAddTask(e) {
        e.preventDefault();

        const title = this.taskInput.value.trim();
        if (!title) return;

        const activePriorityBtn = document.querySelector('.priority-btn.active');
        const priority = activePriorityBtn ? activePriorityBtn.dataset.priority : 'medium';

        const task = {
            id: Date.now(),
            title,
            category: this.categoryInput.value || 'General',
            priority,
            completed: false,
            important: false,
            dueDate: this.dueDateInput.value,
            time: this.timeInput.value,
            description: this.descriptionInput.value,
            tags: this.tagsInput.value.split(',').map(t => t.trim()).filter(t => t),
            createdAt: new Date().toISOString(),
            completedAt: null
        };

        this.tasks.unshift(task);
        this.saveTasks();
        this.resetForm();
        this.render();
    }

    resetForm() {
        this.taskForm.reset();
        this.extendedOptions.style.display = 'none';
        this.cancelBtn.style.display = 'none';
        this.expandBtn.style.transform = '';
        
        const mediumBtn = document.querySelector('.priority-btn[data-priority="medium"]');
        this.priorityBtns.forEach(b => b.classList.remove('active'));
        if (mediumBtn) mediumBtn.classList.add('active');
    }

    // ========== TASK ACTIONS ==========

    toggleTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.completed = !task.completed;
            if (task.completed) {
                task.completedAt = new Date().toISOString();
            }
            this.saveTasks();
            this.render();
        }
    }

    toggleImportant(id) {
        const task = this.tasks.find(t => t.id === id);
        if (task) {
            task.important = !task.important;
            this.saveTasks();
            this.render();
        }
    }

    deleteTask(id) {
        if (confirm('Are you sure you want to delete this task?')) {
            this.tasks = this.tasks.filter(t => t.id !== id);
            this.saveTasks();
            this.render();
        }
    }

    // ========== FILTERING & SORTING ==========

    getFilteredTasks() {
        let filtered = this.tasks;

        // Filter by category
        if (this.currentFilter === 'completed') {
            filtered = filtered.filter(t => t.completed);
        } else if (this.currentFilter === 'important') {
            filtered = filtered.filter(t => t.important);
        } else if (this.currentFilter === 'today') {
            const today = new Date().toISOString().split('T')[0];
            filtered = filtered.filter(t => t.dueDate === today);
        } else if (this.currentFilter !== 'all') {
            filtered = filtered.filter(t => t.category === this.currentFilter);
        }

        // Filter by priority
        filtered = filtered.filter(t => this.selectedPriorities.includes(t.priority));

        // Filter by search
        if (this.searchQuery) {
            const query = this.searchQuery.toLowerCase();
            filtered = filtered.filter(t => 
                t.title.toLowerCase().includes(query) ||
                t.description.toLowerCase().includes(query) ||
                t.tags.some(tag => tag.toLowerCase().includes(query))
            );
        }

        return filtered;
    }

    getSortedTasks(tasks) {
        const sorted = [...tasks];

        switch (this.sortBy) {
            case 'date-asc':
                sorted.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
                break;
            case 'priority':
                const priorityOrder = { high: 0, medium: 1, low: 2 };
                sorted.sort((a, b) => priorityOrder[a.priority] - priorityOrder[b.priority]);
                break;
            case 'name-asc':
                sorted.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'name-desc':
                sorted.sort((a, b) => b.title.localeCompare(a.title));
                break;
            case 'due-date':
                sorted.sort((a, b) => {
                    if (!a.dueDate) return 1;
                    if (!b.dueDate) return -1;
                    return new Date(a.dueDate) - new Date(b.dueDate);
                });
                break;
            case 'date-desc':
            default:
                sorted.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return sorted;
    }

    // ========== RENDERING ==========

    render() {
        this.updateStats();
        this.renderTasks();
    }

    updateStats() {
        const total = this.tasks.length;
        const completed = this.tasks.filter(t => t.completed).length;
        const today = new Date().toISOString().split('T')[0];
        const todayCount = this.tasks.filter(t => t.dueDate === today).length;
        const important = this.tasks.filter(t => t.important).length;
        const completedCount = this.tasks.filter(t => t.completed).length;

        this.totalTasksEl.textContent = total;
        this.completedTasksEl.textContent = completed;
        this.progressPercentEl.textContent = total === 0 ? '0%' : `${Math.round((completed / total) * 100)}%`;

        this.countEls.all.textContent = total;
        this.countEls.today.textContent = todayCount;
        this.countEls.important.textContent = important;
        this.countEls.completed.textContent = completedCount;
    }

    renderTasks() {
        const filtered = this.getFilteredTasks();
        const sorted = this.getSortedTasks(filtered);

        if (sorted.length === 0) {
            this.tasksList.innerHTML = '';
            this.emptyState.style.display = 'flex';
            return;
        }

        this.emptyState.style.display = 'none';
        this.tasksList.className = `tasks-list ${this.currentView === 'grid' ? 'grid-view' : ''}`;
        this.tasksList.innerHTML = sorted.map(task => this.createTaskElement(task)).join('');

        // Add event listeners to task elements
        this.tasksList.querySelectorAll('.task-item').forEach(el => {
            const checkbox = el.querySelector('.task-checkbox');
            const starBtn = el.querySelector('.task-action-btn.star');
            const editBtn = el.querySelector('.task-action-btn.edit');
            const deleteBtn = el.querySelector('.task-action-btn.delete');
            const taskId = parseInt(el.dataset.taskId);

            checkbox.addEventListener('change', () => this.toggleTask(taskId));
            starBtn.addEventListener('click', () => this.toggleImportant(taskId));
            editBtn.addEventListener('click', () => this.editTask(taskId));
            deleteBtn.addEventListener('click', () => this.deleteTask(taskId));
            el.addEventListener('click', (e) => {
                if (!['checkbox', 'button'].includes(e.target.className)) {
                    this.showTaskDetails(taskId);
                }
            });
        });
    }

    createTaskElement(task) {
        const completed = task.completed ? 'completed' : '';
        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : '';
        const important = task.important ? 'marked' : '';
        const tagsHtml = task.tags.length > 0 
            ? `<div class="task-tags">${task.tags.map(t => `<span class="task-tag">#${t}</span>`).join('')}</div>`
            : '';

        return `
            <div class="task-item ${completed} priority-${task.priority}" data-task-id="${task.id}">
                <input type="checkbox" class="task-checkbox" ${completed ? 'checked' : ''}>
                <div class="task-content">
                    <div class="task-header">
                        <span class="task-title">${this.escapeHtml(task.title)}</span>
                    </div>
                    <div class="task-meta">
                        ${task.category ? `<span class="task-meta-item"><i class="fas fa-folder"></i> ${this.escapeHtml(task.category)}</span>` : ''}
                        ${task.dueDate ? `<span class="task-meta-item"><i class="fas fa-calendar"></i> ${dueDate}</span>` : ''}
                        ${task.time ? `<span class="task-meta-item"><i class="fas fa-clock"></i> ${task.time}</span>` : ''}
                    </div>
                    ${tagsHtml}
                </div>
                <div class="task-actions">
                    <button class="task-action-btn star ${important}" title="Mark as important">
                        <i class="fas fa-star"></i>
                    </button>
                    <button class="task-action-btn edit" title="Edit task">
                        <i class="fas fa-edit"></i>
                    </button>
                    <button class="task-action-btn delete" title="Delete task">
                        <i class="fas fa-trash"></i>
                    </button>
                </div>
            </div>
        `;
    }

    escapeHtml(text) {
        const div = document.createElement('div');
        div.textContent = text;
        return div.innerHTML;
    }

    // ========== TASK DETAILS MODAL ==========

    showTaskDetails(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        const dueDate = task.dueDate ? new Date(task.dueDate).toLocaleDateString() : 'Not set';
        const createdAt = new Date(task.createdAt).toLocaleDateString();
        const tagsHtml = task.tags.length > 0 
            ? task.tags.map(t => `<span class="task-tag">#${this.escapeHtml(t)}</span>`).join('')
            : 'None';

        const priorityColors = {
            high: '🔴',
            medium: '🟡',
            low: '🟢'
        };

        this.modalBody.innerHTML = `
            <div style="display: grid; gap: 20px;">
                <div>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">${this.escapeHtml(task.title)}</h3>
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                        <div>
                            <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Priority</span>
                            <p style="margin-top: 5px; font-size: 14px; font-weight: 600;">${priorityColors[task.priority]} ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}</p>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Category</span>
                            <p style="margin-top: 5px; font-size: 14px;">${this.escapeHtml(task.category)}</p>
                        </div>
                        <div>
                            <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Status</span>
                            <p style="margin-top: 5px; font-size: 14px;">${task.completed ? '✅ Completed' : '⏳ Pending'}</p>
                        </div>
                    </div>
                </div>

                ${task.description ? `
                    <div>
                        <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Description</span>
                        <p style="margin-top: 10px; font-size: 14px; line-height: 1.6;">${this.escapeHtml(task.description)}</p>
                    </div>
                ` : ''}

                <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 15px;">
                    <div>
                        <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Due Date</span>
                        <p style="margin-top: 5px; font-size: 14px;">${dueDate}</p>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Time</span>
                        <p style="margin-top: 5px; font-size: 14px;">${task.time || 'Not set'}</p>
                    </div>
                    <div>
                        <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Created</span>
                        <p style="margin-top: 5px; font-size: 14px;">${createdAt}</p>
                    </div>
                </div>

                <div>
                    <span style="color: var(--text-secondary); font-size: 12px; font-weight: 600; text-transform: uppercase;">Tags</span>
                    <div style="margin-top: 10px; display: flex; gap: 8px; flex-wrap: wrap;">${tagsHtml}</div>
                </div>
            </div>
        `;

        this.modal.style.display = 'flex';
    }

    closeModal() {
        this.modal.style.display = 'none';
    }

    editTask(id) {
        const task = this.tasks.find(t => t.id === id);
        if (!task) return;

        this.taskInput.value = task.title;
        this.categoryInput.value = task.category;
        this.dueDateInput.value = task.dueDate;
        this.timeInput.value = task.time;
        this.descriptionInput.value = task.description;
        this.tagsInput.value = task.tags.join(', ');

        const priorityBtn = document.querySelector(`.priority-btn[data-priority="${task.priority}"]`);
        this.priorityBtns.forEach(b => b.classList.remove('active'));
        if (priorityBtn) priorityBtn.classList.add('active');

        this.extendedOptions.style.display = 'block';
        this.expandBtn.style.transform = 'rotate(180deg)';
        this.cancelBtn.style.display = 'block';
        this.taskInput.focus();

        this.deleteTask(id);
    }

    // ========== IMPORT/EXPORT ==========

    exportTasks() {
        const dataStr = JSON.stringify(this.tasks, null, 2);
        const dataBlob = new Blob([dataStr], { type: 'application/json' });
        const url = URL.createObjectURL(dataBlob);
        const link = document.createElement('a');
        link.href = url;
        link.download = `tasks-${new Date().toISOString().split('T')[0]}.json`;
        link.click();
        URL.revokeObjectURL(url);
    }

    importTasks(e) {
        const file = e.target.files[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            try {
                const imported = JSON.parse(event.target.result);
                if (Array.isArray(imported)) {
                    this.tasks = [...this.tasks, ...imported];
                    this.saveTasks();
                    this.render();
                    alert(`✅ ${imported.length} tasks imported successfully!`);
                } else {
                    alert('❌ Invalid file format. Please select a valid tasks.json file.');
                }
            } catch (err) {
                alert('❌ Error importing tasks. Please check the file format.');
            }
        };
        reader.readAsText(file);
        this.fileInput.value = '';
    }

    clearAllTasks() {
        if (confirm('⚠️ This will delete ALL tasks. Are you sure?')) {
            this.tasks = [];
            this.saveTasks();
            this.render();
        }
    }

    // ========== LOCAL STORAGE ==========

    saveTasks() {
        localStorage.setItem('todoAppTasks', JSON.stringify(this.tasks));
    }

    loadTasks() {
        const saved = localStorage.getItem('todoAppTasks');
        this.tasks = saved ? JSON.parse(saved) : [];
    }
}

// Initialize the app when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        new TodoApp();
    });
} else {
    new TodoApp();
}
