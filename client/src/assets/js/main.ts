import "../css/styles.css"
interface Note {
  title?: string;
  text?: string;
  id?: string;
}
let noteForm: HTMLFormElement | any;
let noteTitle: HTMLInputElement | any;
let noteText: HTMLTextAreaElement | any;
let saveNoteBtn: HTMLButtonElement | any;
let newNoteBtn: HTMLButtonElement | any;
let noteList: NodeListOf<HTMLUListElement> | any;
let clearBtn: HTMLButtonElement | any;

if (window.location.pathname === '/notes') {
  noteForm = document.querySelector('.note-form');
  noteTitle = document.querySelector('.note-title');
  noteText = document.querySelector('.note-textarea');
  saveNoteBtn = document.querySelector('.save-note');
  newNoteBtn = document.querySelector('.new-note');
  clearBtn = document.querySelector('.clear-btn');
  noteList = document.querySelectorAll('.list-container .list-group');
}

// Show an element
const show = (elem: HTMLButtonElement) => {
  elem.style.display = 'inline';
};

// Hide an element
const hide = (elem: HTMLButtonElement) => {
  elem.style.display = 'none';
};

// activeNote is used to keep track of the note in the textarea
let activeNote: Note;

const getNotes = () =>
  fetch('/api/notes', {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const saveNote = (note: Note) =>
  fetch('/api/notes', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(note)
  });

const deleteNote = (id: string) =>
  fetch(`/api/notes/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json'
    }
  });

const renderActiveNote = () => {
  hide(saveNoteBtn);
  hide(clearBtn);

  if (activeNote?.id) {
    show(newNoteBtn);
    noteTitle.setAttribute('readonly', true);
    noteText.setAttribute('readonly', true);
    noteTitle.value = activeNote.title;
    noteText.value = activeNote.text;
  } else {
    hide(newNoteBtn);
    noteTitle.removeAttribute('readonly');
    noteText.removeAttribute('readonly');
    noteTitle.value = '';
    noteText.value = '';
  }
};

const handleNoteSave = () => {
  const newNote = {
    title: noteTitle.value,
    text: noteText.value
  };
  saveNote(newNote).then(() => {
    getAndRenderNotes();
    renderActiveNote();
  });
};

// Delete the clicked note
const handleNoteDelete = (e: Event) => {
  // Prevents the click listener for the list from being called when the button inside of it is clicked
  e.stopPropagation();
  const note = e.target as HTMLButtonElement;
  let id = JSON.parse(note.parentElement?.getAttribute('data-note')!).id
  if (id !== 'undefined') {
    // console.log(JSON.parse(note.parentElement?.getAttribute('data-note')!).id)
    const noteId = id;
    console.log(noteId)


    if (activeNote?.id === noteId) {
      activeNote = {};
    }

    deleteNote(noteId).then(() => {
      getAndRenderNotes();
      renderActiveNote();
    });
  }
};

// Sets the activeNote and displays it
const handleNoteView = (e: Event) => {
  e.preventDefault();
  const note = e.target as HTMLButtonElement;
  activeNote = JSON.parse(note.parentElement?.getAttribute('data-note')!);
  renderActiveNote();
};

// Sets the activeNote to and empty object and allows the user to enter a new note
const handleNewNoteView = () => {
  activeNote = {};
  show(clearBtn);
  renderActiveNote();
};

// Renders the appropriate buttons based on the state of the form
const handleRenderBtns = () => {
  show(clearBtn);
  if (!noteTitle.value.trim() && !noteText.value.trim()) {
    hide(clearBtn);
  } else if (!noteTitle.value.trim() || !noteText.value.trim()) {
    hide(saveNoteBtn);
  } else {
    show(saveNoteBtn);
  }
};

// Render the list of note titles
const renderNoteList = async (notes: any) => {
  let jsonNotes = await notes.json();
  if (window.location.pathname === '/notes') {
    noteList.forEach((el: HTMLElement) => (el.innerHTML = ''));
  }

  let noteListItems = [];

  // Returns HTML element with or without a delete button
  const createLi = (text: string, delBtn = true) => {
    const liEl = document.createElement('li');
    liEl.classList.add('list-group-item');

    const spanEl = document.createElement('span');
    spanEl.classList.add('list-item-title');
    spanEl.innerText = text;
    spanEl.addEventListener('click', handleNoteView);

    liEl.append(spanEl);

    if (delBtn) {
      const delBtnEl = document.createElement('i');
      delBtnEl.classList.add(
        'fas',
        'fa-trash-alt',
        'float-right',
        'text-danger',
        'delete-note'
      );
      delBtnEl.addEventListener('click', handleNoteDelete);

      liEl.append(delBtnEl);
    }

    return liEl;
  };

  if (jsonNotes.length === 0) {
    noteListItems.push(createLi('No saved Notes', false));
  }

  jsonNotes.forEach((note: any) => {
    const li = createLi(note.title);
    li.dataset.note = JSON.stringify(note);

    noteListItems.push(li);
  });

  if (window.location.pathname === '/notes') {
    noteListItems.forEach((note) => noteList[0].append(note));
  }
};

// Gets notes from the db and renders them to the sidebar
const getAndRenderNotes = () => getNotes().then(renderNoteList);

if (window.location.pathname === '/notes') {
  saveNoteBtn.addEventListener('click', handleNoteSave);
  newNoteBtn.addEventListener('click', handleNewNoteView);
  clearBtn.addEventListener('click', renderActiveNote);
  noteForm.addEventListener('input', handleRenderBtns);
}

getAndRenderNotes();
