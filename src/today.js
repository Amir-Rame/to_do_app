//import style
import './styles/today.css';

//import assets
import infoIcon from "./assets/info-icon.svg"

//import code
import { tasks,save,projects } from ".";
import { showModal } from "./modal.js";

const container = document.getElementById('container');

export function renderToday(){
    //active nav:
    const navItem = document.getElementsByClassName('nav-item');
    for(let i in navItem){
        if(navItem[i].classList){
            navItem[i].classList.remove('li-active')
        }
    }
    navItem[1].classList.add('li-active')
    container.innerText='';
    renderTable(0);
}

export function renderUpcoming(){
    //active nav:
    const navItem = document.getElementsByClassName('nav-item');
    for(let i in navItem){
        if(navItem[i].classList){
            navItem[i].classList.remove('li-active');
        }
    }
    navItem[2].classList.add('li-active');
    container.innerText='';
    renderTable(1);
}

function filterToday(mode){
    let TaskArray = [...tasks];

    let today = new Date();
    let dd = String(today.getDate()).padStart(2, '0');
    let mm = String(today.getMonth() + 1).padStart(2, '0'); //January is 0!
    let yyyy = today.getFullYear();
    let todayStr = yyyy + '-' + mm + '-' + dd;

    let totalTaskArray = [];

    if(mode==0){ //today
        totalTaskArray=TaskArray.filter(e=>e.dueDate==todayStr)
    }else if(mode==1){
        totalTaskArray=TaskArray.filter(e=>{
            let tempArray = e.dueDate.split('-').map(item=>parseInt(item));
            return (tempArray[0]==parseInt(yyyy)&&tempArray[1]==parseInt(mm)&&tempArray[2]>parseInt(dd))||
                (tempArray[0]==parseInt(yyyy)&&tempArray[1]>parseInt(mm))||
                (tempArray[0]>parseInt(yyyy));
        })
    }
    totalTaskArray = totalTaskArray.sort((a,b)=>{ //upcoming
        let tempArrayA = a.dueDate.split('-').map(item=>parseInt(item));
        let tempArrayB = b.dueDate.split('-').map(item=>parseInt(item));
        if(tempArrayA[0]>tempArrayB[0])return 1;
        if(tempArrayA[0]==tempArrayB[0]&&tempArrayA[1]>tempArrayB[1])return 1;
        if(tempArrayA[0]==tempArrayB[0]&&tempArrayA[1]==tempArrayB[1]&&tempArrayA[2]>tempArrayB[2])return 1;
        return -1;
    })
    return totalTaskArray;
}

function renderTable(mode){

    container.innerText=''

    let todayTasks = filterToday(mode);

    const todayTable = document.createElement('div');
    todayTable.id='today-table';

    const todayTitle = document.createElement('span');
    mode==0?todayTitle.innerText='Today Tasks :':todayTitle.innerText='Upcoming Tasks :'
    todayTitle.id='today-title'

    const TaskAdder = document.createElement('span');
    TaskAdder.id='task-adder';
    TaskAdder.innerText="Add a new task"

    todayTable.append(todayTitle,TaskAdder)

    for(let task of todayTasks){

        const todayItem = document.createElement('div');
        todayItem.classList.add('today-item');

        const index = document.createElement('h4');
        index.innerText=task.id +`. `;

        const done = document.createElement('input');
        done.type='checkbox';
        done.checked=task.done;

        const title = document.createElement('h4');
        title.innerText=task.title;

        const description = document.createElement('p');
        description.innerText=task.description;

        const dueDate = document.createElement('h4');
        dueDate.innerText=task.dueDate;

        const projLabel = document.createElement('h4');
        if(task.project==-1){
            projLabel.innerText='Not Assigned';
        }else{
            projLabel.innerText=projects[task.project].title;
        }
        

        const info = document.createElement('img');
        info.src=infoIcon
        info.classList.add('task-info')

        if(task.priority==1){
            todayItem.style.borderLeft='5px solid var(--color-low-priority)'
        }else if(task.priority==2){
            todayItem.style.borderLeft='5px solid var(--color-mid-priority)'
        }else {
            todayItem.style.borderLeft='5px solid var(--color-high-priority)'
        }

        todayItem.setAttribute('id',task.id);

        done.addEventListener('change',(e)=>{
            tasks[e.target.parentNode.id].done=done.checked;
            save();
            renderTable(mode);
        })

        todayItem.append(index,done,title,description,projLabel,dueDate,info)
        todayTable.append(todayItem)
    }

    container.append(todayTable)
    entrySetup();
}

function entrySetup(){
    const taskAdder = document.getElementById('task-adder');
    const taskInfo = document.querySelectorAll('.task-info');

    taskAdder.addEventListener('click', showModal);
    [...taskInfo].map(e=>e.addEventListener('click', showModal));
}






