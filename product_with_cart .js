class EcommerceStore {
    constructor() {
        this.products = []
        this.carts = []
    }

    addProduct() {
        let product1 = {
            id: Math.floor(Math.random() * 1000000),
            name: "Apple",
            price: 100,
            stock: 10,
            unit: "kg"
        }
        let product2 = {
            id: Math.floor(Math.random() * 1000000),
            name: "Mango",
            price: 300,
            stock: 40,
            unit: "kg"
        }
        this.products.push(product1, product2)
        console.log("products: ", this.products)
        this.updateProductsUI()
    }

    updateProductsUI() {
        let productsUIEle = document.getElementById("products")
        productsUIEle.innerHTML = this.products.map(
            (product, index) => {
                return `<li key="${product.id}">
                    <h3>${product.name}</h3>
                    <b>${product.price} | ${product.unit}</b>
                    <i>Stock: ${product.stock}</i><br>
                    <input type="number" placeholder="Enter Quantity" id="quantity-${product.id}">
                    <button key="${product.id}" onclick="store.addToCart('${product.id}')">Add To Cart</button>
                </li>`
            }
        ).join(" ")
    }

    addToCart(productId) {
        console.log("productId: ", productId)
        // finding matching product with productId
        let matchedProduct = this.products.find(
            (p) => {
                return p.id == productId
            }
        )
        // finding quantity input element
        let quantityIntpuEle = document.getElementById("quantity-" + matchedProduct.id)
        // validation of empty quanity
        if (quantityIntpuEle.value === "") {
            alert("Please enter quantity")
            return;
        }
        // converting string quanity to integer
        let quantity = parseInt(quantityIntpuEle.value)
        // checking avability of stock
        if (quantity > matchedProduct.stock) {
            alert("Stock is not available")
            return;
        }
        // finding existing product cart
        let matchingCart = this.carts.find(
            (cart) => cart.productName == matchedProduct.name
        )
        // if matching cart exist then update the cart details
        if (matchingCart) {
            let totalQuantity = matchingCart.quantity + quantity
            if (totalQuantity > matchedProduct.stock) {
                alert("not enough stock")
                return
            }
            matchingCart.quantity = totalQuantity
            let newUpdatedCarts = this.carts.map(
                (cart, index) => {
                    if (cart.id == matchingCart.id) {
                        return matchingCart
                    }
                    return cart
                }
            )
            this.carts = newUpdatedCarts
            console.log("cart updated : ", this.carts)
            this.displayCart()
            return;
        }
        let cartDetails = {
            id: Math.floor(Math.random() * 1000000),
            productId: matchedProduct.id,
            quantity: quantity,
            productName: matchedProduct.name,
            price: matchedProduct.price,
            unit: matchedProduct.unit
        }
        this.carts.push(cartDetails)
        console.log("cart added : ", this.carts)
        // updating ui of cart list
        this.displayCart()
    }

    displayCart() {
        let cartULEle = document.getElementById("carts")
        cartULEle.innerHTML = this.carts.map(
            (cart, index) => {
                return `<div key="${cart.id}" style="background-color:teal; color:white; padding: 10px; border-radius: 10px; margin: 10px; width: 250px;">
                    <h3>${cart.productName}</h3>
                    <b>${cart.price} | ${cart.unit}</b>
                    <i>Quantity: ${cart.quantity}</i>
                    <p>Total Price: ${cart.price * cart.quantity}</p>
                </div>`
            }
        ).join(" ")
        let grantTotalEle = document.getElementById("grand-total")
        grantTotalEle.innerText = "Grand Total: " + this.getGrandTotalFromCarts()
    }

    getGrandTotalFromCarts() {
        let grandTotal = 0
        this.carts.forEach(
            (cart) => {
                grandTotal += cart.price * cart.quantity
            }
        )
        return grandTotal
    }
    payWithEsewa() {
        if(this.carts.length===0){
            alert("cart is empty")
            return
        }
        const secretKey = '8gBm/:&EnhH.1/q'
        const totalAmountFromCarts = this.getGrandTotalFromCarts()
        const nowDate = new Date()
        const formattedTime = "E-" + nowDate.getHours() + nowDate.getMinutes() + nowDate.getSeconds() + nowDate.getMilliseconds()
        const transactionUUID = formattedTime
        const taxAmount = 0;
        const serviceCharge = 0;
        const deliveryCharge = 0;
        const toalAmount = totalAmountFromCarts + taxAmount + serviceCharge + deliveryCharge
        const productCode = "EPAYTEST"
        const signedFieldNames = "total_amount,transaction_uuid,product_code"
        const signatureString = `total_amount=${toalAmount},transaction_uuid=${transactionUUID},product_code=${productCode}`
        var hash = CryptoJS.HmacSHA256(signatureString, secretKey);
        var hashInBase64 = CryptoJS.enc.Base64.stringify(hash);
        const signature = hashInBase64

        const paymentData = {
            amount: totalAmountFromCarts,
            tax_amount:taxAmount,
            total_amount:toalAmount,
            transaction_uuid:transactionUUID,
            product_code:productCode,
            product_service_charge:serviceCharge,
            product_delivery_charge:deliveryCharge,
            signature:signature,
            signed_field_names:signedFieldNames,
            success_url:"http://127.0.0.1:5500/success.html",
            failure_url:"http://127.0.0.1:5500/failure.html"
        }
        let form = document.createElement("form")
        form.action = "https://rc-epay.esewa.com.np/api/epay/main/v2/form"
        form.method = "POST"

        Object.entries(paymentData).forEach(
            ([key,value])=>{
                let input = document.createElement("input")
                input.hidden = true
                input.name = key
                input.value = value
                form.appendChild(input)
            }
        )
        document.body.appendChild(form)
        form.submit()
    }
}

let store = new EcommerceStore()
store.addProduct()
