

class NotImplementationException extends Error{
    constructor(){
        super('Método não implementado.');
    } 
}

class IDb{

    insert(entity){
       throw new NotImplementationException();
    }

    read(entity){
       throw new NotImplementationException();
    }

    update(id, entity){
       throw new NotImplementationException();
    }

    delete(id){
       throw new NotImplementationException();
    }
    
    isConnected(){
        throw new NotImplementationException();
    }

}

module.exports = IDb;