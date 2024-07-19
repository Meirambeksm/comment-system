import { comments } from "../index.js";
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
  } catch (error) {
    console.error(`There was an error loading data..., ${error}`);
  }
}
export class PageComponents {
  filterName;
  responsesList;
  constructor() {
    this.filterName = localStorage.getItem("filterName") ?? "По актуальности";
    this.responsesList = [];
  }
  // Event listeners of page components
  pageComponentsEvents() {
    document.addEventListener("DOMContentLoaded", () =>
      this.setPageComponents()
    );
  }
  setPageComponents() {
    // Fetch random username details
    fetchData();
    // Update responseList array for all responses to main comments
    comments.forEach((comment) => {
      comment.responses?.forEach((response) =>
        this.responsesList.push(response)
      );
    });
    // Display comments' quantity based on the length of main comments and responseList arrays
    document.querySelector(".filter__comment__count").textContent = `(${
      comments.length + this.responsesList.length
    })`;
    // Display and update filter name by its type
    document.querySelector(".filter__drop__text").textContent = this.filterName;
  }
}
