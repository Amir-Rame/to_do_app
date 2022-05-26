//import style
import './styles/main.css';

//assets
import bg from './assets/sun-tornado.svg'
import dashLogo from './assets/dash-icon.svg'
import todLogo from './assets/today-icon.svg'
import upLogo from './assets/up-icon.svg'
import filterLogo from './assets/filter-icon.svg'
import projLogo from './assets/proj-icon.svg'
import logo from './assets/logo.svg'

//renders
import { hideModal } from './modal';
import { renderDashboard } from './dashboard';
import { renderToday } from './today';
import { renderUpcoming } from './today'
import { renderFilter } from './filter';
import { renderSurvey } from './survey';
import { renderProjects } from './project';

//global variables
export let projects = [];
export let tasks = [];
export class project{
    constructor(id,title,description,done){
        this.id=id;
        this.title=title;
        this.description=description;
        this.done=done;
    }
}
export class task{
    constructor(id,title,description,priority,dueDate,done){
        this.id=id;
        this.title=title;
        this.description=description;
        this.priority=priority;
        this.dueDate=dueDate;
        this.done=done;
        this.project='-1';
    }
}

//survey
    // localStorage.setItem("survey", 0);
if(localStorage.getItem("survey") == null||localStorage.getItem("survey") == 0){
    renderSurvey();
    localStorage.setItem("survey", 0);
}
//loading from local storage
if(localStorage.getItem("tasks-storage") !== null){
    tasks = JSON.parse(localStorage.getItem("tasks-storage"));
}
if(localStorage.getItem("projects-storage") !== null){
    projects = JSON.parse(localStorage.getItem("projects-storage"));
}
//saving to local storage
export function save(){
    localStorage.setItem("tasks-storage", JSON.stringify(tasks));
    localStorage.setItem("projects-storage", JSON.stringify(projects));
}

export function deleteTask(id){
    tasks.splice(id,1);
    reOrder('tasks');
    save();
    hideModal();
    renderDashboard();
}

export function deleteProj(id,confirm){
    //set tasks to task manager
    const projectTasks = tasks.filter(e=>e.project==id);
    confirm==true? projectTasks.forEach(e=>tasks.splice(tasks.indexOf(e),1)):
    projectTasks.forEach(e=>e.project=-1);

    //remove project
    projects.splice(id,1);
    reOrder('projects');
    save();
    hideModal();
    renderDashboard();
}

export function reOrder(mode){
    if(mode=='tasks'){
       for(let i=0;i<tasks.length;i++){
        tasks[i].id=i;
        } 
    }else if(mode=='projects'){
        for(let i=0;i<projects.length;i++){
            projects[i].id=i;
        } 
    }
    
    
}

//setup
const setup = (()=>{
    //background:
    document.body.style.backgroundImage=`url(${bg})`;
    
    //scroll set:
    const scrollContainer = document.querySelector("main");
    scrollContainer.addEventListener("wheel", (e) => {

        const main = document.querySelector('main');

        main.style.overflowX='scroll'
        main.style.overflowY='hidden'
        let taskHolder = e.target.closest('.task-holder');
        if(taskHolder&&taskHolder.scrollHeight>taskHolder.clientHeight)return;
        e.preventDefault();
        scrollContainer.scrollLeft += e.deltaY/3;

    });

    //nav icons
    const icon = document.getElementsByClassName('icon');
    icon[0].src=logo;
    icon[1].src=dashLogo;
    icon[2].src=todLogo;
    icon[3].src=upLogo;
    icon[4].src=filterLogo;
    icon[5].src=projLogo;

    //rendering dashboard
    renderDashboard();

    const navItem = document.getElementsByClassName('nav-item');
    navItem[0].addEventListener('click',renderDashboard);
    navItem[1].addEventListener('click',renderToday);
    navItem[2].addEventListener('click',renderUpcoming);
    navItem[3].addEventListener('click',renderFilter);
    navItem[4].addEventListener('click',renderProjects);

    //clock
    let clock = document.getElementById('time');
    updateClock()
    setInterval(() => {updateClock()}, 1000);
    function updateClock(){
        let now = new Date;
        clock.innerText=now.toLocaleTimeString();
    }
    

})();


// tasks=[];
// projects=[];
// save()








