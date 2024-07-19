import { comments } from "../index";
import { list } from "../index";
import { Responses } from "./responseComment";

export interface Comments {
  avatar: string;
  date: string;
  dateToSort: Date;
  id: string;
  likeBtn: boolean;
  parentId: string;
  rating: number;
  responses?: Responses[];
  text: string;
  username: string | null;
}

export class MainComment {
  public mainListType: string;
  public addListType: string;
  private submitBtn: HTMLButtonElement | null;
  private mainInput: HTMLInputElement | null;
  private likeButtonsMain: NodeListOf<HTMLButtonElement>;
  private plusButtonsMain: NodeListOf<HTMLButtonElement>;
  private minusButtonsMain: NodeListOf<HTMLButtonElement>;
  constructor() {
    this.mainListType = "main-list";
    this.addListType = "add-list";
    this.submitBtn = document.querySelector(".submit-btn");
    this.mainInput = document.querySelector(".input-field__input");
    this.likeButtonsMain = document.querySelectorAll(
      `.${this.mainListType}-like-btn`
    );
    this.plusButtonsMain = document.querySelectorAll(
      `.${this.mainListType}-plus`
    );
    this.minusButtonsMain = document.querySelectorAll(
      `.${this.mainListType}-minus`
    );
  }

  // Event listeners of main comment
  public mainCommentEvents(): void {
    this.submitBtn?.addEventListener("click", (e: MouseEvent) =>
      this.addComment(e, this.mainInput!, list, this.mainListType, "0", "0")
    );

    this.mainInput?.addEventListener("input", (e: Event) =>
      this.showHideSubmitBtn(e)
    );

    this.mainInput?.addEventListener("focus", () => {
      document.querySelector(".filter__drop__list")?.classList.remove("active");
      document.querySelector(".filter__btn-img")?.classList.remove("rotate");
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
  protected addComment(
    e: MouseEvent,
    input: HTMLInputElement,
    listContainer: HTMLElement,
    type: string,
    responseUsername: string,
    id: string
  ): void {
    const date = new Date();
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const hours = date.getUTCHours().toString().padStart(2, "0");
    const minutes = date.getUTCMinutes().toString().padStart(2, "0");

    const username = document.querySelector(".user-name") as HTMLSpanElement;
    const avatar = document.querySelector(".input__image") as HTMLImageElement;

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

    this.createListElement(
      listContainer,
      usernameDetails.id,
      usernameDetails.avatar,
      usernameDetails.username!,
      usernameDetails.date,
      input.value,
      usernameDetails.likeBtn,
      usernameDetails.rating,
      type,
      responseUsername
    );

    if (
      e.target instanceof HTMLElement &&
      e.target.classList.value.trim() === "submit-btn"
    ) {
      comments.push(usernameDetails);
    }

    if (
      e.target instanceof HTMLElement &&
      e.target.classList.value.trim() === "response-input-btn"
    ) {
      const comment = comments.find((comment: Comments) => comment.id === id);
      comment?.responses?.push(usernameDetails);
    }

    localStorage.setItem("comments", JSON.stringify(comments));
    input.value = "";
  }

  // Create elements (li, btn, span, etc.)
  public createListElement(
    listContainer: HTMLElement,
    id: string,
    avatar: string,
    username: string,
    date: string,
    comment: string,
    likeStatus: boolean,
    rating: number,
    type: string,
    responseUsername: string
  ): void {
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
    minusBtn.setAttribute(
      "class",
      `comment-buttons__rating__btn minus ${type}-minus`
    );
    minusBtn.setAttribute("id", `minus-${id}`);
    minusBtn.textContent = "-";

    const ratingStatus = rating < 0 ? "ratingNegative" : "ratingPositive";

    const ratingText = document.createElement("span");
    ratingText.setAttribute("class", ratingStatus);
    ratingText.setAttribute("id", `rating-${id}`);
    ratingText.textContent = rating.toString();

    const plusBtn = document.createElement("button");
    plusBtn.setAttribute(
      "class",
      `comment-buttons__rating__btn plus ${type}-plus`
    );
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
    responseBtnWrapperText.setAttribute(
      "id",
      `response-btn-wrapper-text-${id}`
    );
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
  private showHideSubmitBtn(e: Event): void {
    const counter = (e.target as HTMLInputElement).value.length;
    const maxText = document.querySelector(".input-field__max") as HTMLElement;
    const mistakeText = document.querySelector(".mistake__text") as HTMLElement;

    if (counter > 0) {
      this.activateBtn(this.submitBtn!);
      maxText.textContent = `${counter}/1000`;
    } else {
      this.diactivateBtn(this.submitBtn!);
    }

    if (counter > 1000) {
      mistakeText.style.visibility = "visible";
      this.diactivateBtn(this.submitBtn!);
    } else {
      mistakeText.style.visibility = "hidden";
    }
  }

  // Activate buttons
  protected activateBtn(button: HTMLButtonElement): void {
    button.disabled = false;
    button.style.cursor = "pointer";
    button.style.backgroundColor = "#ABD873";
    button.style.color = "#000";
  }

  // Inactivate buttons
  protected diactivateBtn(button: HTMLButtonElement): void {
    button.disabled = true;
    button.style.cursor = "not-allowed";
    button.style.backgroundColor = "rgba(161, 161, 161, 0.4)";
    button.style.color = "rgba(0, 0, 0, 0.4)";
  }

  // Handle like buttons
  protected handleLike(button: HTMLButtonElement): void {
    let comment: Comments | undefined;
    let response: Responses | undefined;
    const currentId = button.id.slice(9);
    const currentImg = document.querySelector(
      `#like-btn-img-${currentId}`
    ) as HTMLImageElement;
    const likeBtnText = document.querySelector(
      `#like-btn-text-${currentId}`
    ) as HTMLSpanElement;

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
        ?.parentNode?.parentNode?.parentNode as HTMLElement;

      const parentId = parentListItem?.id.slice(10);
      comment = comments.find((comment) => comment.id === parentId);
      response = comment?.responses?.find(
        (response) => response.id === currentId
      );
      response!.likeBtn = !response?.likeBtn;
      currentImg.src = response?.likeBtn
        ? "/assets/heart-full.svg"
        : "/assets/heart-empty.svg";
      likeBtnText.textContent = response?.likeBtn
        ? "В избранном"
        : "В избранное";
    }

    document.querySelector(".filter__drop__list")?.classList.remove("active");
    document.querySelector(".filter__btn-img")?.classList.remove("rotate");
    localStorage.setItem("comments", JSON.stringify(comments));
  }

  // Handle plus buttons to increase rating
  protected handleIncreaseRating(button: HTMLButtonElement): void {
    if (button.dataset.clicked === "true") return;
    let comment: Comments | undefined;
    let response: Responses | undefined;
    const currentId = button.id.slice(5);
    const currentRating = document.querySelector(
      `#rating-${currentId}`
    ) as HTMLSpanElement;
    const currentValue = parseInt(currentRating.textContent!) + 1;

    if (button.classList[2] === "main-list-plus") {
      comment = comments.find((comment) => comment.id === currentId);
      comment!.rating = currentValue;
    }

    if (button.classList[2] === "add-list-plus") {
      const parentListItem = button.parentNode?.parentNode?.parentNode
        ?.parentNode?.parentNode?.parentNode?.parentNode as HTMLElement;
      const parentId = parentListItem?.id.slice(10);

      comment = comments.find((comment) => comment.id === parentId);
      response = comment?.responses?.find(
        (response) => response.id === currentId
      );
      response!.rating = currentValue;
    }

    currentRating.textContent = currentValue.toString();

    if (currentValue >= 0) {
      currentRating.style.color = "#8ac540";
    }
    document.querySelector(".filter__drop__list")?.classList.remove("active");
    document.querySelector(".filter__btn-img")?.classList.remove("rotate");
    localStorage.setItem("comments", JSON.stringify(comments));
    button.dataset.clicked = "true";
  }

  // Handle minus buttons to decrease rating
  protected handleDecreaseRating(button: HTMLButtonElement): void {
    if (button.dataset.clicked === "true") return;
    let comment: Comments | undefined;
    let response: Responses | undefined;
    const currentId = button.id.slice(6);
    const currentRating = document.querySelector(
      `#rating-${currentId}`
    ) as HTMLSpanElement;
    const currentValue = parseInt(currentRating.textContent!) - 1;

    if (button.classList[2] === "main-list-minus") {
      comment = comments.find((comment) => comment.id === currentId);
      comment!.rating = currentValue;
    }

    if (button.classList[2] === "add-list-minus") {
      const parentListItem = button.parentNode?.parentNode?.parentNode
        ?.parentNode?.parentNode?.parentNode?.parentNode as HTMLElement;
      const parentId = parentListItem?.id.slice(10);
      comment = comments.find((comment) => comment.id === parentId);
      response = comment?.responses?.find(
        (response) => response.id === currentId
      );
      response!.rating = currentValue;
    }

    currentRating.textContent = currentValue.toString();

    if (currentValue < 0) {
      currentRating.style.color = "#ff0000";
    }
    document.querySelector(".filter__drop__list")?.classList.remove("active");
    document.querySelector(".filter__btn-img")?.classList.remove("rotate");
    localStorage.setItem("comments", JSON.stringify(comments));
    button.dataset.clicked = "true";
  }
}
