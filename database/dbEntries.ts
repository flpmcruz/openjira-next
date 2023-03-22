import { isValidObjectId } from 'mongoose';
import { Entry, IEntry } from '@/models';
import { db } from './';


export const getEntryById = async( id: string ): Promise<IEntry | null> => {

    if ( !isValidObjectId(id) ) return null;

    await db.connect();
    const entry = await Entry.findById(id).lean(); //lean() returns a plain javascript object with the minimum amount of data
    await db.disconnect();

    return JSON.parse( JSON.stringify(entry) ); //converts the object to a string and then back to an object (to remove the mongoose methods)
}