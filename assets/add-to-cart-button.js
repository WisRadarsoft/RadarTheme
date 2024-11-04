document.addEventListener('DOMContentLoaded', function () {
  const addToCartButtons = document.querySelectorAll('.button-add-to-cart');

  addToCartButtons.forEach((button) => {
    button.addEventListener('click', function (event) {
      event.preventDefault();

      const loading = this.querySelector('.loading__spinner');
      const variantId = this.getAttribute('data-variant-id');

      this.classList.add('disable');
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
        .then((data) => {})
        .catch((error) => {})
        .finally(() => {
          this.classList.remove('disable');
          loading.classList.add('hidden');
        });
    });
  });
});
