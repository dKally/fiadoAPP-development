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


setInterval(() => {
    if(homeScreen === true){
        document.addEventListener('keydown', (event)=>{
            if(event.key){
                document.querySelector('.welcome').classList.add('animation-hide')
                startLogin()

                homeScreen = false
            }
        })
    }
}, 4000);


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
            divRegister.classList.add('animation-show')

            document.querySelector('.register-title').classList.add('sign-in-title-animation')
            document.querySelector('.register-div-1').classList.add('sign-in-div-1-animation')
            document.querySelector('.register-div-2').classList.add('sign-in-div-2-animation')
            document.querySelector('.register-div-3').classList.add('sign-in-div-1-animation')
            document.querySelector('.send-register').classList.add('send-login-animation')
          
            document.querySelector('.send-register').addEventListener('click',()=>{
            const userName = document.querySelector('.name-register').value
            const password = document.querySelector('.password-register').value
            const passwordConfirm = document.querySelector('.password-confirm-register').value
    
            console.log(userName, password, passwordConfirm)

            if(!password || !passwordConfirm || userName === ''){
                return console.log(password, userName, passwordConfirm)
            }
    
            if(password !== passwordConfirm){
                const alertPassword = document.querySelector('.alert-password')


                alertPassword.classList.remove('hide')
                alertPassword.classList.add('animation-alert-1')


                document.querySelector('.close-alert-password').addEventListener('click',()=>{
                    alertPassword.classList.add('animation-alert-2')
                    setTimeout(() => {
                        alertPassword.classList.remove('animation-alert-2')
                        alertPassword.classList.add('hide')

                    }, 500);
                })
            }
            else{
                const user = `{ "user":{ "userName": "${userName}", "password": "${password}" }}`
    
                
                console.log(user)
    
                fs.writeFile(userJSON, user, 'utf8', (error)=>{
                    if(error){
                        console.log(error)
                    }else{
                        console.log('Usuário criado com sucesso!')
                        console.log(document.querySelector('.user-created'))
                        document.querySelector('.user-created').classList.remove('hide')


                        divRegister.classList.add('animation-hide')
                        setTimeout(() => {
                            divRegister.classList.add('hide')
                            divRegister.classList.remove('animation-hide')
                        }, 1000)

                        document.querySelector('.user-created').classList.remove('hide')
                        document.querySelector('.btn-registred').addEventListener('click', ()=>{
                            document.querySelector('.user-created').classList.add('animation-hide-1')
                            setTimeout(() => {
                                window.location.href = appHtml
                            }, 500)
                        })

                    }
                })
    
            }
          })
        }
        else{
            //Fazendo login
            document.querySelector('.sign-in').classList.remove('hide')
            // document.querySelector('.sign-in').classList.remove('animation-show')
            document.querySelector('.sign-in-title').classList.add('sign-in-title-animation')
            document.querySelector('.sign-in-div-1').classList.add('sign-in-div-1-animation')
            document.querySelector('.sign-in-div-2').classList.add('sign-in-div-2-animation')
            document.querySelector('.send-login').classList.add('send-login-animation')

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
                        document.querySelector('.password-login').value = ''
                        const alertLogin = document.querySelector('.alert-login')

                        if(!alertLogin.classList.contains('hide')){
                            alertLogin.classList.add('animation-alert-3')
                            setTimeout(() => {
                                alertLogin.classList.remove('animation-alert-3') 
                                alertLogin.classList.add('animation-alert-2')
                                setTimeout(() => {
                                    alertLogin.classList.add('hide') 
                                    alertLogin.classList.remove('animation-alert-2') 
                                    console.log('teste2')
                                }, 500);
                            }, 2000);
                        }

                        alertLogin.classList.remove('hide')
                        alertLogin.classList.add('animation-alert-1')
                        document.querySelector('.alert-login-close').addEventListener('click',()=>{
                            alertLogin.classList.add('animation-alert-2')
                            console.log('teste1')
                            setTimeout(() => {
                                alertLogin.classList.add('hide') 
                                alertLogin.classList.remove('animation-alert-2') 
                                console.log('teste2')
                            }, 500);

                        })
                    }
                })
            })
        }
    })
}

