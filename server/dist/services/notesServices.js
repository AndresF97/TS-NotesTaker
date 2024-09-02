import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";
class Notes {
    constructor(id, title, text) {
        this.title = title;
        this.id = id;
        this.text = text;
    }
}
class NotesServices {
    async read() {
        const data = await fs.readFile("db/db.json", {
            flag: 'a+',
            encoding: "utf-8"
        });
        return JSON.parse(data);
    }
    async write(notes) {
        return await fs.writeFile('db/db.json', JSON.stringify(notes, null, '\t'));
    }
    async getNotes() {
        let allNotes = [];
        const data = await this.read();
        allNotes = allNotes.concat(data);
        return allNotes;
    }
    async creatNotes(data) {
        let message;
        let { title, text } = data;
        let allNotes = await this.read();
        allNotes.push({
            title: title,
            text: text,
            id: uuidv4()
        });
        try {
            await this.write(allNotes);
            message = 'success';
        }
        catch (err) {
            message = 'could not create note';
        }
        return message;
    }
    async deleteNotes(id) {
        let allNotes = await this.read();
        let message;
        allNotes = allNotes.filter((note) => note.id !== id);
        console.log(id);
        console.log(allNotes);
        try {
            await this.write(allNotes);
            message = "Success";
        }
        catch {
            message = "Could not delete note";
        }
        return message;
    }
}
export default new NotesServices();
