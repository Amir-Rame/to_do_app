//import style
import './styles/dashboard.css';

//import code
import { tasks,projects,save } from ".";
import { showModal } from "./modal.js"

//importing assets
import infoIcon from "./assets/info-icon.svg"


const container = document.getElementById('container');

export function renderDashboard(){

    //active nav:
    const navItem = document.getElementsByClassName('nav-item');
    for(let i in navItem){
        if(navItem[i].classList){
            navItem[i].classList.remove('li-active')
        }
    }
    navItem[0].classList.add('li-active')

    //dashboard render
    container.innerText='';

    //render visuals
    renderTaskManager();
    renderProjects(); //callback: renderTaskInDashboard(tasks,0); //callback: entry setup
}

//task manager
function renderTaskManager(){
    const taskPanel = document.createElement('div');
    taskPanel.classList.add('task-panel');
    taskPanel.id=-1;

    const taskTitle = document.createElement('span');
    taskTitle.innerText='Task Manager';
    
    const taskHolder = document.createElement('div');
    taskHolder.classList.add('task-holder')

    const TaskAdder = document.createElement('span');
    TaskAdder.id='task-adder';
    TaskAdder.innerText="Add a new task"

    const projAdder = document.createElement('span');
    projAdder.id='proj-adder';
    projAdder.innerText="Add a new Project"

    const projectHolder = document.createElement('div');
    projectHolder.id='proj-holder';

    taskPanel.append(taskTitle,projAdder,TaskAdder,taskHolder);
    container.append(taskPanel,projectHolder);
}

function renderProjects(){

    const projectHolder = document.querySelector('#proj-holder');
    projectHolder.innerText='';
    const SortedProjArray = [...projects].sort((a,b)=>{if(a.done==true&&b.done==true)return 0;if(a.done==true)return 1;if(b.done==true)return -1})

    for(let proj of SortedProjArray){
        const projPanel = document.createElement('div');
        projPanel.classList.add('proj-panel');

        let taskArray = tasks.filter(e=>e.project==proj.id);
        let checkedTasks = taskArray.filter(e=>e.done==1);
        let percentage = Math.round((checkedTasks.length/taskArray.length)*100);
        
        const projTitle = document.createElement('span');
        percentage>0?projTitle.innerText=`${proj.title} (${percentage}%)\n🛈 ${proj.description}`:
            projTitle.innerText=`${proj.title} (0%)\n🛈 ${proj.description}`;

        const taskHolder = document.createElement('div');
        taskHolder.classList.add('task-holder')

        const projCheck = document.createElement('input');
        projCheck.type='checkbox';
        projCheck.checked=proj.done;

        projCheck.addEventListener('change',(e)=>{
            projects[e.target.parentNode.parentNode.id].done=projCheck.checked;
            save();
            renderProjects();
        })

        const actionPanel = document.createElement('div');
        actionPanel.classList.add('action-panel');

        const info = document.createElement('img');
        info.src = infoIcon;
        info.classList.add('proj-info')
        
        actionPanel.append(projCheck,projTitle,info);
        projPanel.append(actionPanel,taskHolder);
        projPanel.setAttribute('id',proj.id);
        projectHolder.append(projPanel);
    }
    renderAllTasks()
}
function renderAllTasks(){
    for(let i=-1;i<projects.length;i++){
        let taskArray = tasks.filter(e=>e.project==`${i}`)
        renderTaskInDashboard(taskArray,i);
    }
}

function renderTaskInDashboard(taskArray,id){ //task array and index of task-holder
    const taskHolder = [...document.getElementsByClassName('task-holder')].filter(e=>e.parentNode.id==[id])[0];
    taskHolder.innerText='';
    const SortedTaskArray = [...taskArray].sort((a,b)=>{if(a.done==true&&b.done==true)return 0;if(a.done==true)return 1;if(b.done==true)return -1})
    for(let task of SortedTaskArray){

        const taskBox = document.createElement('div');
        taskBox.classList.add('task-box');

        const taskCheck = document.createElement('input');
        taskCheck.type='checkbox';
        taskCheck.checked=task.done;

        const taskTitle = document.createElement('h4');
        taskTitle.innerText=`${task.title}\n🛈 ${task.description}\n🗓 ${task.dueDate}`;

        const info = document.createElement('img');
        info.src = infoIcon;
        info.classList.add('task-info');

        if(task.priority==1){
            taskBox.style.borderLeft='5px solid var(--color-low-priority)'
        }else if(task.priority==2){
            taskBox.style.borderLeft='5px solid var(--color-mid-priority)'
        }else {
            taskBox.style.borderLeft='5px solid var(--color-high-priority)'
        }

        taskBox.setAttribute('id',task.id);
        taskBox.setAttribute('draggable',true);
        // actionDiv.append(info);
        taskBox.append(taskCheck,taskTitle,info);
        taskHolder.append(taskBox);

        //change state when dashboard checkbox is checked
        taskCheck.addEventListener('change',(e)=>{
            tasks[e.target.parentNode.id].done=taskCheck.checked;
            save();
            renderProjects();
        })
    }
    dragLogic();
    entrySetup();
}

function dragLogic(){
    const taskBox = document.querySelectorAll('.task-box')
    const taskHolders = document.querySelectorAll('.task-holder')

    taskBox.forEach(box=>{
        box.addEventListener('dragstart',()=>{
            box.classList.add('dragging')
        })
        box.addEventListener('dragend',(e)=>{
            box.classList.remove('dragging')

            tasks[e.path[0].id].project = e.path[2].id; //change project on drag
            save();
            renderDashboard();
        })
    })
    taskHolders.forEach(holder=>{
        holder.addEventListener('dragover',(e)=>{
            e.preventDefault();
            const afterElement = getDragPosition(holder,e.clientY)
            const box = document.querySelector('.dragging');
            if (afterElement == null){
                holder.appendChild(box);
            } else {
                holder.insertBefore(box,afterElement)
            }
        })
    })
}
function getDragPosition(holder,y){
    const draggableList = [...holder.querySelectorAll('.task-box:not(.dragging)')]
   
    return draggableList.reduce((closest,child)=>{
        const box = child.getBoundingClientRect();
        const offset = y-box.top-box.height/2;
        if (offset<0&&offset>closest.offset){
            return {offset: offset,element: child}
        } else {
            return closest;
        }
    },{offset: Number.NEGATIVE_INFINITY}).element
}

function entrySetup(){
    const taskAdder = document.getElementById('task-adder');
    const projAdder = document.getElementById('proj-adder');
    const taskInfo = document.querySelectorAll('.task-info');
    const projInfo = document.querySelectorAll('.proj-info');

    taskAdder.addEventListener('click', showModal);
    projAdder.addEventListener('click', showModal);
    [...taskInfo].map(e=>e.addEventListener('click', showModal));
    [...projInfo].map(e=>e.addEventListener('click', showModal));
}
















































