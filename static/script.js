const addtaskbtn = document.getElementById('addTask')
const taskcontainer = document.getElementById('taskSpace')
const input = document.getElementById('inputTask')


//load tasks
window.addEventListener('DOMContentLoaded',async()=>{
    fetch('/tasks-json').then(res=>res.json()).then(data=>{
        data.forEach((task, index)=> createTaskElement(task,index))
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
            await set_color('white')
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
    
    trash.className = 'trash-icon'
    trash.textContent = "🗑️"
    trash.style.marginLeft = '30px'
    
    check.className = 'check'
    check.type = 'checkbox'
    check.style.transform = 'scale(2)'
    check.style.marginRight = '30px'

    if (task.completed) newTask.classList.add('completed')
    
    text.textContent = task.title

    newTask.appendChild(check)
    newTask.appendChild(text)
    newTask.appendChild(trash)
    taskcontainer.appendChild(newTask)

    check.addEventListener('change', async()=>{
        newTask.classList.toggle('completed')
        await fetch('/update',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({index: index, completed: check.checked})
        })

    })

    trash.addEventListener("click",async()=>{
        await fetch('/delete',{
            method: 'POST',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({index: index})
        })
        newTask.remove()
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





