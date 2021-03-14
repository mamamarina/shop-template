const basketCounter  = document.querySelector('.page-header__cart-counter');
const container = document.querySelector('.content-container');

let counter = 0;
let price = 0;

function clickHandler(e) {
    let target = e.target;

  if(target && target.classList.contains('item-actions__cart')){
      basketCounter.innerHTML = `${++counter}`;
      if (counter === 1) {
          basketCounter.style.display = 'block';
      }

    const mockData = +target
        .parentElement
        .previousElementSibling
        .innerHTML
        .replace(/^\$(\d+)\s\D+(\d+).*$/, '$1.$2');

        price = Math.round((price + mockData) * 100) / 100;
     
        let restoreHTML = target.innerHTML;

        target.innerHTML = `Added ${price.toFixed(2)} $`;
      
        target.disabled = true;
        container.removeEventListener('click', clickHandler);
    
    setTimeout(() => {
        target.innerHTML = restoreHTML;
        target.disabled = false;
        container.addEventListener('click', clickHandler);
    }, 2000);
  
  }
} 
container.addEventListener('click', clickHandler);