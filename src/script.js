const os = require('os');
const path = require('path');
const fs = require('fs');

function checkCreateClientesFolder() {
  const clientesFolderPath = path.join(__dirname, 'Clientes FiadoAPP');

  if (!fs.existsSync(clientesFolderPath)) {
    fs.mkdirSync(clientesFolderPath);
    console.log('Pasta "Clientes FiadoAPP" criada com sucesso!');
    console.log(clientesFolderPath)
  } else {
    console.log('Pasta "Clientes FiadoAPP" já existe.');
  }
}

checkCreateClientesFolder();


