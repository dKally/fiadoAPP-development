const divListClient = document.querySelector('#folder-list')

setTimeout(() => {
    if(divListClient.children.length === 0){
        document.querySelector('.no-clients').classList.remove('hide')
        document.querySelector('.text-no-client').classList.remove('hide')
        document.querySelector('.btn-no-clients').classList.remove('hide')
    }
}, 500)



