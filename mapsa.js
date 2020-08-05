
function Products(image, price, title,count) {

    this.image = image;
    this.price = price;
    this.title = title;
    this.count=count


}


function ProductList() {
    this.records = [];
    this.add = function (image, price, title,count) {
        const {records}=this;
        let productExit=false;
        const record = new Products(image, price, title,count);
        records.forEach(item=>{
            if(item.title===record.title){
                productExit = true
                item.count+=1
            }
        })
        if(!productExit){
            records.push({...record})
        }

}

    this.remove = function (title) {
        const {records}=this
        const index = records.findIndex(key => key.title === title);
       index !== -1 ? records.splice(index, 1) : records
       
    }

    this.totalPrice = function () {
        const {records}=this
      return  records.reduce((sum,current)=>sum + current.price* current.count,0)
 
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

    this.srcg = function (num1, num2) {
        this.element.setAttribute(num1, num2)
        return this
    }

}

const builder = {
    create: function (name) {
        return new ElementBuilder(name);
    }
}

const getter={
    create:function(name){
        return document.getElementsByClassName(name)
    }
}
let counter = 0
const cartOver = getter.create("cart-overlay")
const cart = getter.create("cart")
const cartContent = getter.create("cart-content")
const cartItems =getter.create("cart-items")
const imgContainer = getter.create("products-center")
const cartTotal = getter.create("cart-total")
const clearCart=getter.create("clear-cart")

fetch('http://localhost:3000/items')
    .then(res => res.json())
    .then(res => {
        res.map(item => {
            const article = builder.create('article')
                .className('product')
                .appendTo(imgContainer[0])

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
                    cartContent[0].innerHTML = ''
                    shop.productslist
                    .add(item.fields.image.fields.file.url, item.fields.price, item.fields.title,1)
                    shop.init()
                    const total = shop.productslist.totalPrice()
                    cartTotal[0].innerHTML = total
                    counter += 1
                    cartItems[0].textContent = counter
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


const show = () => {

    cartOver[0].setAttribute('class', ' cart-overlay transparentBcg ')
    cart[0].setAttribute('class', ' cart showCart')
}

const hide = () => {

    cartOver[0].setAttribute('class', ' cart-overlay ')
    cart[0].setAttribute('class', ' cart ')
}


clearCart[0].addEventListener('click',()=>{
    hide();
    cartItems[0].textContent =0;
    
})





function Painter(cartContent) {

    this.productslist = new ProductList()
    this.cartContent = cartContent;
    this.init = function () {
        const {productslist}=this
        productslist.records.map(item => {
            
            const cartItem = builder.create('div')
                .className('cart-item')
                .appendTo(cartContent[0])


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
                    cartContent[0].innerHTML = ''
                     shop.init()
                })

            const div1 = builder.create('div')
                .appendTo(cartItem)

            builder.create('i')
                .className('fa fa-chevron-up')
                .appendTo(div1).onclick(()=>{
                    item.count+=1
                    cartContent[0].innerHTML = ''
                    shop.init();
                    const total = productslist.totalPrice()
                    cartTotal[0].innerHTML = total
                })


            builder.create('p')
                .text(`${item.count}`)
                .appendTo(div1)



            builder.create('i')
                .className('fa fa-chevron-down')
                .appendTo(div1).onclick(()=>{
                    item.count-=1
                    cartContent[0].innerHTML = ''
                    shop.init();
                    const total = productslist.totalPrice()
                    cartTotal[0].innerHTML = total
                })

        })


    }
}
const shop = new Painter(cartContent)








