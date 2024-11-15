document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.button-add-to-cart');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      // Get mini cart count
      const cartCount = document.querySelector('.cart-count');
      let count = parseInt(cartCount.textContent, 10);

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
          // update mini cart icon count
          count += 1;
          cartCount.textContent = count;

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

  function updateMiniCart(cart) {
    const miniCartItemList = document.querySelector('.minicart-item-list');
    const miniCartEmpty = document.querySelector('.minicart-empty');

    miniCartItemList.innerHTML = '';

    if (cart.items.length > 0) {
      cart.items.forEach((item) => {
        const itemHTML = `
          <div class="minicart-item">
            <div class="item-image">
              <img src="${item.image}" alt="${item.title}" width="150" height="150">
            </div>
            <div class="item-info">
              <div class="price"></div>
              <div class="qty">x ${item.quantity}</div>
              <div class="variant">
                <div class="variant-item">Size: ${item.variant_options[0]}</div>
                <div class="variant-item">Color: ${item.variant_options[1]}</div>
              </div>
            </div>
          </div>
        `;
        miniCartItemList.insertAdjacentHTML('beforeend', itemHTML);
      });

      miniCartEmpty.classList.add('hidden');
    } else {
      miniCartEmpty.classList.remove('hidden');
    }
  }
});
