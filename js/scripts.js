/*!
* Start Bootstrap - Simple Sidebar v6.0.6 (https://startbootstrap.com/template/simple-sidebar)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-simple-sidebar/blob/master/LICENSE)
*/
// 
// Scripts
// 

window.addEventListener('DOMContentLoaded', event => {

    // Toggle the side navigation
    const sidebarToggle = document.body.querySelector('#sidebarToggle');
    if (sidebarToggle) {
        // Uncomment Below to persist sidebar toggle between refreshes
         if (localStorage.getItem('sb|sidebar-toggle') === 'true') {
             document.body.classList.toggle('sb-sidenav-toggled');
        }
        sidebarToggle.addEventListener('click', event => {
            event.preventDefault();
            document.body.classList.toggle('sb-sidenav-toggled');
            localStorage.setItem('sb|sidebar-toggle', document.body.classList.contains('sb-sidenav-toggled'));
        });
    }

});

var clockElement = document.getElementById('clock');
                    
                        function clock() {
                            clockElement.textContent = new Date().toLocaleString();
                        }
                    
                        setInterval(clock, 100);

function getJoke() {
    var request = new XMLHttpRequest();
    //use this end point to get one joke
    request.open("GET", "https://official-joke-api.appspot.com/random_joke");
    request.onload = function(){
        var data = JSON.parse(this.response);
        console.log(data);
        console.log(data.setup);
        console.log(data.punchline);
        document.getElementById("setup").textContent = data.setup;
        document.getElementById("punchline").textContent = data.punchline;
    }
     
    request.send();

}

// Simple security system prototype. Not secure of course, but adds a layer of hiddenness to a casual viewer.
// Base64-encoded secret values (this would ideally be done server-side, but this is just for fun.)
const encodedSecrets = {
    banner: "MDI1NDU0MTk=",              
    loc1: "VG9sZW50aW5lIDQxNw==",      
    loc2: "VmFzZXkgSGFsbCAyMDU=",       
    loc3: "VG9sZW50aW5lIDMwOQ==",       
    loc4: "TWVuZGVsIEhhbGwgRzkz",       
    loc5: "TWVuZGVsIEhhbGwgRzg3"        
};

// Password (oh no, don't tell anyone!)
const correctPassword = "WebPassword123";

// Decode Base64
function decodeBase64(str) {
    try { return atob(str); }
    catch { return "[decode error]"; }
}

document.addEventListener("DOMContentLoaded", () => {
    const revealButtons = document.querySelectorAll(".revealBtn");

    revealButtons.forEach(btn => {
        btn.addEventListener("click", (event) => {
            event.preventDefault(); // stops link navigation

            const userInput = prompt("Enter password to reveal:");

            if (userInput === correctPassword) {

                // Reveal ALL protected elements
                document.querySelectorAll(".hidden-protected").forEach(el => {
                    const key = el.dataset.key;
                    const decoded = decodeBase64(encodedSecrets[key]);
                    el.textContent = decoded;
                });

                // Hide ALL reveal buttons
                document.querySelectorAll(".revealBtn").forEach(b => {
                    b.style.display = "none";
                });

                // If this is a syllabi link, redirect to its href
                if (btn.classList.contains("syllabiLink")) {
                    const target = btn.getAttribute("href");
                    window.location.href = target;
                }

            } else if (userInput !== null) {
                alert("Incorrect password.");
            }
        });
    });
});