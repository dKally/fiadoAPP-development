const fs = require('fs')
const path = require('path')
const { setTimeout } = require('timers/promises')

const userJSON = path.join(__dirname, 'user.json')

fs.readFile(userJSON, 'utf8', (error, data)=>{
    if(error){
        console.log(error)
        return
    }

    console.log(data)
    const jsonObject = JSON.parse(data)
    const user = jsonObject.user

    if(user === ""){
      document.querySelector('.register').classList.remove('hide')
      
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
      })
    }
    else{
        document.querySelector('.sign-in').classList.remove('hide')
    }
})