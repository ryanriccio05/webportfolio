document.addEventListener("DOMContentLoaded", function () {
    const contents = document.querySelectorAll(".content");
    const inputs = document.querySelectorAll(".numberinput");
    let isLocked = false;
  
    contents.forEach(content => {
      content.addEventListener("click", function () {
        if (isLocked) {
          return;
        }

        const value = this.querySelector(".number").textContent;
  
        if (value !== "<") {
          for (let i = 0; i < inputs.length; i++) {
            if (!inputs[i].textContent) {
              inputs[i].textContent = value;
              inputs[i].classList.add("nocircle");
              checkCode();
              break;
            }
          }
        } else {
          for (let i = inputs.length - 1; i >= 0; i--) {
            if (inputs[i].textContent) {
              inputs[i].textContent = "";
              inputs[i].classList.remove("nocircle");
              break;
            }
          }
        }
      });
    });
  
    function checkCode() {
      let entered = "";
      inputs.forEach(input => {
        entered += input.textContent;
      });
  
      // Valid Codes
      if (entered === "7777") {
        inputs.forEach(input => input.style.color = "green");
  
        setTimeout(() => {
          window.location.href = "fun/casino.html"; 
        }, 500);
      }

      if (entered === "1998") {
        inputs.forEach(input => input.style.color = "green");
  
        setTimeout(() => {
          window.location.href = "fun/minesweeper.html"; 
        }, 500);
      }

      if (entered === "1225") {
        isLocked = true;
        inputs.forEach(input => input.style.color = "green");
        showSwoonAndClose();
      }
    }

    function showSwoonAndClose() {
      const overlay = document.createElement("div");
      overlay.className = "swoon-overlay";

      const image = document.createElement("img");
      image.src = "assets/deltarune-swoon.gif";
      image.alt = "";

      overlay.appendChild(image);
      document.body.appendChild(overlay);

      setTimeout(() => {
        window.location.href = "index.html";
      }, 3000);
    }
  });
  
