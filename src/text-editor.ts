interface State {
  onInput(editor: Editor): void;
  onSave(editor: Editor): void;
  onSaveAs(editor: Editor): void;
  getLabel(editor: Editor): string;
}

class Editor {
  textArea: HTMLTextAreaElement;
  state: State;
  openFile?: string;

  constructor(textArea: HTMLTextAreaElement) {
    this.textArea = textArea;
    this.state = new CleanUnsaved();
  }

  setState(state: State) {
    this.state = state;
    setStateLabel(this.state.getLabel(this));
  }

  onInput() { this.state.onInput(this); }
  onSave() { this.state.onSave(this); }
  onSaveAs() { this.state.onSaveAs(this); }
}

class CleanUnsaved implements State {
  onInput(editor: Editor) { editor.setState(new DirtyUnsaved()); }
  onSave(editor: Editor) { editor.onSaveAs(); }
  onSaveAs(editor: Editor) {
    const filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      const fname = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(fname, editor.textArea.value);
      editor.openFile = fname;
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  getLabel(editor: Editor) { return "*"; }
}

class DirtyUnsaved implements State {
  onInput(editor: Editor) { /* bleibt gleich */ }
  onSave(editor: Editor) { editor.onSaveAs(); }
  onSaveAs(editor: Editor) {
    const filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      const fname = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(fname, editor.textArea.value);
      editor.openFile = fname;
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  getLabel(editor: Editor) { return "*"; }
}

class CleanSaved implements State {
  onInput(editor: Editor) { editor.setState(new DirtySaved()); }
  onSave(editor: Editor) {
    if (editor.openFile) {
      localStorage.setItem(editor.openFile, editor.textArea.value);
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  onSaveAs(editor: Editor) {
    const filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      const fname = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(fname, editor.textArea.value);
      editor.openFile = fname;
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  getLabel(editor: Editor) { return editor.openFile || "_"; }
}

class DirtySaved implements State {
  onInput(editor: Editor) { /* bleibt gleich */ }
  onSave(editor: Editor) {
    if (editor.openFile) {
      localStorage.setItem(editor.openFile, editor.textArea.value);
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  onSaveAs(editor: Editor) {
    const filename = prompt("Enter a File Name", "");
    if (filename && filename.trim() !== "") {
      const fname = filename.endsWith(".txt") ? filename : filename + ".txt";
      localStorage.setItem(fname, editor.textArea.value);
      editor.openFile = fname;
      editor.setState(new CleanSaved());
      showFiles(listFiles(), "files-list");
    }
  }
  getLabel(editor: Editor) { return (editor.openFile || "_") + " *"; }
}

const textArea = document.getElementById("text") as HTMLTextAreaElement;
let editor: Editor;

document.addEventListener("DOMContentLoaded", () => {
  editor = new Editor(textArea);
  showFiles(listFiles(), "files-list");

  textArea.addEventListener("input", () => editor.onInput());

  const saveButton = document.getElementById("save-button");
  saveButton.addEventListener("click", () => editor.onSave());

  const saveAsButton = document.getElementById("save-as-button");
  saveAsButton.addEventListener("click", () => editor.onSaveAs());

  const newButton = document.getElementById("new-button");
  newButton.addEventListener("click", () => {
    editor.textArea.value = "";
    editor.openFile = undefined;
    editor.setState(new CleanUnsaved());
  });

  document.addEventListener("contextmenu", (event) => {
    alert("Wanna steal my source code, huh!?");
    event.preventDefault();
    return false;
  });
});

function setStateLabel(value: string) {
  const stateLabel = document.getElementById("state-label");
  if (stateLabel) stateLabel.innerText = value;
}

function showFiles(files: string[], parentId: string) {
  const parent = document.getElementById(parentId);
  if (!parent) return;
  while (parent.firstChild) parent.removeChild(parent.firstChild);
  for (const file of files) {
    const item = document.createElement("li");
    const link = document.createElement("a");
    link.href = "#";
    link.innerText = file;
    item.appendChild(link);
    parent.appendChild(item);
    link.addEventListener("click", () => {
      const content = localStorage.getItem(file) || "";
      editor.openFile = file;
      editor.textArea.value = content;
      editor.setState(new CleanSaved());
    });
  }
}

function listFiles(): string[] {
  const files: string[] = [];
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key) files.push(key);
  }
  return files;
}
