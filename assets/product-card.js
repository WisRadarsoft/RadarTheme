document.querySelectorAll('.product-item-card').forEach(function () {
  const button_add_to_cart = this.querySelector('.button-add-to-cart');
  const product_item_media = this.querySelector('.product-item-media img');
  const product_item_price = this.querySelector('.price-item');

  const encodedData = this.getAttribute('data-variants');
  if (encodedData) {
    const jsonString = atob(encodedData);
    const variants = JSON.parse(jsonString);

    this.querySelectorAll('input[name^="option_"]').forEach(function (optionInput) {
      optionInput.addEventListener('change', function () {
        const selectedOptions = [...this.querySelectorAll('input[name^="option_"]:checked')].map(function (input) {
          return input.value;
        });
        const matchedVariant = variants.find(function (variant) {
          return variant.options.every(function (opt, index) {
            return opt === selectedOptions[index];
          });
        });

        if (matchedVariant) {
          button_add_to_cart.setAttribute('data-variant-id', matchedVariant.id);
          product_item_price.innerHTML = matchedVariant.price;

          if (matchedVariant.featured_image) {
            // product_item_media.srcset = matchedVariant.featured_image;
            product_item_media.src = matchedVariant.featured_image;
          }

          if (matchedVariant.available === false) {
            button_add_to_cart.classList.add('disable');
          } else {
            button_add_to_cart.classList.remove('disable');
          }
        }
      });
    });
  }
});
