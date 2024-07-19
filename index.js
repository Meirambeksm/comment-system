import { MainComment } from "./typescript/mainComment.mjs";
import { ResponseComment } from "./typescript/responseComment.mjs";
import { FilterComment } from "./typescript/filterComment.mjs";
import { PageComponents } from "./typescript/PageComponents.mjs";
// Initial variables
export const list = document.querySelector(".comment");
export const comments = JSON.parse(localStorage.getItem("comments") ?? "[]");
// Render page
function renderPage() {
  comments.forEach((comment) => {
    const mainComment = new MainComment();
    // Render main comments
    mainComment.createListElement(
      list,
      comment.id,
      comment.avatar,
      comment?.username,
      comment.date,
      comment.text,
      comment.likeBtn,
      comment.rating,
      mainComment.mainListType,
      comment?.username
    );
    // Render responses
    comment?.responses?.forEach((response) => {
      const listAdd = document.querySelector(
        `#comment-add-${response.parentId}`
      );
      if (listAdd) {
        mainComment.createListElement(
          listAdd,
          response.id,
          response.avatar,
          response?.username,
          response.date,
          response.text,
          response.likeBtn,
          response.rating,
          mainComment.addListType,
          comment?.username
        );
      }
    });
  });
}
renderPage();
const mainComment = new MainComment();
const responseComment = new ResponseComment();
const filterComment = new FilterComment();
const pageComponents = new PageComponents();
mainComment.mainCommentEvents();
responseComment.responseCommentEvents();
filterComment.filterCommentEvents();
pageComponents.pageComponentsEvents();
