
function Products(image, price, title, count) {

    this.image = image;
    this.price = price;
    this.title = title;
    this.count = count


}


function ProductList() {
    this.records = [];
    this.add = function (image, price, title, count) {
        const { records } = this;
        let productExit = false;
        const record = new Products(image, price, title, count);
        records.forEach(item => {
            if (item.title === record.title) {
                productExit = true
                item.count += 1
            }
        })
        if (!productExit) {
            records.push({ ...record })
        }

    }

    this.remove = function (title) {
        const { records } = this
        const index = records.findIndex(key => key.title === title);
        if (index !== -1) { // If statement is a better choice.
            records.splice(index, 1)
        }

    }

    this.totalPrice = function () {
        const { records } = this
        return records.reduce((sum, current) => sum + current.price * current.count, 0)

    }

}


function ElementBuilder(name) {
    this.element = document.createElement(name);

    this.text = function (text) {
        this.element.textContent = text;
        return this;
    }

    this.appendTo = function (parent) {
        if (parent instanceof ElementBuilder) {
            parent
                .build()
                .appendChild(this.element);
        }
        else {
            parent.appendChild(this.element);
        }
        return this;
    }

    this.className = function (className) {
        this.element.className = className;
        return this;
    }

    this.onclick = function (fn) {
        this.element.onclick = fn;
        return this;
    }

    this.build = function () {
        return this.element;
    }

    // What does it mean?! `srcg` ?
    this.srcg = function (attributeName, attributeValue) {
        this.element.setAttribute(attributeName, attributeValue)
        return this
    }

}

const builder = {
    create: function (name) {
        return new ElementBuilder(name);
    }
}

const getter = {
    create: function (name) {
        return document.querySelector(`.${name}`)
    }
}

const cartOver = getter.create("cart-overlay")
const cart = getter.create("cart")
const cartContent = getter.create("cart-content")
const cartItems = getter.create("cart-items")
const imgContainer = getter.create("products-center")
const cartTotal = getter.create("cart-total")
const clearCart = getter.create("clear-cart")

const total = () => {
    const total = shop.productslist.totalPrice()
    cartTotal.innerHTML = total
}


const show = () => {

    cartOver.setAttribute('class', ' cart-overlay transparentBcg ')
    cart.setAttribute('class', ' cart showCart')
}



const hide = () => {

    cartOver.setAttribute('class', ' cart-overlay ')
    cart.setAttribute('class', ' cart ')
}


const counter = () => {
    const countProduct = shop.productslist.records.reduce((sum, current) => sum += current.count, 0)
    cartItems.textContent = countProduct
}



clearcart.addEventListener('click', () => {
    shop.productslist.records.splice(0)
    cartContent.innerHTML = ''
    hide();
    cartItems.textContent = 0;

})


fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(res => {
        res.forEach(item => {
            const article = builder.create('article')
                .className('product')
                .appendTo(imgContainer)

            const div = builder.create('div')
                .className("img-container")
                .appendTo(article)

            builder.create('img')
                .srcg(`src`, `${item.fields.image.fields.file.url}`)
                .className("product-img")
                .appendTo(div)

            const button = builder.create('button')
                .className('bag-btn')
                .appendTo(div)
                .onclick(() => {
                    cartContent.innerHTML = ''
                    shop.productslist
                        .add(item.fields.image.fields.file.url, item.fields.price, item.fields.title, 1)
                    shop.init()
                    total()
                    counter()

                })
            builder.create('i')
                .className("fa  fa-cart-plus")
                .appendTo(button)
                .text("ADD TO CART")

            builder.create('i')
                .className("fa  fa-cart-plus")
                .appendTo(button)

            const h3 = builder.create('h3')
                .text(`${item.fields.title}`)
                .appendTo(article)

            const h4 = builder.create('h4')
                .text(`${item.fields.price}`)
                .appendTo(article)

        })
    })










function Painter(cartContent) {

    this.productslist = new ProductList()
    this.cartContent = cartContent;
    this.init = function () {
        const { productslist } = this
        productslist.records.map(item => {

            const cartItem = builder.create('div')
                .className('cart-item')
                .appendTo(cartContent)


            builder.create('img')
                .srcg('src', item.image)
                .appendTo(cartItem)

            const div2 = builder.create('div')
                .appendTo(cartItem)

            builder.create('h4')
                .text(`${item.title}`)
                .appendTo(div2)

            builder.create('h5')
                .text(`${item.price}`)
                .appendTo(div2)

            builder.create('span')
                .className('remove-item')
                .text('remove')
                .appendTo(div2).onclick(() => {
                    productslist.remove(item.title);
                    cartContent.innerHTML = ''
                    shop.init()
                    counter()
                })

            const div1 = builder.create('div')
                .appendTo(cartItem)

            builder.create('i')
                .className('fa fa-chevron-up')
                .appendTo(div1).onclick(() => {
                    item.count += 1
                    cartContent.innerHTML = ''
                    shop.init();
                    total();
                    counter();
                })


            builder.create('p')
                .text(`${item.count}`)
                .appendTo(div1)



            builder.create('i')
                .className('fa fa-chevron-down')
                .appendTo(div1).onclick(() => {
                    if (item.count <= 1) {
                        productslist.remove(item.title);
                        cartContent.innerHTML = ''
                        shop.init()

                    }
                    else {
                        item.count -= 1
                    }
                    cartContent.innerHTML = ''
                    shop.init();
                    total()
                    counter()
                })

        })


    }
}
const shop = new Painter(cartContent)








