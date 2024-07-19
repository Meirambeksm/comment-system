import { MainComment } from "./mainComment.mjs";
export class ResponseComment extends MainComment {
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
    this.responseInputButtons = document.querySelectorAll(
      ".response-input-btn"
    );
    this.likeButtonsRes = document.querySelectorAll(
      `.${this.addListType}-like-btn`
    );
    this.plusButtonsRes = document.querySelectorAll(
      `.${this.addListType}-plus`
    );
    this.minusButtonsRes = document.querySelectorAll(
      `.${this.addListType}-minus`
    );
  }
  // Event listeners of response comments
  responseCommentEvents() {
    this.responseButtons.forEach((button) => {
      button.addEventListener("click", () =>
        this.activateResponseInput(button)
      );
    });
    this.responseInputs.forEach((input) => {
      input.addEventListener("blur", () => this.inactivateResponseInput(input));
    });
    this.responseInputs.forEach((input) => {
      input.addEventListener("input", () =>
        this.activateResponseInputButton(input)
      );
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
    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    );
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    );
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    );
    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    );
    responseInput.style.display = "inline";
    responseInput.focus();
    if (responseInput.value) {
      responseInputBtn.style.display = "inline";
      responseBtnWrapperText.style.display = "inline";
      responseMistake.style.display = "inline";
    }
    document.querySelector(".filter__drop__list")?.classList.remove("active");
    document.querySelector(".filter__btn-img")?.classList.remove("rotate");
  }
  // Inactivate additional input
  inactivateResponseInput(input) {
    const currentId = input.id.slice(15);
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    );
    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    );
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    );
    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    );
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
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    );
    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    );
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    );
    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    );
    if (responseInput.value) {
      responseInputBtn.style.display = "inline";
      responseBtnWrapperText.style.display = "inline";
    } else {
      responseInputBtn.style.display = "none";
      responseBtnWrapperText.style.display = "none";
    }
    if (responseInput.value.length > 1000) {
      responseMistake.style.visibility = "visible";
      this.diactivateBtn(responseInputBtn);
    } else {
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
    this.addComment(
      e,
      addInput,
      currentAddList,
      this.addListType,
      responseUsername.textContent,
      currentId
    );
    location.reload(); // change with function
  }
}
