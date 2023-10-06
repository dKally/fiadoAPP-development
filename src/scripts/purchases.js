const util = require('util');
const readFile = util.promisify(fs.readFile);

console.log(currentClientPath)

let seller
let item
let value


function getFormattedDateTime(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    const seconds = String(date.getSeconds()).padStart(2, '0');
  
    const formattedDateTime = `${day}-${month}-${year} ${hours}:${minutes}:${seconds}`;
    return formattedDateTime;
}


const purchaseFilePath = path.join(currentClientPath, 'Compras.json')
const paymentFilePath = path.join(currentClientPath, 'Pagamentos.json')
const totalPriceElement = document.getElementById('total-price')


document.querySelector('#new-purchase').addEventListener('click', ()=>{
    newPurchase()
})

function newPurchase(){
    seller = document.querySelector('#seller').value
    item = document.querySelector('#item').value
    value = document.querySelector('#value').value
    if (seller.trim() === '' || item.trim() === '' || value.trim() === '') {
        alert('Por favor, preencha todos os campos.');
        return;
      }

        console.log(seller)
        console.log(item)
        console.log(value)
    
 
    
        const currentDate = new Date();
        const formattedDateTime = getFormattedDateTime(currentDate);

        const purchase = {
            seller: seller,
            item: item,
            value: parseFloat(value).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
            dateTime: formattedDateTime
        }
    
    
    
        fs.readFile(purchaseFilePath, 'utf8', (error, data) => {
            if (error) {
                const purchases = [purchase]
                fs.writeFile(purchaseFilePath, JSON.stringify(purchases), 'utf8', (error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('Compra registrada com sucesso!')
                        updatePurchases()
                        document.querySelector('#seller').value = ''
                        document.querySelector('#item').value = ''
                        document.querySelector('#value').value = ''
                    }
                })
            } else {
                const purchases = JSON.parse(data);
                purchases.push(purchase);
                fs.writeFile(purchaseFilePath, JSON.stringify(purchases), 'utf8', (error) => {
                    if (error) {
                        console.error(error)
                    } else {
                        console.log('Compra registrada com sucesso!')
                        updatePurchases()
                        document.querySelector('#seller').value = ''
                        document.querySelector('#item').value = ''
                        document.querySelector('#value').value = ''
                    }
                })
            }

        })
        setTimeout(()=> {
          updatePayments()
        }, 1000)
        
}

function updatePurchases(){
    const purchaseList = document.getElementById('purchase-list')
    document.querySelector('.purchases').classList.add('hide')
    
    purchaseList.innerHTML = ''
    fs.readFile(purchaseFilePath, 'utf8', (error, data) => {
        if (error) {
          console.log('Não existe compras no momento')
          return
        }
        document.querySelector('.purchases').classList.remove('hide')
        console.log(data)
      
        const purchases = JSON.parse(data);
        purchases.forEach((purchase) => {
            const listItem = document.createElement('li');
            listItem.innerHTML = `<span id='span-1'>Vendedor: ${purchase.seller}</span> <span id='span-2'>Item(s): ${purchase.item}</span> <span id='span-3'>Data/Hora: ${purchase.dateTime}</span> <span id='span-4'>Valor Total: ${purchase.value}</span>`
            purchaseList.appendChild(listItem);
        })
      
        calculateTotalPrice(purchases)
      })
}

setTimeout(()=> {
  updatePurchases()
}, 500)


function calculateTotalPrice(purchases) {
    let totalPrice = 0;
    purchases.forEach((purchase) => {
      const numericValue = parseFloat(purchase.value.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
      totalPrice += numericValue;
    })
  
    const formattedTotalPrice = totalPrice.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    });
  
    totalPriceElement.textContent = `Valor Total das Compras: ${formattedTotalPrice}`
}

document.querySelector('.pay').addEventListener('click', ()=>{
  document.querySelector('.payOff').classList.remove('hide')
  document.querySelector('.pay-off-confirm').addEventListener('click', ()=>{
    document.querySelector('.payOff').classList.add('hide')
    payOff()
    console.log('Dívida quitada com sucesso!')
  })
  document.querySelector('.pay-off-exit').addEventListener('click', ()=>{
    document.querySelector('.payOff').classList.add('hide')
    console.log('Ação cancelada.')
  })
})


function payOff() {
  const historicFolderPath = path.join(currentClientPath, 'Historic')
  let sequenceNumber = 1

  fs.mkdir(historicFolderPath, { recursive: true }, (error) => {
    if (error) {
      console.error(error)
      return
    }

    function moveFiles() {
      const newPurchaseFilePath = path.join(historicFolderPath, `Compras_${sequenceNumber}.json`);
      const newPaymentFilePath = path.join(historicFolderPath, `Pagamentos_${sequenceNumber}.json`);

      fs.rename(purchaseFilePath, newPurchaseFilePath, (error) => {
        if (error) {
          console.error(error);
          updatePurchases();
          updatePayments()
          totalPriceElement.textContent = ''
          return;
        }

        fs.rename(paymentFilePath, newPaymentFilePath, (error) => {
          if (error) {
            console.error(error);
            updatePurchases();
            updatePayments()
            totalPriceElement.textContent = ''
            return;
          }

          console.log('Dívida quitada com sucesso!')
          setTimeout(()=> {
            updatePurchases()
          }, 500)
          
          setTimeout(()=> {
            updatePayments()
            let paymentAmountElement = document.querySelector('#payment-amount')
            let remainingBalanceElement = document.querySelector('#remaining-balance')
            paymentAmountElement.textContent = ''
            remainingBalanceElement.textContent = ''
          }, 1000)
          
          totalPriceElement.textContent = '';
        });
      });
    }

    function findAvailableSequenceNumber() {
      const purchaseFileName = `Compras_${sequenceNumber}.json`
      const paymentFileName = `Pagamentos_${sequenceNumber}.json`

      fs.readdir(historicFolderPath, (error, files) => {
        if (error) {
          console.error(error);
          return;
        }

        const existingPurchaseFiles = files.filter((file) => file.startsWith('Compras_'));
        const existingPaymentFiles = files.filter((file) => file.startsWith('Pagamentos_'));

        if (
          existingPurchaseFiles.includes(purchaseFileName) ||
          existingPaymentFiles.includes(paymentFileName)
        ) {
          sequenceNumber++
          findAvailableSequenceNumber()
        } else {
          moveFiles()
        }
      })
    }

    findAvailableSequenceNumber();
  })
}


document.querySelector('#submit-payment').addEventListener('click', ()=>{
    submitPayment()
})

function submitPayment() {
    const paymentInput = document.querySelector('#payment');
    const paymentValue = parseFloat(paymentInput.value.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
  
    if (isNaN(paymentValue) || paymentValue <= 0) {
      alert('Digite um valor válido para o pagamento.')
      return;
    }
  
    const currentDate = new Date()
    const formattedDateTime = getFormattedDateTime(currentDate)
  
    const payment = {
      payment: parseFloat(paymentValue).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' }),
      dateTime: formattedDateTime,
    }
    

    fs.readFile(paymentFilePath, 'utf8', (error, data) => {
      if (error) {
          let payments = [payment]
          fs.writeFile(paymentFilePath, JSON.stringify(payments), 'utf8', (error) => {
              if (error) {
                  console.error(error)
              } else {
                  console.log('Pagamento registrado com sucesso!')
                  updatePayments()
                  paymentInput.value = ''
              }
          })
      } else {
          let payments = JSON.parse(data)

          console.log(payment)
          payments.push(payment);
          fs.writeFile(paymentFilePath, JSON.stringify(payments), 'utf8', (error) => {
              if (error) {
                  console.error(error)
              } else {
                  console.log('Pagamento registrado com sucesso!')
                  updatePayments()
                  paymentInput.value = ''
              }
          })
      }

  })
}


async function updatePayments() {
  const paymentAmountElement = document.getElementById('payment-amount')
  const remainingBalanceElement = document.getElementById('remaining-balance')

  document.querySelector('#payment-list').classList.add('hide')
  document.querySelector('#payment-amount').classList.add('hide')
  document.querySelector('#remaining-balance').classList.add('hide')


  const paymentsList = document.getElementById('payment-list')
  paymentsList.innerHTML = ''

  try {
    const data = await readFile(paymentFilePath, 'utf8')
    console.log(data)

    document.querySelector('#payment-list').classList.remove('hide')
    document.querySelector('#payment-amount').classList.remove('hide')
    document.querySelector('#remaining-balance').classList.remove('hide')


      
        const payments = JSON.parse(data)

        payments.forEach((payments) => {
            const listItem = document.createElement('li')
            listItem.innerHTML = `<span id='span-1'>Valor Pago: ${payments.payment}</span> <span id='span-2'>Data/Hora: ${payments.dateTime}</span>`
            paymentsList.appendChild(listItem)
        })

        const totalPayment = payments.reduce((acc, curr) => {
          const paymentValue = parseFloat(curr.payment.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
          return acc + paymentValue;
        }, 0)
    
        const formattedPayment = totalPayment.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })
        
        paymentAmountElement.textContent = `Valor Total Pago: R$ ${formattedPayment}`
        
        const purchasesTotalPrice = parseFloat(totalPriceElement.textContent.replace(/[^\d.,]/g, '').replace(/\./g, '').replace(',', '.'))
        const remainingBalance = purchasesTotalPrice - totalPayment
        
        const formattedRemainingBalance = remainingBalance.toLocaleString('pt-BR', {
          minimumFractionDigits: 2,
          maximumFractionDigits: 2,
        })

        setTimeout(()=> {
          remainingBalanceElement.textContent = `Saldo Restante: R$ ${formattedRemainingBalance}`
        }, 500)
        
        console.log(formattedRemainingBalance)
    console.log(data)
  } catch (error) {

    console.log('Não existe pagamentos no momento')
    return
  }
}


setTimeout(()=> {
  updatePayments()
}, 1000)


