const form = document.getElementById('myform');
form.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());
    // console.log(data);
    fetch('/api/tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    }).then((res) => {
        if (res.status === 201) {
            window.location.reload();
        }
        else {
            console.log("Could not add task");
        }
    })
});

fetch('/api/tasks/', { method: 'GET' })
    .then(response => response.json())
    .then((data) => {
        function makeEditable(element) {
            element.contentEditable = true;
            element.focus();
        }

        const tasks = document.querySelector('.tasks');
        data.reverse().forEach(task => {
            const taskItem = document.createElement('div');
            if (task.taskDescription == null) {
                task.taskDescription = "";
            }
            taskItem.classList.add('task');
            taskItem.innerHTML = `
                <h3 class="taskTitle">${task.taskTitle}</h3>
                <p class="taskDescription">${task.taskDescription}</p>
                <button class="update-btn" id="${task.id}">Update</button>
                <button class="delete-btn" id="${task.id}">Delete</button>
            `;
            tasks.appendChild(taskItem);

            const deleteBtn = taskItem.querySelector('.delete-btn');
            const updateBtn = taskItem.querySelector('.update-btn');
            deleteBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const deleteId = deleteBtn.id;
                // console.log(deleteId);
                fetch(`/api/tasks/${deleteId}`, {
                    method: "delete",
                    headers: {
                        'Content-Type': 'application/json'
                    }
                }).then(() => {
                    window.location.reload();
                })
            });

            updateBtn.addEventListener('click', (e) => {
                e.preventDefault();
                const updateId = updateBtn.id;
                const title = taskItem.querySelector('.taskTitle');
                const description = taskItem.querySelector('.taskDescription');
                // console.log("desc:",description.innerText==="");
                // console.log("hi");
                if (title.isContentEditable) {
                    // console.log(description.innerText);
                    if (description.innerText == "") {
                        description.innerText = " ";
                    }
                    // console.log(description.innerText);
                    const updatedTask = {
                        taskTitle: title.innerText,
                        taskDescription: description.innerText
                    };

                    fetch(`/api/tasks/${updateId}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        body: JSON.stringify(updatedTask)
                    })
                        .then(response => {
                            if (!response.ok) {
                                throw new Error('Failed to update task');
                            }
                            console.log('Task updated successfully');
                            title.contentEditable = false;
                            description.contentEditable = false;
                        })
                        .catch(error => {
                            console.error(error);
                        });
                }
                else {
                    makeEditable(title);
                    makeEditable(description);
                    title.focus();
                }
            });
        });
    });
