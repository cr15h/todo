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
    }).then((res) => {``
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

        const tableBody = document.querySelector('#taskTable');
        data.reverse().forEach(task => {
            const row = document.createElement('tr');
            if (task.taskDescription == null) {
                task.taskDescription = "";
            }
            row.innerHTML = `
            <td>${task.taskTitle}</td>
            
            <td>${task.taskDescription}</td>
            <td>
                <button class="update-btn" id="${task.id}">Update</button>
                <button class="delete-btn" id="${task.id}">Delete</button>
            </td>
        `;
            tableBody.appendChild(row);

            const deleteBtn = row.querySelector('.delete-btn');
            const updateBtn = row.querySelector('.update-btn');
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
                const title = row.querySelector('td:nth-child(1)');
                const description = row.querySelector('td:nth-child(2)');
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
