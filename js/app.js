//////// Test Data Model

var userPreferences = {
    defaultNotebook: undefined,
    colorScheme: undefined,
}


var noteData = {};
var activeNotebook;
//noteData.activeNotebook = undefined;
//var activeNotebook = noteData.activeNotebook;
//
//
//function loadFromLocalStorage () {
//    if (typeof(Storage) !== "undefined") {
//    // Code for localStorage/sessionStorage.
//        if (localStorage.hasOwnProperty('cursorAppData')) {
//            noteData = JSON.parse(localStorage.cursorAppData);
//        }
//    } else {
//        // Sorry! No Web Storage support..
//    }
//};
//
//function saveToLocalStorage () {
//    localStorage.cursorAppData = JSON.stringify(noteData);
//}

function notebook (notebookName) {
    this.name = notebookName;
    this.starred = false;
    this.notes = [];
};

function note (noteID, noteTitle, noteContent, dateSaved) {
    this.noteID = noteID;
    this.noteTitle = noteTitle;
    this.noteContent = noteContent;
    this.dateSaved = dateSaved;
};

var activeNote;

//////// DOM Stuff

/// Buttons

var newNoteButton = document.getElementById("new-note-button");
var saveNoteButton = document.getElementById("note-save-button");
var deleteNoteButton = document.getElementById("note-delete-button");

// Lists and Forms

var notebookMenuList = document.getElementById("notebook-menu-list");
var noteList = document.getElementById("note-list");

var noteTitleInput = document.getElementById("note-title-input");
var noteContentInput = document.getElementById("note-content-input");

////// App Methods

var noteapp = {
  createNotebookMenuItem: function (notebookArr) {
      var html = "";
      var notebookObject = notebookArr[1];
      var notebookKey = notebookArr[0];
      var trashIcon = "<div class=\"menu-item-delete\"></div>"
      if ((Object.is(activeNotebook, noteData[notebookKey])) && notebookObject.starred) {
          html = "<div id=" + notebookKey + " class=\"notebook-button notebook-menu-list-item notebook-menu-list-item-selected notebook-menu-list-item-starred\"><div class=\"notebook-menu-item-name\">" + notebookObject.name + "</div>" + trashIcon + "<div class=\"menu-item-star\"></div></div>";
          return html;
      } else if (Object.is(activeNotebook, noteData[notebookKey])) {
          html = "<div id=" + notebookKey + " class=\"notebook-button notebook-menu-list-item notebook-menu-list-item-selected\"><div class=\"notebook-menu-item-name\">" + notebookObject.name + "</div>" + trashIcon + "<div class=\"menu-item-star\"></div></div>";
          return html;
      } else if (notebookObject.starred) {
          html = "<div id=" + notebookKey + " class=\"notebook-button notebook-menu-list-item notebook-menu-list-item-starred\"><div class=\"notebook-menu-item-name\">" + notebookObject.name + "</div>" + trashIcon + "<div class=\"menu-item-star\"></div></div>";
          return html;
      } else {
          html = "<div id=" + notebookKey + " class=\"notebook-button notebook-menu-list-item\"><div class=\"notebook-menu-item-name\">" + notebookObject.name + "</div>" + trashIcon + "<div class=\"menu-item-star\"></div></div>";
          return html;
      }
  },
  updateNotebookDisplay: function (notebookDataObject) {
      // make array of notebook names and IDs, sort it by preference, iterate to create html, update html, add click handlers
      var sortedNotebooksArr = [];
      var notebookMenuHTML = "";
      Object.keys(notebookDataObject).forEach(function(key){
          sortedNotebooksArr.push([key,notebookDataObject[key]]);
      });
      sortedNotebooksArr.sort(function(a, b){
//          if (a[1].name < b[1].name) return -1;
//          if (a[1].name > b[1].name) return 1;
          return 0;
      });
      sortedNotebooksArr.forEach(function(notebook){
          notebookMenuHTML = notebookMenuHTML.concat(noteapp.createNotebookMenuItem(notebook));
      });
      var newNotebookButton = "<div class=\"notebook-menu-list-item\" id=\"create-new-notebook-button\"><img src=\"resources/icons/plus-icon-light.svg\"></div>";
      notebookMenuHTML = notebookMenuHTML.concat(newNotebookButton);
      notebookMenuList.innerHTML = notebookMenuHTML;
  },
    makeNotebooksLoadable: function () {
        var notebookElement = document.getElementsByClassName("notebook-button");
        for (var i = 0; i < notebookElement.length; i++) {
            
            if (Object.is(noteData[notebookElement[i].id], activeNotebook)) {
                var notebookNameField = notebookElement[i].firstElementChild
                notebookNameField.id = "active-notebook-name";
                notebookNameField.contentEditable = true;
                notebookNameField.addEventListener('blur', function(){
                        activeNotebook.name = this.innerHTML;
                        });
                notebookNameField.addEventListener('keydown', function(e){
                    if (e.keyCode == 13) {
                        e.preventDefault();
                        notebookNameField.blur();
                    }
                });
                notebookElement[i].children[1].addEventListener('click', function () {
//                    noteapp.deleteNote(notebookElement[i].getAttribute('id'));
                    
//                    noteapp.updateNotebookDisplay();
                });
            } else {
                notebookElement[i].addEventListener('click', noteapp.loadNotebook, false);
            }
        };
        document.getElementById("create-new-notebook-button").addEventListener('click', noteapp.startNewNotebook, false);
    },
    loadNotebook: function(){
        var id = this.getAttribute("id");
        activeNotebook = noteData[id];
        noteapp.updateNotebookDisplay(noteData);
        noteapp.makeNotebooksLoadable();
        noteapp.startNewNote();
        noteapp.updateNoteListDisplay();
        noteapp.makeNotesLoadable();
    },
    startNewNotebook: function (){
        var newNotebookID = noteapp.makeUniqueNotebookID(noteData);
        noteData[newNotebookID] = new notebook("New Notebook");
        activeNotebook = noteData[newNotebookID];
        noteapp.updateNotebookDisplay(noteData);
        noteapp.makeNotebooksLoadable();
        noteapp.startNewNote();
        noteapp.updateNoteListDisplay();
        noteapp.makeNotesLoadable();
    },
    makeUniqueNotebookID: function (notebookDatabase) {
        var notebookID = "notebook_" + ((Math.floor(Math.random() * 100) + 1) * (Math.floor(Math.random() * 100) + 1)).toString();
        if (!(notebookDatabase.hasOwnProperty("notebookID"))) {
            return notebookID;
        } else {
            this.generateUniqueID(notebookDatabase);
        }
    },
    deleteNotebook: function (notebookID) {
        if (noteData.hasOwnProperty(notebookID)) {
            delete noteData.notebookID;
        }
        noteapp.updateNotebookDisplay();
    },
    sortNotesByDate: function () {
        activeNotebook.notes.sort(function(a,b){
            return b.dateSaved.getTime() - a.dateSaved.getTime();
        });
    },
    updateNoteListDisplay: function () {
      noteapp.sortNotesByDate();
      noteList.innerHTML = "";
      var noteListHTML = "";
      activeNotebook.notes.forEach(function(noteData) {
        var activeClass = "";
          if (noteData.noteID === activeNote.noteID) {
              activeClass = "note-active"
          }
        var prettyDate = noteData.dateSaved.toDateString();
        var html = "<div id=\"" + noteData.noteID + "\" class=\"note " + activeClass + "\"><div class=\"note-title-date-cont\"><div class=\"note-title-display\">" + noteData.noteTitle + "</div>" + "<div class=\"note-date-display\">" + prettyDate + "</div></div><div class=\"note-content-display\">" + noteData.noteContent + "</div></div>";
        noteListHTML = noteListHTML.concat(html);
    });
      noteList.innerHTML = noteListHTML;
  },
    loadNote: function(){
        var id = this.getAttribute("id");
        activeNotebook.notes.forEach(function(noteObj) {
            if (id === noteObj.noteID) {
                activeNote = new note(noteObj.noteID, noteObj.noteTitle, noteObj.noteContent, noteObj.dateSaved)
            }
        });
        noteTitleInput.value = activeNote.noteTitle;
        noteContentInput.value = activeNote.noteContent;
    },
  makeNotesLoadable: function () {
    var noteElement = document.getElementsByClassName("note");
    for (var i = 0; i < noteElement.length; i++) {
      noteElement[i].addEventListener('click', noteapp.loadNote, false);
      noteElement[i].addEventListener('click', noteapp.updateNoteListDisplay, false);
      noteElement[i].addEventListener('click', noteapp.makeNotesLoadable, false);
    }
  },
  startNewNote: function () {
    var newID = this.generateUniqueID();
    activeNote = new note(newID, "", "", undefined) 
    noteTitleInput.value = "";
    noteContentInput.value = "";
  },
  generateUniqueID: function() {
    var isUnique = true;
    var id = "note" + ((Math.floor(Math.random() * 100) + 1) * (Math.floor(Math.random() * 100) + 1)).toString();
    if (activeNotebook.notes.length > 0) {
      activeNotebook.notes.forEach(function(noteObj) {
        if (noteObj.noteID === id) {
          isUnique = false;
        }
      });
      if (isUnique === false) {
        this.generateUniqueID();
      } else return id;
    } else return id;
  },
  saveNote: function () {
    var date = new Date();
    var noteTitle;
    if (noteTitleInput.value.length > 1) {
        noteTitle = noteTitleInput.value;
    } else {
        noteTitle = "Untitled Note";
    }
    var updatedNote = new note(activeNote.noteID, noteTitle, noteContentInput.value, date);
    var noteExists = false;
      activeNotebook.notes.forEach(function(noteObj, index) {
      if (updatedNote.noteID === noteObj.noteID) {
        activeNotebook.notes[index] = updatedNote;
        noteExists = true;
      }
    });
    if (!noteExists) {
        activeNotebook.notes.unshift(updatedNote);
    }
    activeNote = new note(updatedNote.noteID, updatedNote.noteTitle, updatedNote.noteContent, updatedNote.dateSaved);
  },
  deleteNote: function () {
    activeNotebook.notes.forEach(function(noteObj, index) {
      if (activeNote.noteID === noteObj.noteID) {
        activeNotebook.notes.splice(index, 1);
      }
    });
  },
}

/////////////// Button Functions

newNoteButton.onclick = function() {
  noteapp.startNewNote();
 // noteapp.saveNote();
  noteapp.updateNoteListDisplay();
  noteapp.makeNotesLoadable();
};

saveNoteButton.onclick = function() {
  noteapp.saveNote();
  noteapp.updateNoteListDisplay();
  noteapp.makeNotesLoadable();
};

deleteNoteButton.onclick = function () {
  noteapp.deleteNote();
  noteapp.startNewNote();
  noteapp.updateNoteListDisplay();
  noteapp.makeNotesLoadable();
}


///// Note Save Keys

noteContentInput.addEventListener('keydown', function(e) {
    if (e.keyCode == 13 && e.metaKey) {
        noteapp.saveNote();
        noteapp.updateNoteListDisplay();
        noteapp.makeNotesLoadable();
    }
    if (e.metaKey && (e.keyCode == 8 || e.keyCode == 46)) {
        noteapp.deleteNote();
        noteapp.startNewNote();
        noteapp.updateNoteListDisplay();
        noteapp.makeNotesLoadable();
    }
});

/// Load Page
//loadFromLocalStorage();

//if (typeof(activeNotebook) == undefined) {
//    console.log("error");
//    noteapp.startNewNotebook();
//} 
noteapp.startNewNotebook();
noteapp.updateNotebookDisplay(noteData);
noteapp.makeNotebooksLoadable();
noteapp.startNewNote();
noteapp.updateNoteListDisplay();
noteapp.makeNotesLoadable();