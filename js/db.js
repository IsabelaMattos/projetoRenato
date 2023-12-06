import { openDB } from "idb";

let db;

window.addEventListener('DOMContentLoaded', async event =>{
    criarDB();
    document.getElementById('btnCadastrar').addEventListener('click', Cadastrar);
    document.getElementById('btnCarregar').addEventListener('click', listar);
});


async function criarDB(){
    try {
        db = await openDB('banco', 1, {
            upgrade(db, oldVersion, newVersion, transaction){
                switch  (oldVersion) {
                    case 0:
                    case 1:
                        const store = db.createObjectStore('localizacao', {
                            keyPath: 'nome'
                        });
                        store.createIndex('id', 'id');
                        listagem("banco de dados criado!");
                }
            }
        });
        listagem("banco de dados aberto!");
    }catch (e) {
        listagem('Erro ao criar/abrir banco: ' + e.message);
    }
}

async function Cadastrar() {
    let latitude = document.getElementById("latitude").value;
    let longitude = document.getElementById("longitude").value;
    let nome = document.getElementById("nome").value;
    let hours = document.getElementById("hours").value;
    let endereco = document.getElementById("endereco").value;
    const tx = await db.transaction('localizacao', 'readwrite');
    const store = tx.objectStore('localizacao');
    try {
        
        await store.add({endereco: endereco,latitude: latitude,hours:hours, nome: nome, longitude:longitude });
        await tx.done;
        limpar();
        alert('Local cadastrado com sucesso!')
        console.log('Registro adicionado com sucesso!');
      
    } catch (error) {
        console.error('Erro ao Cadastrar registro:', error);
        tx.abort();
    }
}





async function listar(){
    if(db == undefined){
        console.log("O banco de dados está fechado.");
    }
    const tx = await db.transaction('localizacao', 'readonly');
    const store = await tx.objectStore('localizacao');
    const lista = await store.getAll();
    if(lista){
        const listar = lista.map(local => {
            return `<div class="listando">
                   
                    <p>Nome: ${local.nome}</p>
                    <p>Horario de funcionamento: ${local.hours} </p>
                    <p>Endereço: ${local.endereco}</p>
                    <iframe src="http://maps.google.com/maps?q=${local.latitude},${local.longitude}&z=16&output=embed" frameborder="0" scrolling="no" ></iframe>
                            
                    
                 </div>`;
        });
        listagem(listar.join(' '));
    } 
}






function limpar() {
    document.getElementById("latitude").value = '';
    document.getElementById("longitude").value = '';
    document.getElementById("hours").value = '';
    document.getElementById("nome").value = '';
    document.getElementById("endereco").value = '';
}



function listagem(text){
    document.getElementById('info').innerHTML = text;
}

