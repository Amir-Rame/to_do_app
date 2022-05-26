//import style
import './styles/project.css';

//import code
import { tasks,projects,save, project } from ".";
import { showModal } from "./modal.js"

//importing assets
import infoIcon from "./assets/info-icon.svg"
import increaseIcon from "./assets/increase-icon.svg"
import decreaseIcon from "./assets/decrease-icon.svg"


const container = document.getElementById('container');
let sortDirection = 0;

export function renderProjects(){
    //active nav:
    const navItem = document.getElementsByClassName('nav-item');
    for(let i in navItem){
        if(navItem[i].classList){
            navItem[i].classList.remove('li-active')
        }
    }
    navItem[4].classList.add('li-active')
    container.innerText='';
    renderProjectsPanel();
}


function renderProjectsPanel(){
    container.innerText=''

    const filterPanel = document.createElement('div');
    filterPanel.id='filter-panel';

    const filterTitle = document.createElement('span');
    filterTitle.innerText='Task Filter Panel';

    const searchBox = document.createElement('div');
    searchBox.id='search-box';

    const searchTitle = document.createElement('h4');
    searchTitle.innerText='Search :';

    const searchInput = document.createElement('input');
    searchInput.name='search-input';
    searchInput.id='search-input';
    searchInput.type='text';
    searchInput.placeholder='title ...'
    searchInput.addEventListener('input',renderResultTable);

    searchBox.append(searchTitle,searchInput);

    const sortBox = document.createElement('div');
    sortBox.id='sort-box';

    const sortTitle = document.createElement('h4');
    sortTitle.innerText='Sort by :';

    const sortInput = document.createElement('select');
    sortInput.name='sort-select';
    sortInput.id='sort-select';
    sortInput.addEventListener('change',renderResultTable);

    const sortByIndex = document.createElement('option');
    sortByIndex.value=1;
    sortByIndex.selected='selected';
    sortByIndex.innerText='Index'
    const sortByTitle = document.createElement('option');
    sortByTitle.value=2;
    sortByTitle.innerText='Title'
    const sortByDone = document.createElement('option');
    sortByDone.value=3;
    sortByDone.innerText='Done'

    const sortIcon = document.createElement('img');
    sortIcon.src=decreaseIcon;
    sortIcon.id='sort-toggle';
    sortIcon.addEventListener('click',()=>{
        sortIcon.src==decreaseIcon?sortIcon.src=increaseIcon:sortIcon.src=decreaseIcon;
        sortIcon.src==decreaseIcon?sortDirection=0:sortDirection=1;
        renderResultTable()
    })

    const taskHolder = document.createElement('div');
    taskHolder.classList.add('task-holder');

    sortInput.append(sortByIndex,sortByTitle,sortByDone);
    sortBox.append(sortTitle,sortInput,sortIcon);
    
    filterPanel.append(filterTitle,searchBox,sortBox,taskHolder);
    container.append(filterPanel);

    renderResultTable();
}

function renderResultTable(){

    const resultArray = resultArrayGenerator();
    const taskHolder = document.getElementsByClassName('task-holder')[0];
    taskHolder.innerText='';

    for(let proj of resultArray){

        const projectBox = document.createElement('div');
        projectBox.classList.add('project-box');
        projectBox.setAttribute('id',proj.id);

        const projCheck = document.createElement('input');
        projCheck.type='checkbox';
        projCheck.checked=proj.done;

        let percentage=0;
        const title = document.createElement('span');
        percentage>0?title.innerText=`${proj.title} (${percentage}%)\n🛈 ${proj.description}`:
            title.innerText=`${proj.title} (0%)\n🛈 ${proj.description}`;

        const tasksPanel= document.createElement('div');
        tasksPanel.classList.add('tasks-panel');

        const taskArray = tasks.filter(e=>e.project==proj.id);

        for(let task of taskArray){

            const taskBox = document.createElement('div');
            taskBox.classList.add('task-box');
            taskBox.setAttribute('id',task.id);

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

            taskBox.append(taskCheck,taskTitle,info);
            tasksPanel.append(taskBox);

            //change state when dashboard checkbox is checked
            taskCheck.addEventListener('change',(e)=>{
                tasks[e.target.parentNode.id].done=taskCheck.checked;
                save();
                renderResultTable();
            })
        }

        const actionPanel = document.createElement('div');
        actionPanel.classList.add('action-panel');

        const info = document.createElement('img');
        info.src = infoIcon;
        info.classList.add('proj-info');

        projCheck.addEventListener('change',(e)=>{
            projects[e.target.parentNode.parentNode.id].done=projCheck.checked;
            save();
            renderResultTable();
        })
        
        actionPanel.append(projCheck,title,info);

        projectBox.append(actionPanel,tasksPanel);
        taskHolder.append(projectBox);
    }

    const taskInfo = document.querySelectorAll('.task-info');
    const projInfo = document.querySelectorAll('.proj-info');

    [...taskInfo].map(e=>e.addEventListener('click', showModal));
    [...projInfo].map(e=>e.addEventListener('click', showModal));

}

function resultArrayGenerator(){
    const searchInput=document.querySelector('#search-input');
    const sortInput=document.querySelector('#sort-select');

    let titleResult= projects.filter(e=>e.title.includes(searchInput.value));
    let resultArray = [...titleResult];
    
    if(sortInput.value==1){ //date created
        resultArray = resultArray.sort((a,b)=>{
            if(a.id<b.id)return -1
            else if(a.id>b.id)return 1
            else return 0
        })
    }else if(sortInput.value==2){ //title
        resultArray = resultArray.sort((a,b)=>{
            const titleA = a.title.toUpperCase();
            const titleB = b.title.toUpperCase();
            if(titleA<titleB)return -1
            else if(titleA>titleB)return 1
            else return 0
        })
    }else if(sortInput.value==3){ //done
        resultArray = resultArray.sort((a,b)=>{
            if(a.done<b.done)return -1
            else if(a.done>b.done)return 1
            else return 0
        })
    }
    if(sortDirection==1){
        resultArray=resultArray.reverse();
    }
    return resultArray;
}


