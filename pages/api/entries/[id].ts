import mongoose from 'mongoose';
import type { NextApiRequest, NextApiResponse } from 'next'
import { db } from '../../../database';
import { Entry, IEntry} from '../../../models';

type Data = 
| { message: string }
| IEntry
| null

export default function handler(req: NextApiRequest, res: NextApiResponse<Data>) {
    const { id } = req.query;
    if(!mongoose.isValidObjectId( id )){
        return res.status(404).json({ message: 'Id no válido.' })
    }

    switch(req.method){
        case 'GET':
            return getEntryById( req, res )

        case 'PUT':
            return updateEntry( req, res );
        
        case 'DELETE':
            return deleteEntry( req, res );

        default:
            return res.status(200).json({ message: 'Endpoint no válido.' })

    }
}

const updateEntry = async( req: NextApiRequest, res: NextApiResponse<Data>  ) => {
    const { id } = req.query;

    await db.connect();

    const entryToUpdate = await Entry.findById( id );

    if ( !entryToUpdate ) {
        await db.disconnect();
        res.status(400).json({ message: 'No hay entrada con ese id.' })
    }

    const {
        description = entryToUpdate.description,
        status = entryToUpdate.status
    } = req.body;

    try {
        const updatedEntry = await Entry.findByIdAndUpdate(id, { description, status }, { runValidators: true, new: true }  );
        await db.disconnect();
        // updatedEntry?.description = description;
        // updatedEntry?.status = status;
        // updatedEntry?.save();
        return res.status(200).json( updatedEntry! )
    } catch (error: any) {
        console.log('error', error);
        await db.disconnect();
        return res.status(400).json({ message: error.errors.status.message } );
    }
}

const getEntryById = async( req: NextApiRequest, res: NextApiResponse<Data>  ) => {
    const { id } = req.query;
    console.log(id)

    await db.connect();

    const entry = await Entry.findById( id );
    
    if ( !entry ) {
        await db.disconnect();
        res.status(400).json({ message: 'No hay entrada con ese id.' })
    }

    await db.disconnect();
    return res.status(200).json( entry! )
}

const deleteEntry = async( req: NextApiRequest, res: NextApiResponse<Data>  ) => {
    const { id } = req.query;
    console.log(id)

    await db.connect();

    const entry = await Entry.findByIdAndDelete( id );
    
    if ( !entry ) {
        await db.disconnect();
        res.status(400).json({ message: 'No hay entrada con ese id.' })
    }

    await db.disconnect();
    return res.status(200).json( entry! )
}