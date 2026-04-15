document.addEventListener("DOMContentLoaded", function () {
    const contents = document.querySelectorAll(".content");
    const inputs = document.querySelectorAll(".numberinput");
  
    contents.forEach(content => {
      content.addEventListener("click", function () {
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
    }
  });
  