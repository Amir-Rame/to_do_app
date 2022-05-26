//import style
import './styles/modal.css';

//import functions
import { renderDashboard } from "./dashboard"
import { renderToday, renderUpcoming } from './today';
import { renderFilter } from './filter';
import { renderProjects } from './project';

//import variables
import { task,project,tasks,projects,save,deleteTask,deleteProj } from ".";

// import * as root from '.'

const cover = document.getElementById('cover');
cover.addEventListener('click',hideModal)
const modal = document.getElementById('modal');
const modalMenu = modal.children[0];
const modalContent = modal.children[1];


export function showModal(){
    cover.style.display='block';
    modal.style.transform='translate(-50%,-50%) scale(1)'
    modalContentRender(this.id||this.classList[0],this);
}

export function hideModal(){
    cover.style.display='none';
    modal.style.transform='translate(-50%,-50%) scale(0)'
}


function modalContentRender(mode,element){
    modalContent.innerText='';

    if (mode == 'task-adder'){
        modalMenu.children[0].style.display='block';
        modalMenu.children[1].style.display='none';
        modalMenu.children[2].style.display='none';
        modalMenu.children[3].style.display='none';
        setModalBorder('green');
        renderAddOrEditTaskModal('add',element);

    }else if (mode == 'proj-adder'){
        modalMenu.children[0].style.display='none';
        modalMenu.children[1].style.display='block';
        modalMenu.children[2].style.display='none';
        modalMenu.children[3].style.display='none';
        setModalBorder('green');
        renderAddOrEditProjectModal('add',element);
        
    }else if(mode== 'task-info'){
        modalMenu.children[0].style.display='none';
        modalMenu.children[1].style.display='none';
        modalMenu.children[2].style.display='block';
        modalMenu.children[3].style.display='block';
        setModalBorder('blue');
        renderAddOrEditTaskModal('edit',element);

    }else if(mode=='proj-info'){
        modalMenu.children[0].style.display='none';
        modalMenu.children[1].style.display='none';
        modalMenu.children[2].style.display='block';
        modalMenu.children[3].style.display='block';
        setModalBorder('blue');
        renderAddOrEditProjectModal('edit',element);
    }
    modalContent.children[1].focus();
}

function setModalBorder(borderColor){
    if(borderColor=='green'){
        modalContent.style.border='5px solid var(--color-low-priority)';
    }else if(borderColor=='blue'){
        modalContent.style.border='5px solid var(--color-accent)';
    }else if(borderColor=='red'){
        modalContent.style.border='5px solid var(--color-high-priority)';
    }
}

function renderAddOrEditTaskModal(mode,element){

    modalContent.style.display='grid';
    modalContent.style.gridTemplate='1fr 3fr 1fr 1fr 1fr 1fr/1fr 3fr';
    
    const title = document.createElement('h4');
    title.innerText= 'Task Name: ';
    const titleInput = document.createElement('input')
    titleInput.name= 'title-input';
    titleInput.type='text'
    titleInput.placeholder='Name'

    const description = document.createElement('h4');
    description.innerText= 'Description: ';
    const descriptionInput = document.createElement('textarea')
    descriptionInput.name= 'description-input';
    descriptionInput.placeholder='description';
    descriptionInput.style.resize='none'

    const priority = document.createElement('h4');
    priority.innerText= 'Priority: ';
    const prioInput = document.createElement('select');
    const lowPrio = document.createElement('option');
    lowPrio.value=1;
    lowPrio.selected='selected';
    lowPrio.innerText='Low Priority'
    const midPrio = document.createElement('option');
    midPrio.value=2;
    midPrio.innerText='Medium Priority'
    const highPrio = document.createElement('option');
    highPrio.value=3;
    highPrio.innerText='High Priority'
    prioInput.append(lowPrio,midPrio,highPrio)

    const dueDate = document.createElement('h4');
    dueDate.innerText= 'Due date: ';
    const dateInput = document.createElement('input');
    dateInput.name= 'description-input';
    dateInput.type= 'date';

    var date = new Date();
    dateInput.value = date.getFullYear().toString() + 
        '-' + (date.getMonth() + 1).toString().padStart(2, 0) +
        '-' + date.getDate().toString().padStart(2, 0);

    const done = document.createElement('h4');
    done.innerText='Done: '
    const doneInput = document.createElement('input');
    doneInput.name= 'done-input';
    doneInput.type= 'checkbox';

    const cancel = document.createElement('span');
    cancel.classList.add('cancel-btn');
    cancel.innerText='Cancel';

    const submitBtn = document.createElement('span');

    if(mode=='add'){
        modalMenu.children[0].children[0].innerText='New Task';

        submitBtn.classList.add('create-btn');
        submitBtn.innerText='Create Task';
        submitBtn.addEventListener('click',submitNewTask);

    }else if(mode=='edit'){

        modalMenu.children[3].addEventListener('click',()=>{
            modalMenu.children[2].addEventListener('click',()=>{
                modalContent.innerText='';;
                renderAddOrEditTaskModal(mode,element);
                setModalBorder('blue');
            },{once:true});
            modalContent.innerText='';
            renderDelete(element,'task');
        },{once:true})
        modalMenu.children[2].children[0].innerText='Edit Task';

        submitBtn.classList.add('edit-btn');
        submitBtn.innerText='Edit Task';

        let onEditTask = tasks[element.parentNode.id];
        titleInput.value=onEditTask.title;
        descriptionInput.value=onEditTask.description;
        prioInput.value=onEditTask.priority;
        dateInput.value=onEditTask.dueDate;
        doneInput.checked=onEditTask.done;

        submitBtn.id=onEditTask.id;
        submitBtn.addEventListener('click',EditTask);
    }

    modalContent.append(title,titleInput,description,descriptionInput,priority,prioInput,dueDate,dateInput,done,doneInput,cancel,submitBtn)
    cancel.addEventListener('click',hideModal)

}

function renderDelete(element,mode){
    modalContent.innerText='';
    setModalBorder('red');

    modalContent.style.display='grid';
    mode=='task'?
        modalContent.style.gridTemplate='1fr 1fr/1fr 2fr':
        modalContent.style.gridTemplate='1fr 1fr 1fr/1fr 2fr'
    
    const title = document.createElement('h4');
    mode=='task'?
        title.innerText= 'Delete Task? ':title.innerText= 'Delete Project? '
    
    const description = document.createElement('h4');
    mode=='task'?
        description.innerText= `You are about to delete a task.\n This process is irreversible.\n Would you proceed?`:
        description.innerText= `You are about to delete a Project.\n This process is irreversible.\n Would you proceed?`;

    //checkbox
    const confirm = document.createElement('h4');
    confirm.innerText='Delete all sub-tasks as well? '
    const confirmInput = document.createElement('input');
    confirmInput.name= 'confirm-input';
    confirmInput.type= 'checkbox';

    //btn
    const cancel = document.createElement('span');
    cancel.classList.add('cancel-btn');
    cancel.innerText='Cancel';

    const submitBtn = document.createElement('span');
    submitBtn.classList.add('delete-btn');
    mode=='task'?submitBtn.innerText='Delete Task':submitBtn.innerText='Delete Project';
    mode=='task'?
        submitBtn.addEventListener('click',()=>{deleteTask(element.parentNode.id)},{once:true}):
        submitBtn.addEventListener('click',()=>{deleteProj(element.parentNode.id,confirmInput.checked)},{once:true});

    if(mode=='proj'){
        modalContent.append(title,description,confirm,confirmInput,cancel,submitBtn);
        return;
    }
    modalContent.append(title,description,cancel,submitBtn);
}


function submitNewTask(){
    const newTask = new task(tasks.length,modalContent.children[1].value,
        modalContent.children[3].value,
        modalContent.children[5].value,
        modalContent.children[7].value,
        modalContent.children[9].checked)
    tasks.push(newTask);
    save();
    hideModal();
    renderOriginalWindow();
}

function submitNewProj(){
    const newProj = new project(projects.length,
        modalContent.children[1].value,
        modalContent.children[3].value,
         modalContent.children[5].checked)
    projects.push(newProj);
    save();
    hideModal();
    renderOriginalWindow();
}

function EditTask(){
    tasks[this.id].title=modalContent.children[1].value;
    tasks[this.id].description=modalContent.children[3].value;
    tasks[this.id].priority=modalContent.children[5].value;
    tasks[this.id].dueDate=modalContent.children[7].value;
    tasks[this.id].done=modalContent.children[9].checked;
    save();
    hideModal();
    renderOriginalWindow();
}

function EditProject(){
    projects[this.id].title=modalContent.children[1].value;
    projects[this.id].description=modalContent.children[3].value;
    projects[this.id].done=modalContent.children[5].checked;
    save();
    hideModal();
    renderOriginalWindow();
}

function renderOriginalWindow(){
    let navStatus = document.querySelectorAll('.nav-item');
    
    if(navStatus[0].classList.contains('li-active')){
        renderDashboard();
    }else if(navStatus[1].classList.contains('li-active')){
        renderToday();
    }else if(navStatus[2].classList.contains('li-active')){
        renderUpcoming();
    }else if(navStatus[3].classList.contains('li-active')){
        renderFilter();
    }else if(navStatus[4].classList.contains('li-active')){
        renderProjects();
    }
}


function renderAddOrEditProjectModal(mode,element){
    //load form
    modalContent.style.display='grid';
    modalContent.style.gridTemplate='1fr 3fr 1fr 1fr/1fr 3fr';

    const title = document.createElement('h4');
    title.innerText= 'Project Name: ';
    const titleInput = document.createElement('input')
    titleInput.name= 'title-input';
    titleInput.type='text'
    titleInput.placeholder='Name'

    const description = document.createElement('h4');
    description.innerText= 'Description: ';
    const descriptionInput = document.createElement('textarea')
    descriptionInput.name= 'description-input';
    descriptionInput.placeholder='description';
    descriptionInput.style.resize='none';

    const done = document.createElement('h4');
    done.innerText='Done: '
    const doneInput = document.createElement('input');
    doneInput.name= 'done-input';
    doneInput.type= 'checkbox';

    const cancel = document.createElement('span');
    cancel.classList.add('cancel-btn');
    cancel.innerText='Cancel';

    const submitBtn = document.createElement('span');


    if(mode=='add'){
        modalMenu.children[1].children[0].innerText='New Project';
        submitBtn.classList.add('create-btn');
        submitBtn.innerText='Create Project';
        submitBtn.addEventListener('click',submitNewProj)

    }else if(mode=='edit'){
        modalMenu.children[2].children[0].innerText='Edit Project';

        modalMenu.children[3].addEventListener('click',()=>{
            modalMenu.children[2].addEventListener('click',()=>{
                modalContent.innerText='';;
                renderAddOrEditProjectModal(mode,element);
                setModalBorder('blue');
            },{once:true});
            modalContent.innerText='';
            renderDelete(element.parentNode,'proj');
        },{once:true})

        submitBtn.classList.add('edit-btn');
        submitBtn.innerText='Edit Project';

        let onEditProj = projects[element.parentNode.parentNode.id];
        titleInput.value=onEditProj.title;
        descriptionInput.value=onEditProj.description;

        submitBtn.id=onEditProj.id;
        submitBtn.addEventListener('click',EditProject);
    }

    modalContent.append(title,titleInput,description,descriptionInput,done,doneInput,cancel,submitBtn)
    cancel.addEventListener('click',hideModal)

}




