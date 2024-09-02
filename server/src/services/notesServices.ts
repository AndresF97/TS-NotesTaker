import fs from "node:fs/promises";
import { v4 as uuidv4 } from "uuid";


class Notes {
    title: string;
    text: string;
    id: string;
    constructor(id: string, title: string, text: string) {
        this.title = title
        this.id = id
        this.text = text
    }

}

class NotesServices {
    private async read() {
         const data  = await fs.readFile("db/db.json", {
            flag: 'a+',
            encoding: "utf-8"
        })
        return JSON.parse(data)
    }
    private async write(notes: Notes[]) {
        return await fs.writeFile('db/db.json', JSON.stringify(notes, null, '\t'))
    }
    async getNotes() {
        let allNotes: Notes[] = [];
        const data = await this.read()
        allNotes = allNotes.concat(data)
        return allNotes

    }
    async creatNotes(data:Notes) {
        let message:string;
        let {title, text} = data 
        let allNotes= await this.read()
        allNotes.push({
            title:title,
            text:text,
            id:uuidv4()
        })
        try{
            await this.write(allNotes)
            message = 'success'
        }catch(err){
            message = 'could not create note'
        }
        return message
    }
    async deleteNotes(id:string) {
        const allNotes = await this.getNotes()
        let message:string;
        allNotes.filter((note)=> note.id !== id)
        try{
            await this.write(allNotes)
            message = "Success"
        }catch{
            message = "Could not delete note"
        }
        return message
    }

}

export default new NotesServices()