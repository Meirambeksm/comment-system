"use strict";
// Initial variables
const list = document.querySelector(".comment");
const mainListType = "main-list";
const addListType = "add-list";
const comments = JSON.parse(localStorage.getItem("comments") ?? "[]");
// Fetch random username and avatar from data.json
async function fetchData() {
    try {
        const res = await fetch("http://127.0.0.1:5500/data/data.json");
        const data = await res.json();
        const randomNumber = Math.floor(Math.random() * data.users.length);
        const username = document.querySelector(".user-name");
        const avatar = document.querySelector(".input__image");
        username.textContent = data.users[randomNumber].username;
        avatar.src = data.users[randomNumber].avatar;
    }
    catch (error) {
        console.error(`There was an error loading data..., ${error}`);
    }
}
// Add Main Comment
class MainComment {
    submitBtn;
    mainInput;
    likeButtonsMain;
    plusButtonsMain;
    minusButtonsMain;
    constructor() {
        this.submitBtn = document.querySelector(".submit-btn");
        this.mainInput = document.querySelector(".input-field__input");
        this.likeButtonsMain = document.querySelectorAll(`.${mainListType}-like-btn`);
        this.plusButtonsMain = document.querySelectorAll(`.${mainListType}-plus`);
        this.minusButtonsMain = document.querySelectorAll(`.${mainListType}-minus`);
    }
    // Event listeners of main comment
    mainCommentEvents() {
        this.submitBtn?.addEventListener("click", (e) => this.addComment(e, this.mainInput, list, mainListType, "0", "0"));
        this.mainInput?.addEventListener("input", (e) => this.showHideSubmitBtn(e));
        this.mainInput?.addEventListener("focus", () => {
            document.querySelector(".filter__drop__list")?.classList.remove("active");
        });
        this.likeButtonsMain.forEach((button) => {
            button.addEventListener("click", () => this.handleLike(button));
        });
        this.minusButtonsMain.forEach((button) => {
            button.addEventListener("click", () => this.handleDecreaseRating(button));
        });
        this.plusButtonsMain.forEach((button) => {
            button.addEventListener("click", () => this.handleIncreaseRating(button));
        });
    }
    // Add main comment, update local storage and comments array with username details objects
    addComment(e, input, listContainer, type, responseUsername, id) {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, "0");
        const month = (date.getMonth() + 1).toString().padStart(2, "0");
        const hours = date.getUTCHours().toString().padStart(2, "0");
        const minutes = date.getUTCMinutes().toString().padStart(2, "0");
        const username = document.querySelector(".user-name");
        const avatar = document.querySelector(".input__image");
        const usernameDetails = {
            id: Date.now().toString(10),
            parentId: id,
            username: username.textContent,
            avatar: avatar.src,
            date: `${day}.${month} ${hours}:${minutes}`,
            text: input.value,
            rating: 0,
            dateToSort: date,
            likeBtn: false,
            responses: [],
        };
        this.createListElement(listContainer, usernameDetails.id, usernameDetails.avatar, usernameDetails.username, usernameDetails.date, input.value, usernameDetails.likeBtn, usernameDetails.rating, type, responseUsername);
        if (e.target instanceof HTMLElement &&
            e.target.classList.value.trim() === "submit-btn") {
            comments.push(usernameDetails);
        }
        if (e.target instanceof HTMLElement &&
            e.target.classList.value.trim() === "response-input-btn") {
            const comment = comments.find((comment) => comment.id === id);
            comment?.responses?.push(usernameDetails);
        }
        localStorage.setItem("comments", JSON.stringify(comments));
        input.value = "";
    }
    // Createelements (li, btn, span, etc.)
    createListElement(listContainer, id, avatar, username, date, comment, likeStatus, rating, type, responseUsername) {
        const mainList = document.createElement("li");
        mainList.setAttribute("class", `comment-list ${type}`);
        mainList.setAttribute("id", `${type}-${id}`);
        const responseBtnImg = document.createElement("img");
        responseBtnImg.src = "/assets/arrow-answer.svg";
        const avatarImg = document.createElement("img");
        avatarImg.setAttribute("id", `avatar-img-${id}`);
        avatarImg.src = `${avatar}`;
        const commentBody = document.createElement("div");
        commentBody.setAttribute("class", "comment-body");
        const usernameField = document.createElement("div");
        usernameField.setAttribute("class", "comment-field__text");
        const usernameText = document.createElement("span");
        usernameText.setAttribute("class", "user-name");
        usernameText.setAttribute("id", `user-name-${id}`);
        usernameText.textContent = username;
        usernameField.appendChild(usernameText);
        if (type === "add-list") {
            const responseUser = document.createElement("div");
            responseUser.setAttribute("class", "response-user");
            responseUser.appendChild(responseBtnImg);
            responseUser.insertAdjacentText("beforeend", `${responseUsername}`);
            usernameField.appendChild(responseUser);
        }
        const dateText = document.createElement("span");
        dateText.setAttribute("class", "comment-field__date");
        dateText.textContent = date;
        usernameField.appendChild(dateText);
        const text = document.createElement("p");
        text.setAttribute("class", "comment-body__text");
        text.textContent = comment;
        const commentButtons = document.createElement("div");
        commentButtons.setAttribute("class", "comment-buttons");
        if (type === "main-list") {
            const responseBtn = document.createElement("button");
            responseBtn.setAttribute("class", "comment-buttons__btn response-btn");
            responseBtn.setAttribute("id", `response-btn-${id}`);
            responseBtn.appendChild(responseBtnImg);
            responseBtn.insertAdjacentText("beforeend", "Ответить");
            commentButtons.appendChild(responseBtn);
        }
        // Like Buttons
        const likeBtnText = document.createElement("span");
        likeBtnText.setAttribute("class", `${type}-like-btn-text`);
        likeBtnText.setAttribute("id", `like-btn-text-${id}`);
        likeBtnText.textContent = likeStatus ? "В избранном" : "В избранное";
        const likeBtnImg = document.createElement("img");
        likeBtnImg.setAttribute("class", `${type}-comment-buttons__heart`);
        likeBtnImg.setAttribute("id", `like-btn-img-${id}`);
        likeBtnImg.src = likeStatus
            ? "/assets/heart-full.svg"
            : "/assets/heart-empty.svg";
        const likeBtn = document.createElement("button");
        likeBtn.setAttribute("class", `comment-buttons__btn ${type}-like-btn`);
        likeBtn.setAttribute("id", `like-btn-${id}`);
        likeBtn.appendChild(likeBtnImg);
        likeBtn.appendChild(likeBtnText);
        // Rating Buttons
        const ratingBtn = document.createElement("div");
        ratingBtn.setAttribute("class", "comment-buttons__rating");
        ratingBtn.setAttribute("id", `rating-btn-${id}`);
        const minusBtn = document.createElement("button");
        minusBtn.setAttribute("class", `comment-buttons__rating__btn minus ${type}-minus`);
        minusBtn.setAttribute("id", `minus-${id}`);
        minusBtn.textContent = "-";
        const ratingStatus = rating < 0 ? "ratingNegative" : "ratingPositive";
        const ratingText = document.createElement("span");
        ratingText.setAttribute("class", ratingStatus);
        ratingText.setAttribute("id", `rating-${id}`);
        ratingText.textContent = rating.toString();
        const plusBtn = document.createElement("button");
        plusBtn.setAttribute("class", `comment-buttons__rating__btn plus ${type}-plus`);
        plusBtn.setAttribute("id", `plus-${id}`);
        plusBtn.textContent = "+";
        // Response Wrapper
        const responseWrapper = document.createElement("div");
        responseWrapper.setAttribute("class", "responseWrapper");
        responseWrapper.setAttribute("id", `response-wrapper-${id}`);
        const responseInput = document.createElement("input");
        responseInput.setAttribute("id", `response-input-${id}`);
        responseInput.setAttribute("class", "response-input");
        responseInput.setAttribute("placeholder", "Ответить...");
        const responseBtnWrapper = document.createElement("div");
        responseBtnWrapper.setAttribute("class", "response-btn-wrapper");
        const responseInputBtn = document.createElement("button");
        responseInputBtn.setAttribute("id", `response-input-btn-${id}`);
        responseInputBtn.setAttribute("class", "response-input-btn");
        responseInputBtn.setAttribute("disabled", "");
        responseInputBtn.textContent = "Ответить";
        const responseBtnWrapperText = document.createElement("span");
        const responseMistakeText = document.createElement("span");
        responseMistakeText.setAttribute("class", "response-mistake-text");
        responseMistakeText.setAttribute("id", `response-mistake-text-${id}`);
        responseMistakeText.textContent = "Слишком длинное сообщение";
        responseBtnWrapperText.setAttribute("class", "response-btn-wrapper-text");
        responseBtnWrapperText.setAttribute("id", `response-btn-wrapper-text-${id}`);
        responseBtnWrapperText.textContent = "Макс. 1000 символов";
        responseWrapper.appendChild(responseInput);
        responseBtnWrapper.appendChild(responseInputBtn);
        responseBtnWrapper.appendChild(responseBtnWrapperText);
        responseBtnWrapper.appendChild(responseMistakeText);
        responseWrapper.appendChild(responseBtnWrapper);
        const addList = document.createElement("ul");
        addList.setAttribute("class", "comment-add");
        addList.setAttribute("id", `comment-add-${id}`);
        // Main List
        mainList.appendChild(avatarImg);
        mainList.appendChild(commentBody);
        commentBody.appendChild(usernameField);
        commentBody.appendChild(text);
        commentButtons.appendChild(likeBtn);
        ratingBtn.appendChild(minusBtn);
        ratingBtn.appendChild(ratingText);
        ratingBtn.appendChild(plusBtn);
        commentButtons.appendChild(ratingBtn);
        commentBody.appendChild(commentButtons);
        commentBody.appendChild(responseWrapper);
        commentBody.appendChild(addList);
        listContainer.appendChild(mainList);
    }
    // Display mistake text, text counter and activate/inactivate submit button
    showHideSubmitBtn(e) {
        const counter = e.target.value.length;
        const maxText = document.querySelector(".input-field__max");
        const mistakeText = document.querySelector(".mistake__text");
        if (counter > 0) {
            this.activateBtn(this.submitBtn);
            maxText.textContent = `${counter}/1000`;
        }
        else {
            this.diactivateBtn(this.submitBtn);
        }
        if (counter > 1000) {
            mistakeText.style.visibility = "visible";
            this.diactivateBtn(this.submitBtn);
        }
        else {
            mistakeText.style.visibility = "hidden";
        }
    }
    // Activate buttons
    activateBtn(button) {
        button.disabled = false;
        button.style.cursor = "pointer";
        button.style.backgroundColor = "#ABD873";
        button.style.color = "#000";
    }
    // Inactivate buttons
    diactivateBtn(button) {
        button.disabled = true;
        button.style.cursor = "not-allowed";
        button.style.backgroundColor = "rgba(161, 161, 161, 0.4)";
        button.style.color = "rgba(0, 0, 0, 0.4)";
    }
    // Handle like buttons
    handleLike(button) {
        let comment;
        let response;
        const currentId = button.id.slice(9);
        const currentImg = document.querySelector(`#like-btn-img-${currentId}`);
        const likeBtnText = document.querySelector(`#like-btn-text-${currentId}`);
        if (button.classList[1] === "main-list-like-btn") {
            comment = comments.find((comment) => comment.id === currentId);
            if (comment) {
                comment.likeBtn = !comment.likeBtn;
                currentImg.src = comment.likeBtn
                    ? "/assets/heart-full.svg"
                    : "/assets/heart-empty.svg";
                likeBtnText.textContent = comment.likeBtn
                    ? "В избранном"
                    : "В избранное";
            }
        }
        if (button.classList[1] === "add-list-like-btn") {
            const parentListItem = button.parentNode?.parentNode?.parentNode
                ?.parentNode?.parentNode?.parentNode;
            const parentId = parentListItem?.id.slice(10);
            comment = comments.find((comment) => comment.id === parentId);
            response = comment?.responses?.find((response) => response.id === currentId);
            response.likeBtn = !response?.likeBtn;
            currentImg.src = response?.likeBtn
                ? "/assets/heart-full.svg"
                : "/assets/heart-empty.svg";
            likeBtnText.textContent = response?.likeBtn
                ? "В избранном"
                : "В избранное";
        }
        document.querySelector(".filter__drop__list")?.classList.remove("active");
        localStorage.setItem("comments", JSON.stringify(comments));
    }
    // Handle plus buttons to increase rating
    handleIncreaseRating(button) {
        let comment;
        let response;
        const currentId = button.id.slice(5);
        const currentRating = document.querySelector(`#rating-${currentId}`);
        const currentValue = parseInt(currentRating.textContent) + 1;
        if (button.classList[2] === "main-list-plus") {
            comment = comments.find((comment) => comment.id === currentId);
            comment.rating = currentValue;
        }
        if (button.classList[2] === "add-list-plus") {
            const parentListItem = button.parentNode?.parentNode?.parentNode
                ?.parentNode?.parentNode?.parentNode?.parentNode;
            const parentId = parentListItem?.id.slice(10);
            comment = comments.find((comment) => comment.id === parentId);
            response = comment?.responses?.find((response) => response.id === currentId);
            response.rating = currentValue;
        }
        currentRating.textContent = currentValue.toString();
        if (currentValue >= 0) {
            currentRating.style.color = "#8ac540";
        }
        document.querySelector(".filter__drop__list")?.classList.remove("active");
        localStorage.setItem("comments", JSON.stringify(comments));
    }
    // Handle minus buttons to decrease rating
    handleDecreaseRating(button) {
        let comment;
        let response;
        const currentId = button.id.slice(6);
        const currentRating = document.querySelector(`#rating-${currentId}`);
        const currentValue = parseInt(currentRating.textContent) - 1;
        if (button.classList[2] === "main-list-minus") {
            comment = comments.find((comment) => comment.id === currentId);
            comment.rating = currentValue;
        }
        if (button.classList[2] === "add-list-minus") {
            const parentListItem = button.parentNode?.parentNode?.parentNode
                ?.parentNode?.parentNode?.parentNode?.parentNode;
            const parentId = parentListItem?.id.slice(10);
            comment = comments.find((comment) => comment.id === parentId);
            response = comment?.responses?.find((response) => response.id === currentId);
            response.rating = currentValue;
        }
        currentRating.textContent = currentValue.toString();
        if (currentValue < 0) {
            currentRating.style.color = "#ff0000";
        }
        document.querySelector(".filter__drop__list")?.classList.remove("active");
        localStorage.setItem("comments", JSON.stringify(comments));
    }
}
// Add response to main comment
class ResponseComment extends MainComment {
    responseButtons;
    responseInputs;
    responseInputButtons;
    likeButtonsRes;
    plusButtonsRes;
    minusButtonsRes;
    constructor() {
        super();
        this.responseButtons = document.querySelectorAll(".response-btn");
        this.responseInputs = document.querySelectorAll(".response-input");
        this.responseInputButtons = document.querySelectorAll(".response-input-btn");
        this.likeButtonsRes = document.querySelectorAll(`.${addListType}-like-btn`);
        this.plusButtonsRes = document.querySelectorAll(`.${addListType}-plus`);
        this.minusButtonsRes = document.querySelectorAll(`.${addListType}-minus`);
    }
    // Event listeners of response comments
    responseCommentEvents() {
        this.responseButtons.forEach((button) => {
            button.addEventListener("click", () => this.activateResponseInput(button));
        });
        this.responseInputs.forEach((input) => {
            input.addEventListener("blur", () => this.inactivateResponseInput(input));
        });
        this.responseInputs.forEach((input) => {
            input.addEventListener("input", () => this.activateResponseInputButton(input));
        });
        this.responseInputButtons.forEach((button) => {
            button.addEventListener("click", (e) => this.handleAddRes(button, e));
        });
        this.likeButtonsRes.forEach((button) => {
            button.addEventListener("click", () => this.handleLike(button));
        });
        this.plusButtonsRes.forEach((button) => {
            button.addEventListener("click", () => this.handleIncreaseRating(button));
        });
        this.minusButtonsRes.forEach((button) => {
            button.addEventListener("click", () => this.handleDecreaseRating(button));
        });
    }
    // Activate additional input for response to main comment
    activateResponseInput(button) {
        const currentId = button.id.slice(13);
        const responseInput = document.querySelector(`#response-input-${currentId}`);
        const responseInputBtn = document.querySelector(`#response-input-btn-${currentId}`);
        const responseBtnWrapperText = document.querySelector(`#response-btn-wrapper-text-${currentId}`);
        const responseMistake = document.querySelector(`#response-mistake-text-${currentId}`);
        responseInput.style.display = "inline";
        responseInput.focus();
        if (responseInput.value) {
            responseInputBtn.style.display = "inline";
            responseBtnWrapperText.style.display = "inline";
            responseMistake.style.display = "inline";
        }
        document.querySelector(".filter__drop__list")?.classList.remove("active");
    }
    // Inactivate additional input
    inactivateResponseInput(input) {
        const currentId = input.id.slice(15);
        const responseInputBtn = document.querySelector(`#response-input-btn-${currentId}`);
        const responseInput = document.querySelector(`#response-input-${currentId}`);
        const responseBtnWrapperText = document.querySelector(`#response-btn-wrapper-text-${currentId}`);
        const responseMistake = document.querySelector(`#response-mistake-text-${currentId}`);
        setTimeout(() => {
            responseInputBtn.style.display = "none";
            responseInput.style.display = "none";
            responseBtnWrapperText.style.display = "none";
            responseMistake.style.display = "none";
        }, 100);
    }
    // Activate additional submit button to add response to main comment
    activateResponseInputButton(input) {
        const currentId = input.id.slice(15);
        const responseInputBtn = document.querySelector(`#response-input-btn-${currentId}`);
        const responseInput = document.querySelector(`#response-input-${currentId}`);
        const responseBtnWrapperText = document.querySelector(`#response-btn-wrapper-text-${currentId}`);
        const responseMistake = document.querySelector(`#response-mistake-text-${currentId}`);
        if (responseInput.value) {
            responseInputBtn.style.display = "inline";
            responseBtnWrapperText.style.display = "inline";
        }
        else {
            responseInputBtn.style.display = "none";
            responseBtnWrapperText.style.display = "none";
        }
        if (responseInput.value.length > 1000) {
            responseMistake.style.visibility = "visible";
            this.diactivateBtn(responseInputBtn);
        }
        else {
            responseMistake.style.visibility = "hidden";
            this.activateBtn(responseInputBtn);
        }
        responseBtnWrapperText.textContent = `${responseInput.value.length}/1000`;
    }
    // Add response to main comment
    handleAddRes(button, e) {
        const currentId = button.id.slice(19);
        const addInput = document.querySelector(`#response-input-${currentId}`);
        const currentAddList = document.querySelector(`#comment-add-${currentId}`);
        const responseUsername = document.querySelector(`#user-name-${currentId}`);
        this.addComment(e, addInput, currentAddList, addListType, responseUsername.textContent, currentId);
        location.reload();
    }
}
// Filter comments
class FilterComment {
    favorites;
    favBtn;
    filterMainBtn;
    filterItemButtons;
    constructor() {
        this.favorites = false;
        this.favBtn = document.querySelector(".filter__favorites__btn");
        this.filterMainBtn = document.querySelector(".filter__button__list");
        this.filterItemButtons = document.querySelectorAll(".filter__drop__item");
    }
    // Event listeners of Filter comments
    filterCommentEvents() {
        this.favBtn?.addEventListener("click", () => this.filterFavComments());
        this.filterMainBtn?.addEventListener("click", function () {
            document.querySelector(".filter__drop__list")?.classList.toggle("active");
        });
        this.filterItemButtons.forEach((button) => {
            button.addEventListener("click", () => this.filterComments(button));
        });
    }
    // Filter favorite comments
    filterFavComments() {
        this.favorites = !this.favorites;
        let favs = [];
        const favoriteComments = comments.filter((comment) => comment.likeBtn === true);
        comments.forEach((fav) => {
            fav.responses?.forEach((response) => {
                favs.push(response);
            });
        });
        const favoriteResponses = favs.filter((fav) => fav.likeBtn === true);
        if (this.favorites) {
            const favText = document.querySelector(".filter__fav__text");
            const favBtn = document.querySelector(".filter__favorites__btn");
            favBtn.style.backgroundImage = "url('./assets/heart-full.svg')";
            favText.textContent = "Все комментарии";
            list.innerHTML = "";
            favoriteComments.forEach((comment) => {
                mainComment.createListElement(list, comment.id, comment.avatar, comment?.username, comment.date, comment.text, comment.likeBtn, comment.rating, mainListType, comment?.username);
            });
            favoriteResponses.forEach((comment) => {
                const parentUsername = comments.find((username) => username.id === comment.parentId);
                mainComment.createListElement(list, comment.id, comment.avatar, comment?.username, comment.date, comment.text, comment.likeBtn, comment.rating, addListType, parentUsername?.username);
            });
            const commentButtons = document.querySelectorAll(".comment-buttons__btn");
            const plusButtons = document.querySelectorAll(".plus");
            const minusButtons = document.querySelectorAll(".minus");
            commentButtons.forEach((button) => {
                button.style.cursor = "not-allowed";
            });
            plusButtons.forEach((button) => {
                button.style.cursor = "not-allowed";
            });
            minusButtons.forEach((button) => {
                button.style.cursor = "not-allowed";
            });
        }
        else {
            const favText = document.querySelector(".filter__fav__text");
            const favBtn = document.querySelector(".filter__favorites__btn");
            favBtn.style.backgroundImage = "url('./assets/heart-empty.svg')";
            favText.textContent = "Избранное";
            list.innerHTML = "";
            location.reload();
        }
        document.querySelector(".filter__drop__list")?.classList.remove("active");
    }
    // Filter comments by ratings, date and number of responses
    filterComments(button) {
        const filterNameCurrent = button.textContent?.trim();
        if (button.textContent?.trim() === "По количеству оценок") {
            comments.sort((a, b) => b.rating - a.rating);
        }
        if (button.textContent?.trim() === "По дате" ||
            button.textContent?.trim() === "По актуальности") {
            comments.sort((a, b) => new Date(a.dateToSort).getTime() - new Date(b.dateToSort).getTime());
        }
        if (button.textContent?.trim() === "По количеству ответов") {
            comments.sort((a, b) => b?.responses.length - a?.responses.length);
        }
        localStorage.setItem("comments", JSON.stringify(comments));
        localStorage.setItem("filterName", JSON.stringify(filterNameCurrent));
        location.reload();
    }
}
// Page components
class PageComponents {
    filterName;
    responsesList;
    constructor() {
        this.filterName = JSON.parse(localStorage.getItem("filterName") ?? "По актуальности");
        this.responsesList = [];
    }
    // Event listeners of page components
    pageComponentsEvents() {
        document.addEventListener("DOMContentLoaded", () => this.setPageComponents());
    }
    setPageComponents() {
        // Fetch random username details
        fetchData();
        // Update responseList array for all responses to main comments
        comments.forEach((comment) => {
            comment.responses?.forEach((response) => this.responsesList.push(response));
        });
        // Display comments' quantity based on the length of main comments and responseList arrays
        document.querySelector(".filter__comment__count").textContent = `(${comments.length + this.responsesList.length})`;
        // Display and update filter name by its type
        document.querySelector(".filter__drop__text").textContent =
            this.filterName;
    }
}
// Render page
comments.forEach((comment) => {
    const mainComment = new MainComment();
    // Render main comments
    mainComment.createListElement(list, comment.id, comment.avatar, comment?.username, comment.date, comment.text, comment.likeBtn, comment.rating, mainListType, comment?.username);
    // Render responses
    comment?.responses?.forEach((response) => {
        const listAdd = document.querySelector(`#comment-add-${response.parentId}`);
        if (listAdd) {
            mainComment.createListElement(listAdd, response.id, response.avatar, response?.username, response.date, response.text, response.likeBtn, response.rating, addListType, comment?.username);
        }
    });
});
const mainComment = new MainComment();
const responseComment = new ResponseComment();
const filterComment = new FilterComment();
const pageComponents = new PageComponents();
mainComment.mainCommentEvents();
responseComment.responseCommentEvents();
filterComment.filterCommentEvents();
pageComponents.pageComponentsEvents();
