const { ipcRenderer } = require('electron')

document.querySelector('.close').addEventListener('click', () => {
    ipcRenderer.send('close-window')
})

document.querySelector('.minimize').addEventListener('click', () => {
    ipcRenderer.send('minimize-window')
})