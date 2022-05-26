//style
import './styles/survey.css';

//code
import { hideModal } from './modal';

const survey = [
    {title:'Survey',
    texts:[`Welcome to my To Do App.`,
    `Would you like to take a survey?`]},
    {title:'Navigation',
    texts:[`Navigation bar resides at the left side of the page.`,
    `Normally the labels would be hidden.`,
    `In order to expand the navigation bar simply hover over it with your mouse pointer.`,
    `Navigate through the app by clicking on the desired label.`,
    `your current location is marked by a deep blue color.`]},
    {title:'Dashboard',
    texts:[`Dashboard is the default page.`,
    `It offers a variety of functions such as creating a new task or projects.`,
    `By clicking on 'create a new task' button, filling and submitting the form you can create a new task.`,
    `To appoint a task to a certain project drag the task and drop wherever you want.`,
    `Edit,view or delete tasks and projects by clicking on the info icon.`,
    `Mark a task as done by clicking on the checkbox.`]},
    {title:'Today and Upcoming',
    texts:[`Here you would find a list of your tasks for the day or the upcoming days.`]},
    {title:'Filters',
    texts:[`This page offers a set of tools to filter, search and sort the tasks`,
    `In order to search for a task type a part of it's title.`,
    `Use the selector to sort the tasks by a desired order.`,
    `Sort the result in a descending or ascending manner by clicking on the icon on the right-side`]},
    {title:'Finale',
    texts:[`Your actions are saved locally on your computer and would remain accessible later.`,
    `Thanks for using this application.`,
    `Help me by reporting bugs and leaving fruitful reviews. <3`]},
]

const cover = document.getElementById('cover'); 

const modal = document.getElementById('modal');
const modalMenu = modal.children[0];
const modalContent = modal.children[1];
let pageNumber = 0;

export function renderSurvey(){

    modalContent.innerText='';

    showSurvey();
    modalMenu.children[0].style.display='none';
    modalMenu.children[1].style.display='none';
    modalMenu.children[2].style.display='none';
    modalMenu.children[3].style.display='none';
    modalContent.style.border='5px solid var(--color-theme-two)';

    let currentPage = survey[pageNumber];

    const title = document.createElement('h3');
    title.innerHTML=currentPage.title;

    const textsHolder = document.createElement('ol');

    for(let text of currentPage.texts){
        const textLine = document.createElement('li');
        textLine.innerText = text;
        textsHolder.append(textLine);
    }

    const actionBar = document.createElement('div')
    actionBar.id='survey-action-bar';

    const previousBtn =document.createElement('button');
    previousBtn.innerText = '⮜ Previous';
    previousBtn.addEventListener('click',()=>{
        pageNumber--;
        renderSurvey();
    })
    previousBtn.style.borderColor='var(--color-mid-priority)'
    const cancelBtn = document.createElement('button');
    cancelBtn.innerText = '✕ Cancel';
    cancelBtn.addEventListener('click',()=>{
        hideModal();
        pageNumber=0;
    })
    cancelBtn.style.borderColor='var(--color-high-priority)'
    const nextBtn = document.createElement('button');
    if(pageNumber==0){nextBtn.innerText = 'Begin ⮞'}
        else if(pageNumber==survey.length-1){nextBtn.innerText = 'Finish';}
        else{nextBtn.innerText = 'Next ⮞';}
    nextBtn.addEventListener('click',()=>{
        if(pageNumber==survey.length-1){
            hideModal();
            return;
        }
        pageNumber++;
        renderSurvey();
    })
    nextBtn.style.borderColor='var(--color-low-priority)'
    
    if(pageNumber==0){
        actionBar.append(cancelBtn,nextBtn);
    }else if(pageNumber==survey.length-1){
        actionBar.append(previousBtn,nextBtn);
    }else{
        actionBar.append(previousBtn,cancelBtn,nextBtn);
    }

    const checkBox = document.createElement('input');
    checkBox.type='checkbox';
    const checkBoxLabel =document.createElement('label');
    checkBoxLabel.for=checkBox;
    checkBoxLabel.innerText='Never show this again';
    checkBox.addEventListener('change',(e)=>{
        checkBox.checked==0?localStorage.setItem("survey", 0):localStorage.setItem("survey", 1)
    })
    localStorage.getItem("survey")==0||localStorage.getItem("survey")==null?checkBox.checked=0:checkBox.checked=1;
    const checkPanel = document.createElement('div');
    checkPanel.id='check-panel';
    checkPanel.append(checkBox,checkBoxLabel);

    
    modalContent.append(title,textsHolder,checkPanel,actionBar);

}

export function showSurvey(){
    cover.style.display='block';
    modal.style.transform='translate(-50%,-50%) scale(1)'
}
export function hideSurvey(){
    cover.style.display='none';
    modal.style.transform='translate(-50%,-50%) scale(0)'
}