angular.module('sapioCart', [])
  .directive('cartCount', function(localStorageService) {
    return {
      link: function(scope, element, attrs) {
        var count = 0;

        if(localStorageService.get('cart')) {
          count = localStorageService.get('cart').items.length;
        }

        element.text(count);

        scope.$on("LocalStorageModule.notification.setitem", function (key, newVal, type) {
          element.text(JSON.parse(newVal.newvalue).items.length);
        });
      }
    }
  })
  .directive('cartTotal', function(localStorageService) {
    return {
      link: function(scope, element, attrs) {
        var total = 0;

        if (localStorageService.get('cart')) {
          total = localStorageService.get('cart').total;
        }

        element.text(total);

        scope.$on("LocalStorageModule.notification.setitem", function (key, newVal, type) {
          element.text(JSON.parse(newVal.newvalue).total);
        });
      }
    }
  })
  .directive('addToCart', function(localStorageService) {
    return {
      link: function(scope, element, attrs) {
        var cart = {
          items: [],
          count: 0,
          total: 0,
        };

        element.bind('click', function() {
          var updatedCart = updateCart(localStorageService.get('cart') || cart, {
            id: attrs.productId,
            price: attrs.productPrice
          });

          localStorageService.set('cart', updatedCart);
        });
      }
    }
  })
  .directive('removeItem', function(localStorageService) {
    return {
      link: function(scope, element, attrs) {
        element.bind('click', function() {
          var updatedCart = removeFromCart(localStorageService.get('cart'), {
            index: attrs.index,
          });

          localStorageService.set('cart', updatedCart);
        });
      }
    }
  })
  .service('cartService', cartService)

function updateCart(cart, newItem) {
  cart.items.push(newItem);

  var total = 0;

  cart.items.forEach(function(item) {
    total += parseFloat(item.price);
  });

  cart.count = cart.items.length;
  cart.total = total.toFixed(2);

  return cart;
}

function cartService(localStorageService, $rootScope) {
  var items = [],
    count = 0,
    total = 0;

  this.count = function() {
    return count;
  }

  this.total = function() {
    return total;
  }

  this.items = function() {
    return items;
  }

  this.summary = function() {
    return {
      items: items,
      count: count,
      total: total
    };
  }
}

function removeFromCart(cart, index) {
  cart.items.splice(index.index, 1);

  var total = 0;

  cart.items.forEach(function(item) {
    total += parseFloat(item.price);
  });

  cart.count = cart.items.length;
  cart.total = total.toFixed(2);

  return cart;
}
