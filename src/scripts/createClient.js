
const os = require('os')
const path = require('path')
const fs = require('fs')

document.querySelector('.submit-btn').addEventListener('click', () => {
  sendForm();
})

const clientsPath = path.join(__dirname, '..', 'Clientes FiadoAPP')

let name
let lastName
let phone
let cpf

let clientFolderPath

function sendForm() {
    name = document.querySelector('#name').value
    console.log(name)
    lastName = document.querySelector('#last-name').value
    console.log(lastName)
    phone = document.querySelector('#phone').value
    if (phone.length !== 11 && phone.length !== 0) {
      alert('Telefone invalido!')
      return
    }
    console.log(phone)
    cpf = document.querySelector('#cpf').value
    if (cpf.length !== 11 && cpf.length !== 0) {
      alert('CPF invalido!')
      return
    }
    console.log(cpf)
    if(name == ''){
      return alert('Insira um Nome!')
    }
    if(lastName == ''){
      return alert('Insira um Sobrenome!')
    }
    
    createFolder()
}

function createFolder(){

    clientFolderPath = path.join(clientsPath, `${name} ${lastName}`)
    console.log(clientFolderPath)

 
    fs.mkdir(clientFolderPath, { recursive: true }, (error) => {
        if (error) {
          console.error(error)
        } else {
          console.log('Pasta do cliente criada com sucesso!')
          createRegistration()
        }
    });
}


function createRegistration(){
    const registerJSON = `
{
    "client":{
        "name": "${name}",
        "lastName": "${lastName}",
        "cpf": "${cpf}",
        "phone": "${phone}"
    }
}`
    const registrationFilePath = path.join(clientFolderPath, 'Cadastro.json');

    fs.writeFile(registrationFilePath, registerJSON, (error) => {
        if (error) {
          console.error(error);
        } else {
          console.log('JSON cadastro criado com sucesso!');

          redirectToClient();
        }
    });
}

function redirectToClient() {
  setTimeout(()=> {
    const clientHTMLPath = path.join(__dirname, '..', 'html', 'client.html')
    const queryParameters = `?currentClient=${encodeURIComponent(`${name} ${lastName}`)}`
    const redirectURL = `file://${clientHTMLPath}${queryParameters}`
    window.location.href = redirectURL
}, 500)

}
