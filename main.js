let input = document.querySelector(".add-item input");
let addButton = document.querySelector(".add-item button");
let list = document.querySelector(".item-list");

let allTags = document.querySelectorAll(".tags");
let needToBuy = allTags[0];
let alreadyBought = allTags[1];

let products;

let savedProducts = localStorage.getItem("products");

if (savedProducts != null) {
    products = JSON.parse(savedProducts);
} else {
    products = [
        { name: "Помідори", count: 2, bought: false },
        { name: "Печиво", count: 2, bought: false },
        { name: "Сир", count: 1, bought: false }
    ];
}

function saveProducts() {
    localStorage.setItem("products", JSON.stringify(products));
}

function showStatistics() {
    needToBuy.innerHTML = "";
    alreadyBought.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let tag = document.createElement("span");
        tag.className = "product-item";
        tag.innerHTML = product.name + ' <span class="amount">' + product.count + '</span>';

        if (product.bought == true) {
            tag.style.textDecoration = "line-through";
            alreadyBought.appendChild(tag);
        } else {
            needToBuy.appendChild(tag);
        }
    }
}

function showProducts() {
    list.innerHTML = "";

    for (let i = 0; i < products.length; i++) {
        let product = products[i];

        let row = document.createElement("div");
        row.className = "item-row";

        let name = document.createElement("span");
        name.className = "item-name";
        name.innerText = product.name;

        if (product.bought == true) {
            name.style.textDecoration = "line-through";
        }

        name.onclick = function () {
            if (product.bought == true) {
                return;
            }

            let editInput = document.createElement("input");
            editInput.value = product.name;
            editInput.className = "item-name";

            row.replaceChild(editInput, name);
            editInput.focus();

            editInput.onblur = function () {
                if (editInput.value.trim() != "") {
                    product.name = editInput.value.trim();
                }

                saveProducts();
                showProducts();
            };
        };

        row.appendChild(name);

        if (product.bought == false) {
            let counter = document.createElement("div");
            counter.className = "counter";

            let minus = document.createElement("button");
            minus.className = "minus";
            minus.innerText = "−";
            minus.setAttribute("data-tooltip", "Зменшити");

            if (product.count == 1) {
                minus.disabled = true;
            }

            minus.onclick = function () {
                if (product.count > 1) {
                    product.count--;
                    saveProducts();
                    showProducts();
                }
            };

            let number = document.createElement("span");
            number.className = "number";
            number.innerText = product.count;

            let plus = document.createElement("button");
            plus.className = "plus";
            plus.innerText = "+";
            plus.setAttribute("data-tooltip", "Збільшити");

            plus.onclick = function () {
                product.count++;
                saveProducts();
                showProducts();
            };

            counter.appendChild(minus);
            counter.appendChild(number);
            counter.appendChild(plus);

            row.appendChild(counter);
        }

        let status = document.createElement("button");
        status.className = "status";
        status.setAttribute("data-tooltip", "Позначити");

        if (product.bought == true) {
            status.innerText = "Зробити не купленим";
        } else {
            status.innerText = "Куплено";
        }

        status.onclick = function () {
            if (product.bought == true) {
                product.bought = false;
            } else {
                product.bought = true;
            }

            saveProducts();
            showProducts();
        };

        row.appendChild(status);

        if (product.bought == false) {
            let del = document.createElement("button");
            del.className = "delete";
            del.innerText = "×";
            del.setAttribute("data-tooltip", "Видалити");

            del.onclick = function () {
                products.splice(i, 1);

                saveProducts();
                showProducts();
            };

            row.appendChild(del);
        }

        list.appendChild(row);
    }

    showStatistics();
}

function addProduct() {
    let text = input.value.trim();

    if (text == "") {
        return;
    }

    let newProduct = {
        name: text,
        count: 1,
        bought: false
    };

    products.push(newProduct);

    input.value = "";
    input.focus();

    saveProducts();
    showProducts();
}

addButton.onclick = function () {
    addProduct();
};

input.onkeydown = function (event) {
    if (event.key == "Enter") {
        addProduct();
    }
};

showProducts();