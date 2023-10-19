const fs = require('fs-extra')
const zip = require('zip-local')
const path = require('path')
const os = require('os')
const { shell } = require('electron')



document.querySelector('.save-backup').addEventListener('click', ()=>{
    saveBackup()
})

document.querySelector('.open-backup').addEventListener('click', ()=>{
    openBackupPaste()
})

document.querySelector('.backup').addEventListener('click', ()=>{
    openBackup()
})

const clientsPaste = path.join(__dirname, '..', 'Clientes FiadoAPP')

const clientsZip = path.join(os.homedir(), 'Documentos', 'Clientes FiadoAPP.zip')


function saveBackup() {

  document.querySelector('.container-alert-2').classList.remove('hide')

  document.querySelector('.exit2').addEventListener('click', ()=>{

    document.querySelector('.container-alert-2').classList.add('hide')}

  )


  document.querySelector('.zip').addEventListener('click', ()=>{
    document.querySelector('.container-alert-2').classList.add('hide')
    shell.openPath(path.join(os.homedir(), 'Documentos'))

  zip.sync.zip(clientsPaste).compress().save(clientsZip)

  console.log(`Backup da pasta "${clientsPaste}" criado com sucesso em "${clientsZip}".`)

  })

}


function openBackupPaste(){
    shell.openPath(path.join(os.homedir(), 'Documentos', 'Clientes FiadoAPP'))
}


function openBackup() {
  ipcRenderer.send('open-dialog')
}

ipcRenderer.on('selected-folder', (event, paths) => {
    if (!paths || paths.length === 0) {
      console.log('Seleção de pasta cancelada.')
    } else {
      const folderPath = paths[0]
      // const pathDestiny = path.join(os.homedir(), 'Documentos', 'Clientes FiadoAPP')
      console.log(path.basename)
      console.log(path)
      if (path.basename(folderPath) !== 'Clientes FiadoAPP'){
        alert('Essa não é uma pasta de Backup válida. =(')
        return
      }

      // if(folderPath === pathDestiny){
      //   return alert('A pasta selecionada é sua pasta "Clientes FiadoAPP" atual!')
      // }

      document.querySelector('.container-alert-1').classList.remove('hide')

      document.querySelector('.exit').addEventListener('click',()=>{
        document.querySelector('.container-alert-1').classList.add('hide')
        return
      })

      document.querySelector('.confirm').addEventListener('click',()=>{
  
        if (path.basename(folderPath) === 'Clientes FiadoAPP') {
          try {
            fs.removeSync(clientsPaste) 
            fs.moveSync(folderPath, clientsPaste) 
    
            console.log(`A pasta "Clientes FiadoAPP" foi movida e substituiu ${clientsPaste}`)
            document.querySelector('.container-alert-1').classList.add('hide')
            console.log('Backup feito com sucesso!')
          } catch (error) {
            console.error('Erro ao mover a pasta:', error)
          }
        } else {
          console.log('O nome da pasta selecionada não é "Clientes FiadoAPP".')
          document.querySelector('.container-alert-1').classList.add('hide')
          alert('Algo deu errado... =(')
        }
      })
    }
  })
