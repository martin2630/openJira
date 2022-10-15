import mongoose, { mongo } from "mongoose";

const mongoConnection = {
    isConnected: 0,
}

export const connect = async () => {
    if (mongoConnection.isConnected){
        console.log('Ya estabamos conectados');
        return;
    }

    if (mongoose.connections.length > 0){
        console.log('Ya esta conectado');
        mongoConnection.isConnected = mongoose.connections[0].readyState;

        if(mongoConnection.isConnected === 1){
            console.log('usando conexión anterior');
            return;
        }

        await mongoose.disconnect();

    }

    await mongoose.connect( process.env.MONGO_URL || '' );
    mongoConnection.isConnected = 1;
    console.log('conectado a mongoDB', process.env.MONGO_URL);
}


export const disconnect = async () => {
    if (process.env.NODE_ENV === 'development') return;

    if (mongoConnection.isConnected !== 0) return;

    await mongoose.disconnect();
    mongoConnection.isConnected = 0;

    console.log('desconectado de mongoDB');
}
