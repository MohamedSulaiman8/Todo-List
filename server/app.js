const express=require('express');
const mysql=require('mysql');
const app=express();
const cors=require('cors');
const dotenv=require('dotenv')
dotenv.config();
const path=require('path')

const connection=mysql.createConnection(
    {host:'localhost',
    user:'root',
    password:process.env.PASSWORD,
    database:process.env.DATABASE
}
)

connection.connect((err)=>{
    if(err){
        console.log(err.message)
    }
    console.log('db '+connection.state)
})
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({extended:false})); 

app.use(express.static('../client'))
//create
app.post('/insert',(request,response)=>{
    const name=request.body.name;
    const dateAdded=new Date();
    try{
        const query="INSERT INTO data(name,date_added) values(?,?)";
        connection.query(query,[name,dateAdded],(err,res)=>{
            if(err){
                console.log(err)
                response.json({ success: false, error: 'Could not add file' });
            }
            else{
                // console.log(res.insertId)
                response.json({id:res.insertId,name:name,date:dateAdded})
            }
        })
    }
    catch(err){
        // console.log(err)
    }
})

//read
app.get('/getAll', (request, response) => {
    try {
        const query = 'SELECT * FROM data';
        connection.query(query, (err, res) => {
            if (err) {
                console.error(err);
                response.status(500).json({ success: false, error: 'Internal server error' });
            } else {
                response.json({ success: true, data: res });
            }
        });
    } catch (err) {
        // console.error(err);
        response.status(500).json({ success: false, error: 'Internal server error' });
    }
});



//update
app.patch('/update/:id',(request,response)=>{
    const date=new Date();
    // console.log(date)
    const query='Update data set name =?, date_added=? where id=? '
    connection.query(query,[request.body.name,date,request.body.id],(err,res)=>{
        try{
            if(err){
                response.status(500).json({success:false})
            }
            else{
                if(res.affectedRows===1){
                    response.json({success:true})
                }
                else{
                    response.json({success:false})
                }
            }
        }
        catch(err){
            response.status(500).json({ success: false, error: 'Internal server error' });
        }
    })
})




//delete
app.delete('/delete/:id',(request,response)=>{
    const query='DELETE from data where id=?';
    connection.query(query,[request.params.id],(err,res)=>{
        try{
            if(err){
                response.status(500).json({success:false})
            }
            else{
                if(res.affectedRows===1){
                    response.json({success:true})
                }
                else{
                    response.json({success:false})
                }
            }
        }
        catch(err){
            response.status(500).json({ success: false, error: 'Internal server error' });
        }
    })
})

//search
app.get('/search/:name',(request,response)=>{
    const query="Select * from data where name=?";
    const name=request.params.name;
    connection.query(query,[name],(err,res)=>{
        try{
            if (err) {
                // console.error(err);
                response.status(500).json({ success: false, error: 'Internal server error' });
            } else {
                response.json({ success: true, data: res });
            }
        }
        catch(err){
            response.status(500).json({ success: false, error: 'Internal server error' })
        }
    })
})

app.listen(process.env.PORT,()=>{console.log('app is running')});