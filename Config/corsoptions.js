const allowedlist = ['http://localhost:5173','http://127.0.0.1:5173']
module.exports = corsoptions ={
    origin: (origin, callback) => {
        if(allowedlist.indexOf(origin) !== -1 || !origin){
            callback(null, true)
        }else{
            callback(new Error('Not allowed by CORS'))
        }
    },credentials: true, optionsSuccessStatus: 200
}

