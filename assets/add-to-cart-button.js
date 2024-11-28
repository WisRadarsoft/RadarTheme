document.addEventListener('DOMContentLoaded', function () {
  // Get mini cart count element
  const cartCount = document.querySelector('.cart-count');

  // Add to cart button
  const addToCartButtons = document.querySelectorAll('.button-add-to-cart');
  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const loading = this.querySelector('.loading__spinner');
      const variantId = this.getAttribute('data-variant-id');

      // this.classList.add('disable');
      addToCartButtons.forEach((btn) => btn.classList.add('disable'));
      loading.classList.remove('hidden');

      fetch('/cart/add.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          id: variantId,
          quantity: 1,
        }),
      })
        .then((response) => response.json())
        .then((data) => {
          return fetch('/cart.js', {
            method: 'GET',
            headers: {
              'Content-Type': 'application/json',
              'X-Requested-With': 'XMLHttpRequest',
            },
          });
        })
        .then((response) => response.json())
        .then((cart) => {
          // update mini cart items
          cartCount.textContent = cart.item_count;
          updateMiniCart(cart);
        })
        .catch((error) => {})
        .finally(() => {
          // this.classList.remove('disable');
          addToCartButtons.forEach((btn) => btn.classList.remove('disable'));
          loading.classList.add('hidden');
        });
    });
  });
});

class MiniCartRemoveButton extends HTMLElement {
  constructor() {
    super();

    const RemoveMiniCartButtons = document.querySelectorAll('.button-mini-cart-remove');

    this.addEventListener('click', (event) => {
      event.preventDefault();
      RemoveMiniCartButtons.forEach((btn) => btn.classList.add('disable'));
      const index = this.dataset.index;

      fetch('/cart/change.js', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Requested-With': 'XMLHttpRequest',
        },
        body: JSON.stringify({
          line: index,
          quantity: 0,
        }),
      })
        .then((response) => response.json())
        .then((cart) => {
          this.closest('.minicart-item').remove();
          const cartCount = document.querySelector('.cart-count');

          cartCount.textContent = cart.item_count;
          updateMiniCart(cart);
        })
        .catch((error) => {})
        .finally(() => {
          RemoveMiniCartButtons.forEach((btn) => btn.classList.remove('disable'));
        });
    });
  }
}
customElements.define('mini-cart-remove-button', MiniCartRemoveButton);

function updateMiniCart(cart) {
  const miniCartItemList = document.querySelector('.minicart-item-list');
  const miniCartEmpty = document.querySelector('.minicart-empty');
  const currency_active = Shopify.currency.active;

  miniCartItemList.innerHTML = '';

  if (cart.items.length > 0) {
    let itemCount = 1;
    cart.items.forEach((item) => {
      console.log(item);
      const urlToRemove = `/cart/change?line=${item.key}&quantity=0`;
      let varinat = '';
      let variant_items = '';
      if (item.variant_title !== null) {
        item.options_with_values.forEach((variant) => {
          const variant_item = `<div class="variant-item"><span>${variant.name} :</span> ${variant.value}</div>`;
          variant_items += variant_item;
        });
        varinat = `<div class="variant">` + variant_items + `</div>`;
      } else {
        varinat = '';
      }
      let formattedPrice = formatMoney(item.price, currency_active);
      console.log(formattedPrice);
      const itemHTML = `
        <div class="minicart-item">
          <div class="item-image">
            <img src="${item.image}" alt="${item.title}" width="150" height="150">
          </div>
          <div class="item-info">
            <div class="item-title">
              <span class="qty">${item.quantity} x</span>
                ${item.title}
              </div>
            ${varinat}
            <div class="price">${formattedPrice}</div>
            <mini-cart-remove-button
              id="Remove-${itemCount}"
              data-index="${itemCount}"
            >
              <a
                href="${urlToRemove}"
                class="button button--tertiary button-mini-cart-remove"a
              >
                <span>Remove</span>
              </a>
            </mini-cart-remove-button>
          </div>
        </div>
      `;
      itemCount++;
      miniCartItemList.insertAdjacentHTML('beforeend', itemHTML);
    });

    miniCartEmpty.classList.add('hidden');
  } else {
    miniCartEmpty.classList.remove('hidden');
  }
}

function formatMoney(amount, currency = 'USD') {
  const formattedAmount = (amount / 100).toFixed(2);
  const parts = formattedAmount.split('.');
  let integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  let decimalPart = parts[1];

  if (currency === 'DKK') {
    integerPart = parts[0].replace(/\B(?=(\d{3})+(?!\d))/g, '.');
    decimalPart = parts[1].replace('.', ',');
    return `${integerPart},${decimalPart} DKK`;
  } else if (currency === 'EUR') {
    return `${integerPart},${decimalPart} €`;
  } else if (currency === 'USD') {
    return `${integerPart}.${decimalPart} USD`;
  } else {
    return `${integerPart}.${decimalPart} ${currency}`;
  }
}
