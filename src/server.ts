import express, { Application, Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import dotenv from 'dotenv';
const app: Application = express();
// Middleware for parsing application/json
app.use(express.json());

// Middleware for parsing application/x-www-form-urlencoded
app.use(express.urlencoded({ extended: true }));

const { env } = process;
dotenv.config({
  path: path.resolve(
      __dirname,
      `./env.${process.env.NODE_ENV ? process.env.NODE_ENV : "local"}`
    ),
});
var corsOptions = {
    origin: '*',
    credentials:true,
    optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
  }
app.use(cors(corsOptions)).use((req,res,next)=>{
    console.log(req);
    res.setHeader('Access-Control-Allow-Origin',"*");
    next();
});
app.get('/', (req: Request, res: Response) => {
    res.send('Hello World with TypeScript and Express!');
});

import DbService from './dbService';
const db= DbService.getDbServiceInstance();
app.post('/getData',async(request,response) => {
    //console.log('request----',request);
    const {type="mssql",query="select * from p_Room"} = request.body;
    
    try {
        if(type==="mssql"){
            const result = await db.mssqlGet(query)
            response.json({data:result})
        }else{
            db.mysqlGet(query).then((res:any)=>{
                //if(!res.success) console.log(res)
            });
        }
        
        //response.json({data:type,query:query})
    }catch(err:any){
        console.error('Database polling error:', err);
        response.json({data:err})
    }

});
app.listen(env.PORT, () => {
    console.log(`Server running on http://localhost:${env.PORT}`);
});