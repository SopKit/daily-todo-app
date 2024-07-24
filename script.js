document.addEventListener('DOMContentLoaded', () => {
    const input = document.getElementById('todo-input');
    const addBtn = document.getElementById('add-btn');
    const todoList = document.getElementById('todo-list');
    const completedList = document.getElementById('completed-list');
    const resetBtn = document.getElementById('reset-btn');
    const progressBar = document.getElementById('progress-bar');
    const progress = document.getElementById('progress');

    let todos = JSON.parse(localStorage.getItem('todos')) || [];

    const saveTodos = () => {
        localStorage.setItem('todos', JSON.stringify(todos));
    };

    const updateProgressBar = () => {
        const total = todos.length;
        const completed = todos.filter(todo => todo.checked).length;
        const percentage = total === 0 ? 0 : (completed / total) * 100;
        progress.style.width = `${percentage}%`;
    };

    const renderTodos = () => {
        todoList.innerHTML = '';
        completedList.innerHTML = '';
        todos.forEach((todo, index) => {
            const tr = document.createElement('tr');
            tr.classList.add('todo-item');
            tr.draggable = true;

            if (todo.checked) {
                tr.classList.add('checked');
            }

            const tdText = document.createElement('td');
            tdText.textContent = todo.text;
            tdText.addEventListener('click', () => {
                todo.checked = !todo.checked;
                saveTodos();
                renderTodos();
                updateProgressBar();
            });

            const tdAction = document.createElement('td');

            const checkbox = document.createElement('input');
            checkbox.type = 'checkbox';
            checkbox.checked = todo.checked;
            checkbox.addEventListener('change', () => {
                todo.checked = !todo.checked;
                saveTodos();
                renderTodos();
                updateProgressBar();
            });

            const deleteBtn = document.createElement('span');
            deleteBtn.textContent = 'X';
            deleteBtn.addEventListener('click', () => {
                todos.splice(index, 1);
                saveTodos();
                renderTodos();
                updateProgressBar();
            });

            const handle = document.createElement('span');
            handle.textContent = '⇅';
            handle.classList.add('drag-handle');

            tr.appendChild(tdText);
            tr.appendChild(tdAction);
            tdAction.appendChild(checkbox);
            tdAction.appendChild(handle);
            tdAction.appendChild(deleteBtn);

            if (todo.checked) {
                completedList.appendChild(tr);
            } else {
                todoList.appendChild(tr);
            }

            tr.addEventListener('dragstart', (e) => {
                e.dataTransfer.setData('text/plain', index);
                tr.classList.add('dragging');
            });

            tr.addEventListener('dragend', () => {
                tr.classList.remove('dragging');
            });
        });
    };

    addBtn.addEventListener('click', () => {
        const todoText = input.value.trim();
        if (todoText) {
            todos.push({ text: todoText, checked: false });
            saveTodos();
            renderTodos();
            updateProgressBar();
            input.value = '';
        }
    });

    input.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            addBtn.click();
        }
    });

    resetBtn.addEventListener('click', () => {
        todos.forEach(todo => todo.checked = false);
        saveTodos();
        renderTodos();
        updateProgressBar();
    });

    todoList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const siblings = [...todoList.querySelectorAll('.todo-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
        todoList.insertBefore(draggingItem, nextSibling);
    });

    completedList.addEventListener('dragover', (e) => {
        e.preventDefault();
        const draggingItem = document.querySelector('.dragging');
        const siblings = [...completedList.querySelectorAll('.todo-item:not(.dragging)')];
        const nextSibling = siblings.find(sibling => e.clientY <= sibling.offsetTop + sibling.offsetHeight / 2);
        completedList.insertBefore(draggingItem, nextSibling);
    });

    todoList.addEventListener('dragend', () => {
        const reorderedTodos = [...todoList.querySelectorAll('.todo-item')].map(tr => {
            const text = tr.querySelector('td').textContent;
            const checked = tr.querySelector('input').checked;
            return { text, checked };
        });
        const completedTodos = [...completedList.querySelectorAll('.todo-item')].map(tr => {
            const text = tr.querySelector('td').textContent;
            const checked = tr.querySelector('input').checked;
            return {
            text, checked };
        });
        todos = reorderedTodos.concat(completedTodos);
        saveTodos();
        updateProgressBar();
    });

    completedList.addEventListener('dragend', () => {
        const reorderedTodos = [...todoList.querySelectorAll('.todo-item')].map(tr => {
            const text = tr.querySelector('td').textContent;
            const checked = tr.querySelector('input').checked;
            return { text, checked };
        });
        const completedTodos = [...completedList.querySelectorAll('.todo-item')].map(tr => {
            const text = tr.querySelector('td').textContent;
            const checked = tr.querySelector('input').checked;
            return { text, checked };
        });
        todos = reorderedTodos.concat(completedTodos);
        saveTodos();
        updateProgressBar();
    });

    renderTodos();
    updateProgressBar();
});
