//////// Test Data Model


var noteData = {
    notebook_0001: {
        notebookName: "testNotebook",
        starred: true,
//        notes: [
//            {
//                noteID: "abcdefg1234567890",
//                noteTitle: "First Note",
//                noteContent: "This is the note content",
//                dateSaved: 20170118162323,
//                noteHistory: [
//                    {
//                        noteTitle: "Note Test",
//                        noteContent: "First words",
//                        dateSaved: 20170117162323
//                    }
//                ]
//            },
//            {
//                noteID: "xyz987654321",
//                noteTitle: "Second Note",
//                noteContent: "Next note content",
//                dateSaved: 20170118172323,
//                noteHistory: [
//                    {
//                        noteTitle: "Note Test Two",
//                        noteContent: "First words",
//                        dateSaved: 20170118172023
//                    }
//                ]
//            }
//        ]
        notes: [],
    }
};

var activeNotebook = noteData.notebook_0001;
//var activeNote = {
//    noteID: undefined,
//    noteTitle: undefined,
//    noteContent: undefined,
//    dateSaved: undefined
//};

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
  updateNoteListDisplay: function () {
      noteList.innerHTML = "";
      var noteListHTML = "";
      activeNotebook.notes.forEach(function(noteData) {
      var html = "<div id=\"" + noteData.noteID + "\" class=\"note\"><div class=\"note-title-date-cont\"><div class=\"note-title-display\">" + noteData.noteTitle + "</div>" + "<div class=\"note-date-display\">" + noteData.dateSaved + "</div></div><div class=\"note-content-display\">" + noteData.noteContent + "</div></div>";
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
    var noteDate = date.getFullYear().toString() + (date.getMonth() + 1).toString() + date.getDate().toString();
    var updatedNote = new note(activeNote.noteID, noteTitleInput.value, noteContentInput.value, noteDate);
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
noteapp.startNewNote();
noteapp.updateNoteListDisplay();
noteapp.makeNotesLoadable();