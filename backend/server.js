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

app.listen (port,()=>{
    console.log(`servidor rodando https://localhost:${port}`)
})
