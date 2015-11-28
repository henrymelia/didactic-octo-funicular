CORE.create_module("search-box", function (sb) {
    var searchInputField,
        searchResetButton,
        searchButton;

    return {
        init : function () {
            /*
            Maybe search would be better if we do it
            listening to 'change' event on #search_input
            */
            
            searchInputField = sb.find('#search_input')[0];

            searchResetButton = sb.find('#quit_search');
            sb.addEvent(searchResetButton, "click", this.reset);

            searchButton = sb.find('#search_button');
            sb.addEvent(searchButton, "click", this.searchProducts);
        },
        destroy : function () {
            //sb.removeEvent(searchInputField, "change", this.searchProducts);
            sb.removeEvent(searchResetButton, "click", this.reset);
            sb.removeEvent(searchButton, "click", this.searchProducts);
            
            searchInputField = null;
            searchResetButton = null;
            searchButton = null;
        },
        reset : function () {
            searchInputField.value = '';

            sb.notify({
                    type : 'quit-search',
                    data : searchInputField.value
                });
        },
        searchProducts : function () {
            sb.notify({
                    type : 'perform-search',
                    data : searchInputField.value
                });
        }
    };
});

CORE.create_module("filters-bar", function (sb) {
    var filters;

    return {
        init : function () {
            filters = sb.find('a');
            sb.addEvent(filters, "click", this.filterProducts);
        },
        destroy : function () {
            sb.removeEvent(filters, "click", this.filterProducts);
            filters = null;
        },
        filterProducts : function (e) {
            sb.notify({
                    type : 'change-filter',
                    data : e.currentTarget.innerHTML
                });
        }
    };
});

CORE.create_module("product-panel", function (sb) {
    var products,
        shoppingCart;

    function eachProduct(fn) {
        var i = 0, product;
        for ( ; product = products[i++]; ) {
            fn(product);
        }
    }

    function addToCart(e) {
        var productAddedEl = e.currentTarget;
        
        sb.notify({
            type: 'add-to-products-cart',
            data: productAddedEl
        })
    }

    function reset() {
        eachProduct(function (product) {
            if (product.className === 'product-disabled') {
                product.className = '';
                sb.addEvent(product, 'click', addToCart);
            }
        });
    }

    return {
        init : function () {
            shoppingCart = sb.find('#shopping-cart')[0];

            this.updateProducts();
            
            sb.listen({
                'change-filter' : this.change_filter,
                'reset-filter'  : this.reset,
                'perform-search': this.search,
                'quit-search'   : this.reset
            });
        },
        destroy : function () {
            var that = this;
            eachProduct(function (product) {
                sb.removeEvent(product, 'click', addToCart);
            });
            sb.ignore(['change-filter', 'reset-filter', 'perform-search', 'quit-search']);
        },
        reset : reset,
        change_filter : function (filter) {
            reset();
            eachProduct(function (product) {
                if (product.getAttribute("data-8088-keyword").toLowerCase().indexOf(filter.toLowerCase()) < 0) {
                    product.className = 'product-disabled';
                    sb.removeEvent(product, 'click', addToCart);
                }
            });
        },
        search : function (query) {
            reset();
            query = query.toLowerCase();
            
            eachProduct(function (product) {
                if (product.getElementsByTagName('p')[0].innerHTML.toLowerCase().indexOf(query) < 0) {
                    product.className = 'product-disabled';
                    sb.removeEvent(product, 'click', addToCart);
                }
            });
        },
        updateProducts : function () {
            var productsList = sb.find('#products-list')[0];

            sb.getProductsViaAjax(function (productsResponse) {
                for (productIndex = 0; productIndex < productsResponse.length; productIndex++) {
                    currentProduct = productsResponse[productIndex];

                    currentProduct = sb.create_element('li', {
                        id: currentProduct.id,
                        'data-8088-keyword': currentProduct.keyword,
                        children: [
                            sb.create_element('img', {
                                'src': currentProduct.file
                            }),
                            sb.create_element('p', {
                                text: currentProduct.name
                            })
                        ]
                    });

                    sb.appendTo(currentProduct, productsList);
                }

                products = sb.find("li");

                eachProduct(function (product) {
                    sb.addEvent(product, 'click', addToCart);
                });
            });
        }
    };
});

CORE.create_module("shopping-cart", function (sb) {
    var productsToBuyList;

    function remove(ev) {
        sb.removeElement(ev.currentTarget);
    }

    return {
        init: function () {
            productsToBuyList = sb.find('#to-buy-list')[0];

            sb.listen({
                'add-to-products-cart' : this.add
            });
        },
        destroy: function () {
            productsToBuyList = null;
        },
        add: function (el) {
            var productsToBuy = sb.find('li'),
                qty_updated = false;

            // Let's see if the product has been already added.
            for (i = 0; i < productsToBuy.length; i++) {
                if (productsToBuy[i].id === el.id) {
                    qty = productsToBuy[i].getAttribute("data-qty");
                    qty = parseInt(qty);

                    productsToBuy[i].setAttribute("data-qty", ++qty);
                    productsToBuy[i].children[2].innerHTML = 'x ' + qty;

                    qty_updated = true;
                    break;
                }
            }

            // If the product isn't in the cart already.
            if (!qty_updated) {
                productAdded = sb.create_element('li', {
                    id: el.id,
                    'data-qty': 1,
                    children: [
                        sb.create_element('span', {
                            'class': 'product_name',
                            text: el.children[1].innerHTML
                        }),
                        sb.create_element('span', {
                            'class': 'price'
                        }),
                        sb.create_element('span', {
                            'class': 'product_qty',
                            text: 'x 1'
                        })
                    ]
                });

                sb.prependTo(productAdded, productsToBuyList);
                sb.addEvent(productAdded, "click", remove);
            }
        }
    };
});

CORE.start_all();
