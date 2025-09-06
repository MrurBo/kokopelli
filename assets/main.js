window.dataLayer = window.dataLayer || [];

function gtag() {
  dataLayer.push(arguments);
}
gtag('js', new Date());
gtag('config', 'G-3KP42Y69SS');

document.addEventListener('DOMContentLoaded', function () {
  if (window.location.pathname.startsWith('/products/')) {
    const pathParts = window.location.pathname.split('/');
    const productId = pathParts[pathParts.length - 1];
    const productName = document.title;
    const productPrice = document.querySelector('[data-price]')?.dataset.price || 25;

    // Track product page view
    gtag('event', 'view_item', {
      items: [{
        id: productId,
        name: productName,
        category: 'products',
        price: productPrice
      }]
    });

    // Track clicks
    const whatsapp = document.getElementById('whatsapp-link');
    if (whatsapp) {
      whatsapp.addEventListener('click', function () {
        gtag('event', 'select_item', {
          items: [{
            id: productId,
            name: productName,
            category: 'products',
            price: productPrice,
            channel: 'whatsapp'
          }]
        });
      });
    }

    const instagram = document.getElementById('instagram-link');
    if (instagram) {
      instagram.addEventListener('click', function () {
        gtag('event', 'select_item', {
          items: [{
            id: productId,
            name: productName,
            category: 'products',
            price: productPrice,
            channel: 'instagram'
          }]
        });
      });
    }
  }
});
