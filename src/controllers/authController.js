const { query } = require("../db/db");
const jwt = require('jsonwebtoken')
const bycript = require('bcrypt')
const pool = ('../db/db.js')

async function login (req,res) {
    try {
    const {userName,password} = req.body;
    const [users] = await pool.query('Select * From usuarios WHERE userName =?',[userName])
    if (!users || users.length === 0) {
        res.status(500),json({
            message:'User not found',
            token:null
    });
    }
    const user = users[0];
    const passwordCheck = await bycript.compare(password,user.password);

        if(!passwordCheck){
            return res.status(401).json({
                message:'Usuario invalido',
                token:null
            })
        }

        const token  = jwt.sign({userId:user.id, userName:user.userName},'your_access',{expiresIn:'1h'});
        res.json({
            message:'Logged successfully',
            token
        })
    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: 'Error on server',
            token: null
        });

    }
  
  }


  module.exports = {
    login
  }