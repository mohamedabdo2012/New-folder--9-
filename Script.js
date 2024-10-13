const noteInput = document.getElementById("noteInput");
const notesDiv = document.getElementById("notesDiv");
const zeroNotes = document.getElementById("zeroNotes");
const optionsDiv = document.getElementById("optionsDiv");
const loginDiv = document.getElementById("loginDiv");
const signupDiv = document.getElementById("signupDiv");
const loginEmail = document.getElementById("loginEmail");
const loginPassword = document.getElementById("loginPassword");
const errorText = document.getElementById("errorText");
const userDiv = document.getElementById("userDiv");




var notesArray = [];

function showOptions() {

    const userName = localStorage.getItem("userName");

    if(userName == null) {
        optionsDiv.style.display = "flex";
    } else {
        userDiv.style.display = "flex";
    }

    zeroNotes.style.display = "none";
    notesDiv.style.display = "none"; 
}

function showHome() {
    loginDiv.style.display = "block";
    signupDiv.style.display = "none";
    notesDiv.style.display = "block";
    optionsDiv.style.display = "none";
    userDiv.style.display = "none";
    showNotes();
}

function showSignUp() {
    loginDiv.style.display = "none";
    signupDiv.style.display = "block";
}

function showLogin() {
    loginDiv.style.display = "block";
    signupDiv.style.display = "none";  
}


function addNote() {
    const newNote = noteInput.value;
    if (newNote == "") {
        alert("Please enter valid text");
    } else {
        notesArray.push(newNote);
        noteInput.value = "";
        saveNotes();
        showNotes();
        console.log(notesArray);
    }
}

function saveNotes() {
    const notesString = JSON.stringify(notesArray);
    localStorage.setItem("notes", notesString);
}

function getNotes() {
    const notesString = localStorage.getItem("notes");
    if (notesString == null) {
        console.log("notesString null");
    } else {
        notesArray = JSON.parse(notesString);
    }
}

function showNotes() {
    
    getNotes();

    if(notesArray.length > 0) {
        zeroNotes.style.display = "none";
    } else {
        zeroNotes.style.display = "block";
    }

    notesDiv.innerHTML = "";

    for (let index = 0; index < notesArray.length; index++) {
        const element = notesArray[index];
        
        const newDiv = document.createElement("div");

        const newParagraph = document.createElement("p");
        newParagraph.innerText = element;
        newDiv.appendChild(newParagraph);

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash3";
        deleteIcon.onclick = function () {

            if ( confirm("Are you sure to delete note?") == true ) {
                notesArray.splice(index, 1);
                saveNotes();
                showNotes();
            }
            
        }
        newDiv.appendChild(deleteIcon);

        notesDiv.appendChild(newDiv);

    }

}

showNotes();

async function loginUser() {

    if (loginEmail.value == "" || loginPassword.value == "") {
        alert("please enter your email and password");
    } else {
        errorText.style.display = "none";

        const apiUrl = `https://tatbeqak.site/apps/tatbeqey/apps/easynotes/login?email=${loginEmail.value}&password=${loginPassword.value}`;
    
        const response = await fetch(apiUrl);
    
        const data = await response.json();
    
        const status = data.status;
    
        if(status == true) {
            const userName = data.name;
            const userId = data.id;
    
            localStorage.setItem("userName", userName);
            localStorage.setItem("userId", userId);

            optionsDiv.style.display = "none";
            userDiv.style.display = "flex";
    
        } else {
            errorText.style.display = "block";
        }
    }
}


function signoutUser() {

    if(confirm("are you sure to sign out?") == true){
        localStorage.removeItem("userName");
        localStorage.removeItem("userId");
        showHome();
    }
}

async function uploadNotes() {

    const userId = localStorage.getItem("userId");
    const userNotes = JSON.stringify(notesArray);

    const apiUrl = `https://tatbeqak.site/apps/tatbeqey/apps/easynotes/addnote?id=${userId}&notes=${userNotes}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    const status = data.status;

    if(status == true){
        alert("Notes uploaded susccessfully");
    } else {
        alert("Notes upload failed!");
    }
}

async function downloadNotes() {
    
    const userId = localStorage.getItem("userId");

    const apiUrl = `https://tatbeqak.site/apps/tatbeqey/apps/easynotes/getnotes?id=${userId}`;

    const response = await fetch(apiUrl);

    const data = await response.json();

    const status = data.status;

    if(status == true){

        const downloadedNotes = data.notes;

        notesArray = JSON.parse(downloadedNotes);

        saveNotes();

        alert("Notes downloaded susccessfully");
    } else {
        alert("Notes download failed!");
    }
}