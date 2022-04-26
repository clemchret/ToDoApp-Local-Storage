//Theme sombre
function setTheme () {
    document.body.classList.toggle('light');
    document.body.classList.toggle('dark');
    if(document.body.classList.contains('dark')){
        document.querySelector('.color-theme').innerHTML = `<i class="fa-solid fa-sun"></i>`;
    }else{
        document.querySelector('.color-theme').innerHTML = `<i class="fa-solid fa-moon"></i>`;
    }
    
};

document.querySelector('.color-theme').addEventListener('click', setTheme);


//Apparition ou non du bouton reset liste et de la barre des filtres
function loadFilters (){
    const resetBtn = document.querySelector('.resetBtn');
    const filterBar = document.querySelector('.stat');
    const listItem = document.querySelector('.list-items');
    if(listItem.hasChildNodes()){
        resetBtn.style.display = 'block';
        filterBar.style.display = 'flex';
    }else{
        resetBtn.style.display = 'none';
        filterBar.style.display = 'none';
    };
};


//Reset de la liste
function resetTask (){
    localStorage.clear();
    location.reload();
};

document.getElementById('resetList').addEventListener('click', resetTask);


//Checker si il y a déjà des tâches créées et les afficher si c'est le cas.
window.onload = loadTasks;

//On prend les tâches dans le local storage et on les convertit en tableau.
function loadTasks(e){
    e.preventDefault();
    let tasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
    if(typeof tasks != null){
    //On passe dans tous les éléments créés et on les affiche.
    tasks.forEach(task => {
        const list = document.querySelector('ul');
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = 
        `<div class="task-bar">
            <!--<i class="fa-regular fa-circle-check"></i>-->
            <i class="fa-regular fa-circle"></i>
            <input class="task-bar-title" type="text" value="${task.task}" disabled>
            <i class="fa-solid fa-pen-to-square"></i>
            <i class="far fa-trash-alt"></i>
        </div>`;
        list.insertBefore(li, list.children[0]);
    });
    };

};


//Fonction d'ajout des tâches
function addTask(){
    
    let inputTask = document.getElementById('toDo').value;

    /*//Si rien n'est entré.
    if(inputTask === ''){
        alert('Veuillez entrer une tâche !');
        return false;
    }
        //Si c'est entré, vérifier si elle n'existe pas déjà.
        let savedTasks = Array.from(JSON.parse(localStorage.getItem("tasks")));
        //Si elle existe déjà.
        savedTasks.forEach(todo => {
            if (todo.task === inputTask) {
                alert("Tâche déjà créée");
                inputTask.value = "";
                return;
            }
        });*/

        //Ajout de la tâche dans le local storage.
        localStorage.setItem("tasks", JSON.stringify([...JSON.parse(localStorage.getItem("tasks") || "[]"), { task: document.getElementById('toDo').value, completed: false }]));
        
        //Création de la tâche en html
        const list = document.querySelector('ul');
        const li = document.createElement('li');
        li.classList.add('item');
        li.innerHTML = 
        `<div class="task-bar">
            <i class="fa-regular fa-circle"></i>
            <input class="task-bar-title" type="text" value="${inputTask}" disabled>
            <i class="fa-solid fa-pen-to-square"></i>
            <i class="far fa-trash-alt"></i>
        </div>`;
        list.insertBefore(li, list.children[0]);

        //clear le champ input pour pouvoir entrer la prochaine valeur.
        document.getElementById('toDo').value = '';
    }

document.getElementById('submitTask').addEventListener('click', addTask);


//Suppression de l'élément*/
