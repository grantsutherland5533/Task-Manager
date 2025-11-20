const addtaskbtn = document.getElementById('addTask')
const taskcontainer = document.getElementById('taskSpace')
const input = document.getElementById('inputTask')


//load tasks
window.addEventListener('DOMContentLoaded',async()=>{
    fetch('/tasks-json').then(res=>res.json()).then(data=>{
        data.reverse().forEach((task, index)=> createTaskElement(task,index))
    })
    
    const res = await fetch('/color')
    const data = await res.json()
    document.body.style.backgroundColor = data.color


})
//Handle clicking add task button
addtaskbtn.addEventListener('click', async ()=>{
    if(input.value !== ''){
        const response = await fetch('/add', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({title: input.value})
        })
        const task = await response.json()
        createTaskElement(task, taskcontainer.children.length)
        if(input.value == '1/13/2007'){
            await set_color('#ffb6c1')
        }
        if(input.value == '-1/13/2007'){
            await set_color('black')
        }
        
        input.value = ''
        
    }
})
//Handle enter case
input.addEventListener('keydown', (event)=>{
    if (event.key == 'Enter'){
        event.preventDefault()
        addtaskbtn.click()
    }
})

// task building function
function createTaskElement(task, index){
    const newTask = document.createElement('li')
    const text = document.createElement('span')
    const check = document.createElement('input')
    const trash = document.createElement('span')
    newTask.dataset.id = task.id
    const taskId = newTask.dataset.id
    
    
    trash.className = 'trash-icon'
    trash.textContent = "🗑️"

    
    check.className = 'check'
    check.type = 'checkbox'


    if (task.completed){
        newTask.classList.add('completed')
        check.checked = true

    } 
        
    
    text.textContent = task.title
    text.className = 'task-text'

    newTask.appendChild(check)

    newTask.appendChild(text)
    newTask.appendChild(trash)

    newTask.draggable=true

    taskcontainer.prepend(newTask)

    check.addEventListener('change', async()=>{
        newTask.classList.toggle('completed')
        await fetch('/update',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: taskId, completed: check.checked})
        })

    })

    trash.addEventListener("click",async()=>{
        await fetch('/delete',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({id: taskId})
        })
        newTask.remove()
    })

    newTask.addEventListener('dragstart', async()=>{
        newTask.classList.add('dragging')
        document.body.style.cursor = 'grabbing'
    })
   
    newTask.addEventListener('dragend', async()=>{
      
        newTask.classList.remove('dragging')
        document.body.style.cursor = 'default'
        const taskorder = Array.from(taskcontainer.children).map(li=> li.dataset.id)
            await fetch('/reorder',{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({order:taskorder})
            })
    })
  


}

  async function set_color(newColor){
        document.body.style.backgroundColor = newColor
        await fetch('/color', {
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({color: newColor})
        })

    }


 taskcontainer.addEventListener('dragover', async(e)=>{
          e.preventDefault()
            const ypos = e.clientY
            
            for(var i = 0;i<taskcontainer.children.length;i += 1){
                const li = taskcontainer.children[i]
                const box = li.getBoundingClientRect()
                const dragging = document.querySelector('.dragging')
                if (ypos<=box.top+box.height/2){
                    taskcontainer.insertBefore(dragging,taskcontainer.children[i])
                    
                    break
                }else{
                    taskcontainer.appendChild(dragging)
                }


            }
            
            
        })
    


