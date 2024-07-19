import { comments } from "../index.js";
import { list } from "../index.js";
import { MainComment } from "./mainComment.mjs";
export class FilterComment {
  favorites;
  favBtn;
  filterMainBtn;
  filterItemButtons;
  mainComment;
  constructor() {
    this.mainComment = new MainComment();
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
      document.querySelector(".filter__btn-img")?.classList.toggle("rotate");
    });
    this.filterItemButtons.forEach((button) => {
      button.addEventListener("click", () => this.filterComments(button));
    });
  }
  // Filter favorite comments
  filterFavComments() {
    this.favorites = !this.favorites;
    let favs = [];
    const favoriteComments = comments.filter(
      (comment) => comment.likeBtn === true
    );
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
        this.mainComment.createListElement(
          list,
          comment.id,
          comment.avatar,
          comment?.username,
          comment.date,
          comment.text,
          comment.likeBtn,
          comment.rating,
          this.mainComment.mainListType,
          comment?.username
        );
      });
      favoriteResponses.forEach((comment) => {
        const parentUsername = comments.find(
          (username) => username.id === comment.parentId
        );
        this.mainComment.createListElement(
          list,
          comment.id,
          comment.avatar,
          comment?.username,
          comment.date,
          comment.text,
          comment.likeBtn,
          comment.rating,
          this.mainComment.addListType,
          parentUsername?.username
        );
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
    } else {
      const favText = document.querySelector(".filter__fav__text");
      const favBtn = document.querySelector(".filter__favorites__btn");
      favBtn.style.backgroundImage = "url('./assets/heart-empty.svg')";
      favText.textContent = "Избранное";
      list.innerHTML = "";
      location.reload(); // change with function
    }
    document.querySelector(".filter__drop__list")?.classList.remove("active");
    document.querySelector(".filter__btn-img")?.classList.remove("rotate");
  }
  // Filter comments by ratings, date and number of responses
  filterComments(button) {
    const filterNameCurrent = button.textContent?.trim();
    if (button.textContent?.trim() === "По количеству оценок") {
      comments.sort((a, b) => b.rating - a.rating);
    }
    if (
      button.textContent?.trim() === "По дате" ||
      button.textContent?.trim() === "По актуальности"
    ) {
      comments.sort(
        (a, b) =>
          new Date(a.dateToSort).getTime() - new Date(b.dateToSort).getTime()
      );
    }
    if (button.textContent?.trim() === "По количеству ответов") {
      comments.sort((a, b) => b?.responses.length - a?.responses.length);
    }
    localStorage.setItem("comments", JSON.stringify(comments));
    filterNameCurrent
      ? localStorage.setItem("filterName", filterNameCurrent)
      : localStorage.removeItem("filterName");
    location.reload(); // change with function
  }
}
