const fs = require('fs')
const path = require('path')
const os = require('os')

const clientsPath = path.join(os.homedir(), 'Documentos', 'Clientes FiadoAPP')
const container = document.getElementById('folder-list')
const searchInput = document.getElementById('search-input')

fs.readdir(clientsPath, (error, files) => {
  if (error) {
    console.error(error)
    return;
  }

  let folderNames = files.filter((file) => {
    const filePath = path.join(clientsPath, file)
    return fs.lstatSync(filePath).isDirectory()
  })

  const updateFolderList = () => {
    const searchValue = searchInput.value.toLowerCase()
    const filteredFolders = folderNames.filter((folderName) => {
      return folderName.toLowerCase().includes(searchValue)
    })

    displayFolders(filteredFolders)
  }

  const displayFolders = (folders) => {
    container.innerHTML = ''

    folders.forEach((folderName) => {
      const paragraph = document.createElement('p')
      paragraph.textContent = folderName
      container.appendChild(paragraph)

      paragraph.addEventListener('click', () => {
        window.location.href = `client.html?folder=${encodeURIComponent(folderName)}`
      })
    })
  }

  displayFolders(folderNames)

  searchInput.addEventListener('input', updateFolderList)
})
