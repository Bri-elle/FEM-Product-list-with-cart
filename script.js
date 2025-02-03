// Global Variables
let totalCost = 0;
let totalItems = 0;
let cartFooterCount = 1;

let totalCountElement = document.querySelector(".totalCount");
let cart = document.querySelector("#cart-body");
let totalCostElement = "";
const menuContainer = document.querySelector("#menuContainer");

// Dynamically load data unto ui
document.addEventListener("DOMContentLoaded", function () {
	fetch("data.json")
		.then((response) => response.json())
		.then((data) => {
		
			// create html elements to display json data
			// image
			data.forEach((element) => {
				let menuItem = document.createElement("article");
				let picture = document.createElement("picture");

				let source1 = document.createElement("source");
				source1.media = "(min-width: 1024px)";
				source1.srcset = element.image.desktop;
				let source2 = document.createElement("source");
				source2.media = "(min-width: 768px)";
				source2.srcset = element.image.tablet;
				// mobile view
				let img = document.createElement("img");
				img.loading = "lazy";

				img.src = element.image.mobile;

				picture.appendChild(source1);
				picture.appendChild(source2);
				picture.appendChild(img);
				picture.classList.add("menu-image");

				//item name:
				let name = document.createElement("p");
				name.textContent = element.name;
				name.setAttribute("data-thumbnail", element.image.thumbnail);
				name.setAttribute("data-id", element.name);
				// console.log(name.getAttribute("data-id"));
				name.classList.add("title-menu");

				//item detail
				let details = document.createElement("p");
				details.textContent = element.category;
				details.classList.add("details-menu");

				//item price
				let price = document.createElement("p");
				// price.textContent = `$${element.price.toFixed(2)}`;
				price.textContent = element.price.toFixed(2);
				price.classList.add("price-menu");

				// button
				let button = document.createElement("button");
				button.innerHTML = `<img class="addToCartSVG" src="assets/images/icon-add-to-cart.svg" alt="cart icon"/> Add to Cart`;
				button.classList.add("add-to-cartBtn");
				// -- add Event listeners to add btns
				button.addEventListener("click", () =>
					addCartItem(button, picture)
				);
				// set buttonAttributes for counter and item total
				button.setAttribute("data-counter", "0");
				button.setAttribute("data-itemTotal", "1");

				//add class list
				menuItem.classList.add("menu-item");

				// div to contain image and button
				// let div = this.createElement("div");
				// div.appendChild(button);
				// div.appendChild(picture);

				// div.classList.add("button-image-container")

				// Append items to menu
				// menuItem.appendChild(div);
				menuItem.appendChild(picture);
				menuItem.appendChild(details);
				menuItem.appendChild(name);
				menuItem.appendChild(price);
				menuItem.appendChild(button);

				// append menu item to container
				menuContainer.appendChild(menuItem);
			});
		});
});

/**
 * Add Menu item
 */

function addCartItem(button, img) {
	// let button = event.target;
	// // change ui - add + and - button
	img.style.border = "2px solid #c73a0f";

	// hide cart header content
	let hideContent = document.querySelector(".hide");
	hideContent.style.display = "none";

	let itemName =
		button.previousSibling.previousSibling.previousSibling.textContent;
	// console.log(itemName);

	let itemPrice = button.previousSibling.textContent;
	// console.log(itemPrice);

	let counter = Number(button.getAttribute("data-counter"));

	button.setAttribute("data-counter", counter);
	// console.log(counter);
	if (counter < 1) {
		counter++;
		// update item count
		totalItems++;
		totalCountElement.textContent = totalItems;

		// update total
		let itemTotal = parseFloat(itemPrice * counter);
		totalCost += parseFloat(itemPrice);
		// console.log(totalCost);

		// update UI and increment counter to 1
		button.innerHTML = `<img onclick="increment(this)" class="increment" src="assets/images/icon-increment-quantity.svg" alt="increment icon"> ${counter} <img onclick="decrement(this)" class="decrement" src="assets/images/icon-decrement-quantity.svg" alt="increment icon">`;

		// change button background color and text color
		button.style.backgroundColor = "#c73a0f";
		button.style.color = "white";
		button.style.border = "none";

		//

		// set attributes
		button.setAttribute("data-itemTotal", itemTotal);
		// console.log(itemTotal);
		button.setAttribute("data-counter", counter);
		// console.log(counter);
		button.setAttribute("data-item-identifier", itemName);

		// add items to cart
		let cartItem = document.createElement("div");
		cartItem.classList.add("cart-item");
		cartItem.setAttribute("data-item-name", itemName);
		cartItem.innerHTML += `
		<div class="cart-item-details">
		<p class ="cart-item-name">${itemName} </p> 
		 <span class="item-counter">${counter}x </span>
		  <span class ="cart-item-price"> ${itemPrice} </span>
			<span class="item-total">${itemTotal.toFixed(2)} </span> 
			</div>
			<div class="button-wrapper"
			<button onclick = "remove(this) " class="removeBtn" >  <img src = "assets/images/icon-remove-item.svg" alt ="remove item button icon"> </button>
			</div>`;
		cart.appendChild(cartItem);

		// disable button
		button.disabled = true;

		if (cartFooterCount <= 1) {
			cartTotal();
			cartFooterCount++;
		}
	}
}

/**
 * Increments items
 */
function increment(imageElement) {
	// update total cost
	totalItems++;
	totalCountElement.textContent = totalItems;

	let button = imageElement.parentElement;
	// console.log(button);
	let counter = Number(button.getAttribute("data-counter"));
	counter++;
	button.setAttribute("data-counter", counter);
	// console.log(counter);

	let itemName =
		button.previousSibling.previousSibling.previousSibling.textContent;
	// console.log(itemName);

	let itemPrice = button.previousSibling.textContent;
	// console.log(itemPrice);

	// update items Total
	totalCost += parseFloat(itemPrice);
	// console.log(totalCost);

	let itemTotal = itemPrice * counter;
	button.setAttribute("data-itemTotal", itemTotal);
	// console.log(itemTotal);

	// // update total item
	updateButtonUI(button, counter);
	updateCartUI(itemName, counter, itemTotal);
	cartTotalUpdate();
}

function decrement(imageElement) {
	totalItems--;
	totalCountElement.textContent = totalItems;

	// update total cost
	let button = imageElement.parentElement;
	let itemName =
		button.previousSibling.previousSibling.previousSibling.textContent;

	let itemPrice = button.previousSibling.textContent;
	// console.log(button);

	let counter = Number(button.getAttribute("data-counter"));
	counter--;

	// update items Total
	totalCost -= parseFloat(itemPrice);
	// console.log(totalCost);

	if (counter < 0) counter = 0;

	if (counter <= 0) {
		removeFromCart(itemName, button);
	}

	button.setAttribute("data-counter", counter);
	let itemTotal = itemPrice * counter;
	button.setAttribute("data-itemTotal", itemTotal);

	// console.log("Decrease");
	updateButtonUI(button, counter);
	updateCartUI(itemName, counter, itemTotal);

	// update total item
}
function removeFromCart(itemName, button) {
	let deletedItem = document.querySelector(`[data-item-name="${itemName}"]`);
	deletedItem.remove();
	button.disabled = false;

	// this ensures that the UI updates after the decrement function is done updating the UI
	//without this, the add to cart doesn't update
	setTimeout(() => {
		button.innerHTML = `<img class="addToCartSVG" src="assets/images/icon-add-to-cart.svg" alt="cart icon"/> Add to cart`;
		// change button background color
		button.style.backgroundColor = "white";
		button.style.color = "black";
	}, 0);

	cartTotalUpdate();
}

function updateCartUI(itemName, counter, itemTotal) {
	let existingCartItem = document.querySelector(
		`[data-item-name="${itemName}"]`
	);
	// Update the counter and total for the existing item
	let counterElement = existingCartItem.querySelector(".item-counter");
	let itemTotalElement = existingCartItem.querySelector(".item-total");

	// Update the displayed values
	counterElement.textContent = `${counter}x`;
	itemTotalElement.textContent = itemTotal.toFixed(2);

	cartTotalUpdate();
}

function updateButtonUI(button, counter) {
	button.innerHTML = `<img onclick="increment(this)" class="increment" src="assets/images/icon-increment-quantity.svg" alt="increment icon"> ${counter} <img onclick="decrement(this)" class="decrement" src="assets/images/icon-decrement-quantity.svg" alt="increment icon">`;
}

function remove(element) {
	let deleteItem = element.parentElement;
	let itemName = deleteItem.getAttribute("data-item-name");
	// console.log(itemName);

	let button = document.querySelector(`[data-item-identifier="${itemName}"]`);
	// remove item form cart
	removeFromCart(itemName, deleteItem);
	// update item button UI
	button.innerHTML = "Add to Cart";
	// update counter value
	let counter = Number(button.getAttribute("data-counter"));

	//update total cost value
	totalItems = parseFloat(totalItems - counter);
	button.setAttribute("data-counter", 0);
	totalCountElement.textContent = totalItems;

	// update total cost
	let itemPrice = button.previousSibling.textContent;
	let costRemoved = parseFloat(itemPrice) * counter;
	// console.log(costRemoved);
	totalCost -= costRemoved;
	// console.log(totalCost);

	button.disabled = false;
	cartTotalUpdate();
}

function cartTotal() {
	// cart total display
	let cartTotal = document.querySelector("#cart-footer");
	let deliveryType = document.createElement("div");
	let cartTotalWrapper = document.createElement("div");
	let text = document.createElement("p");
	totalCostElement = document.createElement("p");
	let confirmOrderElement = document.createElement("button");

	text.textContent = "Order Total";
	text.classList.add("cart-total-text");
	totalCostElement.textContent = totalCost;
	totalCostElement.classList.add("cart-total-cost");
	cartTotalWrapper.appendChild(text);
	cartTotalWrapper.appendChild(totalCostElement);
	cartTotalWrapper.classList.add("cart-total-wrapper");
	confirmOrderElement.textContent = "Confirm Order";
	deliveryType.innerHTML = `<img
	class="order-img"
	src="assets/images/icon-carbon-neutral.svg"
	alt="carbon delivery"
/> <p>This is a <b>carbon-neutral</b> delivery</p>`;
	deliveryType.classList.add("delivery-type-text");
	// add classLists
	confirmOrderElement.classList.add("confirmOrderBtn");

	// 	//add event listener to confirm new order
	confirmOrderElement.addEventListener("click", orderConfirmed);

	// append items
	// cartTotal.appendChild(text);
	// cartTotal.appendChild(totalCostElement);
	cartTotal.appendChild(cartTotalWrapper);
	cartTotal.appendChild(deliveryType);
	cartTotal.appendChild(confirmOrderElement);

	//total cost
	cartTotalUpdate();
}

function cartTotalUpdate() {
	totalCostElement.textContent = totalCost.toFixed(2);
}

/**
 * order confirmed
 */
function orderConfirmed() {
	// Scroll back to the top of the page
	window.scrollTo({
		top: 0,
		behavior: "smooth",
	});
	//cone cart  div
	finalOrderElements = cart.cloneNode(true);
	let finalOrderList = document.createElement("section");
	let orderWrapper = document.createElement("div");

	let confirmIcon = document.createElement("img");
	// add attributes
	confirmIcon.src = "assets/images/icon-order-confirmed.svg";
	confirmIcon.alt = "confirmation Icon";

	let listHeader = document.createElement("h2");
	listHeader.textContent = "Order Confirmed";

	let listText = document.createElement("p");
	listText.textContent = "We hope you enjoy your food!";

	let cartItems = finalOrderElements.querySelectorAll(".cart-item");
	// console.log(cartItems);

	let items = [];
	let itemNames = [];
	let thumbnails = [];
	let counts = [];
	let costs = [];
	let price = [];

	// get item name, count and item total cost
	cartItems.forEach((item) => {
		let name = item.getAttribute("data-item-name");
		itemNames.push(name);
		counts.push(item.querySelector(".item-counter").textContent);
		costs.push(item.querySelector(".item-total").textContent);
	});

	itemNames.forEach((name) => {
		if (name == "Crème Brûlée") name = "Creme Brulee";
		if (name == "Pie") name = "meringue";
		let thumbnail = name.split(" ").join("-");
		thumbnails.push(thumbnail);
	});

	// console.log(items);

	//get count and total cost for each item

	// console.log(items);
	// console.log(counts);
	// console.log(thumbnails);
	// console.log(itemNames);
	// console.log(costs);

	// // remove the delete button on each item
	// let removeButtons = finalOrderElement.querySelectorAll(".removeBtn");
	// removeButtons.forEach((button) => button.remove());
	// //append new finalOrder header to final order list
	let confirmedListHeader = document.createElement("div");
	confirmedListHeader.classList.add("confirmed-list-header");

	confirmedListHeader.appendChild(confirmIcon);
	confirmedListHeader.appendChild(listHeader);
	confirmedListHeader.appendChild(listText);
	finalOrderList.appendChild(confirmedListHeader);
	// append each cart item with image, count and cost into final order list
	//>> use a for loop
	for (let i = 0; i < cartItems.length; i++) {
		let listItem = document.createElement("div");
		listItem.classList.add("list-item");
		listItem.innerHTML = `
		<div class="list-item-wrapper">
		<img src="assets/images/image-${thumbnails[i]}-thumbnail.jpg" alt="${
			itemNames[i]
		}">
		<div >
	<p class="listItemName">${itemNames[i]}</p>
	<p>
	<span class="listItemCount">${counts[i]}</span>
	<span class="listItemPrice">${(costs[i] / parseFloat(counts[i])).toFixed(
		2
	)}</span>
		</p>
		</div>
	<p class="listItemTotal">${costs[i]} </p>
	</div>`;

		orderWrapper.classList.add("order-wrapper");
		orderWrapper.appendChild(listItem);
	}

	// >> create a list item
	// >>

	//List Total
	let listTotal = document.createElement("div");
	listTotal.classList.add("final-order-footer");
	let p1 = document.createElement("p");
	p1.textContent = "Order Total";
	let p2 = document.createElement("p");
	p2.textContent = `$${totalCost.toFixed(2)}`;
	listTotal.append(p1);
	listTotal.append(p2);

	orderWrapper.appendChild(listTotal);

	finalOrderList.classList.add("confirmed-order");
	// document.getElementById("container").appendChild(finalOrderList);
	let overlay = document.createElement("section");
	overlay.appendChild(finalOrderList);
	overlay.classList.add("confirmation-overlay");
	// document.getElementById("container").appendChild(overlay);
	document.querySelector("body").appendChild(overlay);

	//start new Order Button
	let newOrderButton = document.createElement("button");
	newOrderButton.textContent = "Start New Order";
	newOrderButton.classList.add("start-new-orderBtn");
	newOrderButton.addEventListener("click", startNewOrder);

	finalOrderList.appendChild(orderWrapper);
	finalOrderList.appendChild(newOrderButton);
	overlay.appendChild(finalOrderList);

	//disable confirm order btn

	// //add start new order button and remove the confirm order button from the cloned copy
}

function startNewOrder() {
	//add event listener to add start new order button
	location.reload(true);
}
