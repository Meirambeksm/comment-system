import { MainComment } from "./mainComment";
import { comments } from "../index";

export interface Responses {
  avatar: string;
  date: string;
  dateToSort: Date;
  id: string;
  likeBtn: boolean;
  parentId: string;
  rating: number;
  responses?: never[];
  text: string;
  username: string | null;
}

export class ResponseComment extends MainComment {
  private responseButtons: NodeListOf<HTMLButtonElement>;
  private responseInputs: NodeListOf<HTMLInputElement>;
  private responseInputButtons: NodeListOf<HTMLButtonElement>;
  private likeButtonsRes: NodeListOf<HTMLButtonElement>;
  private plusButtonsRes: NodeListOf<HTMLButtonElement>;
  private minusButtonsRes: NodeListOf<HTMLButtonElement>;
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
  public responseCommentEvents(): void {
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
  private activateResponseInput(button: HTMLButtonElement): void {
    const currentId = button.id.slice(13);
    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    ) as HTMLInputElement;
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    ) as HTMLButtonElement;
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    ) as HTMLSpanElement;

    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    ) as HTMLSpanElement;

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
  private inactivateResponseInput(input: HTMLInputElement): void {
    const currentId = input.id.slice(15);
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    ) as HTMLButtonElement;
    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    ) as HTMLInputElement;
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    ) as HTMLSpanElement;
    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    ) as HTMLSpanElement;

    setTimeout(() => {
      responseInputBtn.style.display = "none";
      responseInput.style.display = "none";
      responseBtnWrapperText.style.display = "none";
      responseMistake.style.display = "none";
    }, 100);
  }

  // Activate additional submit button to add response to main comment
  private activateResponseInputButton(input: HTMLInputElement): void {
    const currentId = input.id.slice(15);
    const responseInputBtn = document.querySelector(
      `#response-input-btn-${currentId}`
    ) as HTMLButtonElement;

    const responseInput = document.querySelector(
      `#response-input-${currentId}`
    ) as HTMLInputElement;
    const responseBtnWrapperText = document.querySelector(
      `#response-btn-wrapper-text-${currentId}`
    ) as HTMLSpanElement;

    const responseMistake = document.querySelector(
      `#response-mistake-text-${currentId}`
    ) as HTMLSpanElement;

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
  private handleAddRes(button: HTMLButtonElement, e: MouseEvent) {
    const currentId = button.id.slice(19);
    const addInput = document.querySelector(
      `#response-input-${currentId}`
    ) as HTMLInputElement;
    const currentAddList = document.querySelector(
      `#comment-add-${currentId}`
    ) as HTMLUListElement;
    const responseUsername = document.querySelector(
      `#user-name-${currentId}`
    ) as HTMLSpanElement;

    this.addComment(
      e,
      addInput,
      currentAddList,
      this.addListType,
      responseUsername.textContent!,
      currentId
    );

    location.reload(); // change with function
  }
}
