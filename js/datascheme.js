var noteData = {
    notebook_0001: {
        name: "Test Notebook",
        starred: false,
        notes: [
            {
                noteID: "abcdefg1234567890",
                noteTitle: "First Note",
                noteContent: "This is the note content",
                dateSaved: new Date('December 12, 2001 03:24:00'),
                noteHistory: [
                    {
                        noteTitle: "Note Test",
                        noteContent: "First words",
                        dateSaved: 20170117162323
                    }
                ]
            },
            {
                noteID: "xyz987654321",
                noteTitle: "Second Note",
                noteContent: "Next note content",
                dateSaved: new Date('December 17, 2000 03:24:00'),
                noteHistory: [
                    {
                        noteTitle: "Note Test Two",
                        noteContent: "First words",
                        dateSaved: 20170118172023
                    }
                ]
            }
        ]
    },
    notebook_0002: {
        name: "Other Test Notebook with a long name that goes on forever and ever and ever and ever",
        starred: true,
        // lastLoaded property to determine which notebook to show by default
        notes: [
            {
                noteID: "dabcdefg1234567890",
                noteTitle: "Other Note",
                noteContent: "This is the note content",
                dateSaved: new Date('December 12, 2001 03:24:00'),
                noteHistory: [
                    {
                        noteTitle: "Note Test",
                        noteContent: "First words",
                        dateSaved: 20170117162323
                    }
                ]
            },
            {
                noteID: "faxyz987654321",
                noteTitle: "Another Note",
                noteContent: "Next note content",
                dateSaved: new Date('December 17, 2000 03:24:00'),
                noteHistory: [
                    {
                        noteTitle: "Note Test Two",
                        noteContent: "First words",
                        dateSaved: 20170118172023
                    }
                ]
            }
        ]
    },
};