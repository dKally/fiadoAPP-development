const fs = require('fs')
const path = require('path')
const { shell } = require('electron')

const linkElement = document.querySelector('.developer')
    linkElement.addEventListener('click', (event) => {
      event.preventDefault()
      const url = 'https://github.com/dKally'

      shell.openExternal(url)
})

const userJSON = path.join(__dirname, 'user.json')

const divRegister = document.querySelector('.register')
const appHtml = path.join(__dirname, '/src', '/index.html')

let homeScreen = true

if(homeScreen === true){
    document.addEventListener('keydown', (event)=>{
        if(event.key){
            document.querySelector('.welcome').classList.add('hide')
            startLogin()
        }
    })
}

function startLogin(){
    fs.readFile(userJSON, 'utf8', (error, data)=>{
        if(error){
            console.log(error)
            return
        }
    
        console.log(data)
        const jsonObject = JSON.parse(data)
        const user = jsonObject.user
    
        if(user === ""){
            // Criando usuário
            divRegister.classList.remove('hide')
          
            document.querySelector('.send-register').addEventListener('click',()=>{
            const userName = document.querySelector('.name-register').value
            const password = document.querySelector('.password-register').value
            const passwordConfirm = document.querySelector('.password-confirm-register').value
    
            console.log(userName, password, passwordConfirm)
    
            if(password !== passwordConfirm){
                document.querySelector('.alert-password').classList.remove('hide')
                setTimeout(() => {
                    document.querySelector('.alert-password').classList.add('hide')
                }, 5000);
            }
            else{
                const user = `{ "user":{ "userName": ${userName}, "password": ${userName} }}`
    
                
                console.log(user)
    
                fs.writeFile(userJSON, user, 'utf8', (error)=>{
                    if(error){
                        console.log(error)
                    }else{
                        console.log('Usuário criado com sucesso!')
                        console.log(document.querySelector('.user-created'))
                        document.querySelector('.user-created').classList.remove('hide')
                        document.querySelector('.btn-user-created').addEventListener('click', ()=>{
                            window.location.href = appHtml
                        })
                    }
                })
    
            }
          })
        }
        else{
            //Fazendo login
            document.querySelector('.sign-in').classList.remove('hide')
            fs.readFile(userJSON, 'utf8', (error, data)=>{
                if(error){
                    console.log(error)
                    return
                }
                
                console.log(data)
                const jsonObject = JSON.parse(data)
                const user = jsonObject.user
                const userName = String(user.userName)
                const password = String(user.password)
    
                console.log(userName, password)
    
                document.querySelector('.send-login').addEventListener('click', ()=>{
                    const answerUserName = document.querySelector('.name-login').value
                    const answerPassword = document.querySelector('.password-login').value
    
                    if(!answerPassword || answerUserName === ""){
                        return console.log('Preencha todos os campos!')
                    }
                    console.log(answerUserName, answerPassword)
    
                    if(answerUserName === userName && answerPassword === password){
                        
                        window.location.href = appHtml
                    }
                    else{
                        console.log('Senha errada!')
                        document.querySelector('.alert-login').classList.remove('hide')
                        setTimeout(() => {
                            document.querySelector('.alert-login').classList.add('hide')
                        }, 5000);
                    }
                })
            })
        }
    })
}

