import { observer } from "mobx-react-lite";
import { FC, useMemo } from "react";
import { getDb } from "./db/db";
import { Note } from "./models/note";
import { NoteStore } from "./models/note-store";

/* ------------------------------- Application ------------------------------ */

const App = observer(() => {
  const noteStore = useMemo(() => new NoteStore({}), []);

  return <Layout noteStore={noteStore} />;
});

const Layout: FC<{ noteStore: NoteStore }> = observer(({ noteStore }) => {
  return (
    <div className="flex h-screen">
      <div className="w-64 bg-gray-100 text-gray-800 p-4">
        <Sidebar noteStore={noteStore} />
      </div>

      <div className="flex-1 p-4">
        {noteStore.selectedNote && <Editor note={noteStore.selectedNote} />}
      </div>
    </div>
  );
});

/* --------------------------------- Sidebar -------------------------------- */

const Sidebar: FC<{ noteStore: NoteStore }> = observer(({ noteStore }) => {
  const testDb = async () => {
    const db = await getDb();
    const result = await db.selectFrom("notes").selectAll().execute();

    console.log("result getting notes:", result);
  };

  return (
    <>
      <div className="flex space-x-2">
        <Button label="+ Note" onClick={() => noteStore.createTestingNote()} />

        <Button label="Test DB" onClick={() => testDb()} />
      </div>

      <ul className="space-y-1">
        {noteStore.notes.map((note, index) => (
          <li
            key={index}
            className={`p-2 cursor-pointer rounded-lg ${
              noteStore.selectedNote === note
                ? "bg-gray-200"
                : "hover:bg-gray-200"
            }`}
            onClick={() => noteStore.setSelectedNote(note)}
          >
            {note.subject}
            <em className="block opacity-60">{note.line}</em>
          </li>
        ))}
      </ul>
    </>
  );
});

const Button: FC<{ label: string; onClick: () => void }> = ({
  label,
  onClick,
}) => {
  return (
    <button
      onClick={onClick}
      className="mb-4 px-4 py-2 border border-blue-500 text-blue-500 rounded-lg flex items-center justify-center hover:bg-blue-500 hover:text-white transition-colors"
    >
      {label}
    </button>
  );
};

/* --------------------------------- Editor --------------------------------- */

const Editor: FC<{ note: Note }> = observer(({ note }) => {
  return (
    <textarea
      className="w-full h-full p-2 bg-gray-100 rounded"
      disabled
      value={note.document}
    ></textarea>
  );
});

export default App;
