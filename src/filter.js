
//import style
import './styles/filter.css';

//import assets
import infoIcon from "./assets/info-icon.svg"
import increaseIcon from "./assets/increase-icon.svg"
import decreaseIcon from "./assets/decrease-icon.svg"

//import code
import { tasks,projects,save } from ".";
import { showModal } from "./modal.js";

const container = document.getElementById('container');
let sortDirection = 0;

export function renderFilter(){
    //active nav:
    const navItem = document.getElementsByClassName('nav-item');
    for(let i in navItem){
        if(navItem[i].classList){
            navItem[i].classList.remove('li-active')
        }
    }
    navItem[3].classList.add('li-active')
    container.innerText='';
    renderFilterPanel();
}

function renderFilterPanel(){

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
    searchInput.addEventListener('input',renderResultTable)

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
    const sortByPriority = document.createElement('option');
    sortByPriority.value=3;
    sortByPriority.innerText='Priority'
    const sortByDueDate = document.createElement('option');
    sortByDueDate.value=4;
    sortByDueDate.innerText='Due Date'
    const sortByDone = document.createElement('option');
    sortByDone.value=5;
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

    sortInput.append(sortByIndex,sortByTitle,sortByPriority,sortByDueDate,sortByDone);
    sortBox.append(sortTitle,sortInput,sortIcon);
    
    filterPanel.append(filterTitle,searchBox,sortBox,taskHolder);
    container.append(filterPanel);

    renderResultTable()
}

function renderResultTable(){

    const resultArray = resultArrayGenerator();
    const taskHolder = document.getElementsByClassName('task-holder')[0];
    taskHolder.innerText='';

    for(let task of resultArray){

        const taskBox = document.createElement('div');
        taskBox.classList.add('today-item');
        taskBox.setAttribute('id',task.id);

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
            taskBox.style.borderLeft='5px solid var(--color-low-priority)'
        }else if(task.priority==2){
            taskBox.style.borderLeft='5px solid var(--color-mid-priority)'
        }else {
            taskBox.style.borderLeft='5px solid var(--color-high-priority)'
        }

        done.addEventListener('change',(e)=>{
            tasks[e.target.parentNode.id].done=done.checked;
            save();
            renderResultTable();
        })
        taskBox.append(index,done,title,description,projLabel,dueDate,info)
        taskHolder.append(taskBox);
    }
    
    const taskInfo = document.querySelectorAll('.task-info');
    [...taskInfo].map(e=>e.addEventListener('click', showModal));
}

function resultArrayGenerator(){

    const searchInput=document.querySelector('#search-input');
    const sortInput=document.querySelector('#sort-select');

    let titleResult= tasks.filter(e=>e.title.includes(searchInput.value));
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
    }else if(sortInput.value==3){ //prio
        resultArray = resultArray.sort((a,b)=>{
            if(a.priority<b.priority)return -1
            else if(a.priority>b.priority)return 1
            else return 0
        })
    }else if(sortInput.value==4){ //due
        resultArray = resultArray.sort((a,b)=>{
            let tempArrayA = a.dueDate.split('-').map(item=>parseInt(item));
            let tempArrayB = b.dueDate.split('-').map(item=>parseInt(item));
            if(tempArrayA[0]>tempArrayB[0])return 1;
            if(tempArrayA[0]==tempArrayB[0]&&tempArrayA[1]>tempArrayB[1])return 1;
            if(tempArrayA[0]==tempArrayB[0]&&tempArrayA[1]==tempArrayB[1]&&tempArrayA[2]>tempArrayB[2])return 1;
            return -1;
        })
    }else if(sortInput.value==5){ //done
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




