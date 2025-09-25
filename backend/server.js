const express = require("express");
const fs = require("fs");       //file sytem
const path = require("path");        // caminho do arquivo do banco de dados
const bcrypt = require("bcrypt");
const jwt = require("jwt");
const cors = require("cors");

const app = exprsess()
const port = 5001

app.use(cors());
app.use(express.json());

//Criar uma string para renovar a chave de autenticação
const SECRET_KEY = "12345678910";

//Local onde está o arquivo do seu banco de dados
const localDados = path.join(__dirname,'data/usuario.json');

//Função para ker os dados do arquivo
const consultarUsuarios=()=>{
    const data = fs.readFileSync(localDados,"utf-8");
    return JSON.parse(data);

}


//função para guardar dados no arquivo
const salvarAruivos=(users)=>{
    fs.writeFileSync(localDados, JSON.stringify(user, null, 2))
}

//rota para registrar o usuario
app.post("/register", async(req,res)=>{
    const {email,senha}= req.body;

    if(!email || !senha){
        return res.status(400).json({menssage: "Campos obrigatórios"})
    }
    const user= consultarUsuarios();
    if(user.find(user=>user.email == email)){
        return res.status(400).json({menssage:"Email já cadastrado no banco de dados"})
    }
})
//criptografia a senha
 const hashSenha = await bcrypt.hash(senha,10)
 const novoUsuario = {id:Date.now,email,senha:hashSenha}
 user.push(novoUsuario);
 salvarUsuarios(user);
 res.status(200).json({message: "Usuário cadastrado com sucesso"})

 //rota login

app.post("/login", async(req,res)=>{
    const{email,senha}= req.body;
    const users = consultarUsuarios();
    const user = users.find(user=>user.email === email);

    if (!user){
        return res.status(400).json({message:"Senha inválida"})
    }

    //autentificação do  jwt
    const token=jwt.sing({id:user.id,email:user.email},SECRET_KEY,{expiresIn,"10m"});
    res.json({menssage: "Login realizado com sucesso",token})
})

//Executando servidor na porta definida
app.listen (port,()=>{
    console.log(`servidor rodando https://localhost:${port}`)
})
