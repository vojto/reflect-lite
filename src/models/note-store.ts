import { action, computed, observable } from "mobx";
import { Model, model, modelAction, prop } from "mobx-keystone";
import { generate } from "random-words";
import { Note } from "./note";

@model("NoteStore")
export class NoteStore extends Model({
  notes: prop<Note[]>(() => []),
}) {
  @observable selectedNoteId: string | null = null;

  /* -------------------------------- Queries ------------------------------- */

  @computed
  get sortedNotes() {
    return this.undeletedNotes
      .slice()
      .sort((a, b) => b.createdAt - a.createdAt);
  }

  @computed
  get undeletedNotes() {
    return this.notes.filter((note) => !note.isDeleted);
  }

  /* ---------------------------- Creating notes ---------------------------- */

  @modelAction
  createTestingNote() {
    const subject = (generate(2) as string[]).join(" ");
    const document = (generate(30) as string[]).join(" ");

    const note = new Note({ subject, document });
    this.notes.push(note);
  }

  /* -------------------------- Handling selection -------------------------- */

  @action
  setSelectedNote(note: Note | null) {
    this.selectedNoteId = note?.id ?? null;
  }

  @computed
  get selectedNote() {
    return this.notes.find((note) => note.id === this.selectedNoteId);
  }
}
