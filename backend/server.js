const express = require("express");
const fs = require("fs");       //file sytem
const path = require("path");        // caminho do arquivo do banco de dados
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express()
const port = 5001;

app.use(cors());
app.use(express.json());

//Criar uma string para renovar a chave de autenticação
const SECRET_KEY = "12345678910";

//Local onde está o arquivo do seu banco de dados
const localDados = path.join(__dirname,'data/usuarios.json');

//Função para ker os dados do arquivo
const consultarUsuarios=()=>{
    const data = fs.readFileSync(localDados,"utf-8");
    return JSON.parse(data);

}


//função para guardar dados no arquivo
const salvarUsuario=(users)=>{
    fs.writeFileSync(localDados, JSON.stringify(users, null, 2))
}

//rota para registrar o usuario
app.post("/register", async(req,res)=>{
    const {email,senha}= req.body;

    if(!email || !senha){
        return res.status(400).json({menssage: "Campos obrigatórios"})
    }
    const users= consultarUsuarios();
    if(users.find(user=>user.email == email)){
        return res.status(400).json({menssage:"Email já cadastrado no banco de dados"})
    }
    //criptografia a senha
    const hashSenha = await bcrypt.hash(senha,10)
    const novoUsuario = {id:Date.now(),email,senha:hashSenha}
    users.push(novoUsuario);
    salvarUsuario(users);
    res.status(200).json({message: "Usuário cadastrado com sucesso"})
})


 //rota login

app.post("/login", async(req,res)=>{
    const{email,senha}= req.body;
    const users = consultarUsuarios();
    const user = users.find(user=>user.email === email);

    if (!user){
        return res.status(400).json({message:"Senha inválida"})
    }

    //autentificação do  jwt
    const token=jwt.sign({id:user.id,email:user.email},SECRET_KEY,{expiresIn:"10m"});
    res.json({menssage: "Login realizado com sucesso",token})
})

//middleware que vai proteger as rotas da api e garantir que apenas usuários con tokens válidos possam acessar
const autenticaToken=(req, res, next)=>{
    const auth=req.headers['authorization'];
    const token = auth && auth.split(' ')[1];
    if(token == null) return res,sendStatus(401);

    jwt.verify(token, SECRET_KEY, (erro, user)=>{
        if(erro) return req.sendStatus(403)
            req.user=user;
            next();
    })
}

//Rota do Dashboard
app.get("/dashboard", autenticaToken, (res, req)=>{
res.json({message:"Acesso autorizado, Bem-vindo", user:req.user})
})


//Executando servidor na porta definida
app.listen (port,()=>{
    console.log(`servidor rodando http://localhost:${port}`)
})
