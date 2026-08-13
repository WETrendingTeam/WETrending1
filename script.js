
/* ==================================================
   WETrendingTeam v2.0
   SCRIPT FILE
================================================== */


/* ==========================
   LOADING SCREEN
========================== */

window.addEventListener("load",()=>{

    const loader = document.getElementById("loader");

    setTimeout(()=>{

        if(loader){

            loader.style.opacity="0";
            loader.style.visibility="hidden";

        }

    },2200);

});



/* ==========================
   HERO SLIDESHOW
========================== */

const slides = document.querySelectorAll(".slide");

let currentSlide = 0;


function showSlide(index){

    slides.forEach(slide=>{

        slide.classList.remove("active");

    });


    if(slides[index]){

        slides[index].classList.add("active");

    }

}


if(slides.length > 0){

    setInterval(()=>{

        currentSlide++;

        if(currentSlide >= slides.length){

            currentSlide = 0;

        }

        showSlide(currentSlide);

    },5000);

}




/* ==========================
   COUNTDOWN — YOU MANIAC RELEASE
   4:00 PM Thailand time (Asia/Bangkok)
========================== */

const releaseTarget = Date.UTC(2026, 7, 13, 9, 0, 0);

function updateCountdown(){

    const now = Date.now();
    const distance = releaseTarget - now;

    const daysEl = document.getElementById("days");
    const hoursEl = document.getElementById("hours");
    const minutesEl = document.getElementById("minutes");
    const secondsEl = document.getElementById("seconds");

    if(distance <= 0){
        if(daysEl) daysEl.textContent = "00";
        if(hoursEl) hoursEl.textContent = "00";
        if(minutesEl) minutesEl.textContent = "00";
        if(secondsEl) secondsEl.textContent = "00";

        const label = document.querySelector(".countdown .section-title");
        const sub = document.querySelector(".countdown .section-subtitle");
        if(label) label.textContent = "🔴 YOU MANIAC IS LIVE";
        if(sub) sub.textContent = "The campaign release time has arrived. Let's support WilliamEst worldwide.";
        return;
    }

    const days = Math.floor(distance / 86400000);
    const hours = Math.floor((distance % 86400000) / 3600000);
    const minutes = Math.floor((distance % 3600000) / 60000);
    const seconds = Math.floor((distance % 60000) / 1000);

    if(daysEl) daysEl.textContent = String(days).padStart(2,"0");
    if(hoursEl) hoursEl.textContent = String(hours).padStart(2,"0");
    if(minutesEl) minutesEl.textContent = String(minutes).padStart(2,"0");
    if(secondsEl) secondsEl.textContent = String(seconds).padStart(2,"0");
}

updateCountdown();
setInterval(updateCountdown,1000);




/* ==================================================
   PART 2
   THEME + MOBILE MENU + NAVBAR
================================================== */


const menuBtn = document.querySelector(".menu-btn");

const navLinks = document.querySelector(".nav-links");



if(menuBtn && navLinks){


    menuBtn.addEventListener("click",()=>{


        navLinks.classList.toggle(
            "mobile-active"
        );


        menuBtn.innerHTML =
        navLinks.classList.contains(
            "mobile-active"
        )
        ?
        '<i class="fa-solid fa-xmark"></i>'
        :
        '<i class="fa-solid fa-bars"></i>';


    });



    document.querySelectorAll(
        ".nav-links a"
    )
    .forEach(link=>{


        link.addEventListener("click",()=>{


            navLinks.classList.remove(
                "mobile-active"
            );


            menuBtn.innerHTML =
            '<i class="fa-solid fa-bars"></i>';


        });


    });


}




/* ==========================
   NAVBAR SCROLL EFFECT
========================== */


const navbar =
document.querySelector(".navbar");


window.addEventListener("scroll",()=>{


    if(!navbar){

        return;

    }


    if(window.scrollY > 80){

        navbar.classList.add(
            "scrolled"
        );

    }

    else{

        navbar.classList.remove(
            "scrolled"
        );

    }


});




/* ==================================================
   PART 3
   BACK TO TOP + SCROLL ANIMATION
================================================== */


const backToTop =
document.getElementById(
    "backToTop"
);



if(backToTop){


    window.addEventListener("scroll",()=>{


        if(window.scrollY > 400){

            backToTop.classList.add(
                "show"
            );

        }

        else{

            backToTop.classList.remove(
                "show"
            );

        }


    });



    backToTop.addEventListener(
        "click",
        ()=>{


            window.scrollTo({

                top:0,

                behavior:"smooth"

            });


        }

    );


}




/* ==========================
   SCROLL REVEAL
========================== */


const revealElements =
document.querySelectorAll(
"section, .status-card, .mission-card, .rating-card, .event-card"
);



if("IntersectionObserver" in window){


    const revealObserver =
    new IntersectionObserver(

    (entries)=>{


        entries.forEach(entry=>{


            if(entry.isIntersecting){


                entry.target.classList.add(
                    "active"
                );


                revealObserver.unobserve(
                    entry.target
                );


            }


        });


    },

    {
        threshold:.15
    }

    );



    revealElements.forEach(element=>{


        element.classList.add(
            "reveal"
        );


        revealObserver.observe(
            element
        );


    });


}

/* ==========================
   WATCH PLATFORM POPUP
========================== */


const platformPopup =
document.getElementById(
    "platformPopup"
);



const episodeButtons =
document.querySelectorAll(
    ".episode-btn"
);



const popupClose =
document.querySelector(
    ".popup-close"
);



// OPEN POPUP

episodeButtons.forEach(button=>{


    button.addEventListener(
        "click",
        ()=>{


            if(platformPopup){

                platformPopup.style.display = "flex";

            }


        }

    );


});




// CLOSE BUTTON

if(popupClose){


    popupClose.addEventListener(
        "click",
        ()=>{


            platformPopup.style.display = "none";


        }

    );


}




// CLOSE OUTSIDE POPUP

window.addEventListener(
    "click",
    (e)=>{


        if(e.target === platformPopup){


            platformPopup.style.display = "none";


        }


    }

);



