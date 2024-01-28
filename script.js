


const app = {
    init: function() {
        this.initMessenger();
        this.menuSlide();
        this.arrowSlide();
        this.backToTop();
        this.switchLight();
    },

    initMessenger: function() {
        const Messenger = function(el) {
            'use strict';
            let m = this;

            m.init = function() {
                m.codeletters = "&#*+%?Â£@Â§$";
                m.message = 0;
                m.current_length = 0;
                m.fadeBuffer = false;
                m.messages = ['Khwaja Shaikh'];

                setTimeout(m.animateIn, 100);
            };

            m.generateRandomString = function(length) {
                let random_text = '';
                while (random_text.length < length) {
                    random_text += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
                }

                return random_text;
            };

            m.animateIn = function() {
                if (m.current_length < m.messages[m.message].length) {
                    m.current_length = m.current_length + 2;
                    if (m.current_length > m.messages[m.message].length) {
                        m.current_length = m.messages[m.message].length;
                    }

                    let message = m.generateRandomString(m.current_length);
                    el.html(message);

                    setTimeout(m.animateIn, 20);
                } else {
                    setTimeout(m.animateFadeBuffer, 20);
                }
            };

            m.animateFadeBuffer = function() {
                if (m.fadeBuffer === false) {
                    m.fadeBuffer = [];
                    for (let i = 0; i < m.messages[m.message].length; i++) {
                        m.fadeBuffer.push({
                            c: (Math.floor(Math.random() * 12)) + 1,
                            l: m.messages[m.message].charAt(i)
                        });
                    }
                }

                let do_cycles = false;
                let message = '';

                for (let i = 0; i < m.fadeBuffer.length; i++) {
                    let fader = m.fadeBuffer[i];
                    if (fader.c > 0) {
                        do_cycles = true;
                        fader.c--;
                        message += m.codeletters.charAt(Math.floor(Math.random() * m.codeletters.length));
                    } else {
                        message += fader.l;
                    }
                }

                el.html(message);

                if (do_cycles === true) {
                    setTimeout(m.animateFadeBuffer, 50);
                } else {
                    setTimeout(m.cycleText, 2000);
                }
            };

            m.cycleText = function() {
                m.message = m.message + 1;
                if (m.message >= m.messages.length) {
                    m.message = 0;
                }

                m.current_length = 0;
                m.fadeBuffer = false;
                el.html('`');

                setTimeout(m.animateIn, 10);
            };

            m.init();
        }

        let messenger = new Messenger($('#messenger'));
    },

    menuSlide: function() {
        // Add your menuSlide code here
    },

    arrowSlide: function() {
        // Add your arrowSlide code here
    },

    backToTop: function() {
        // Add your backToTop code here
    },

    switchLight: function() {
        // Add your switchLight code here
    }
};

$(document).ready(function() {
    app.init()
});

//    add link to about-me icon

let github = document.querySelector('#github-link')
let linkedin = document.querySelector('#linkedin-link')
let twitter = document.querySelector('#twitter-link')


github.addEventListener('click', function(){
    window.open('https://github.com/Shkkhwaja')
})

linkedin.addEventListener('click', function(){
    window.open('https://www.linkedin.com/in/khwaja-shaikh-960b981b1/')
})

twitter.addEventListener('click', function(){
    window.open('https://twitter.com/khwajas81112581')
})

// add link to project section
let firstLive = document.querySelector('.live-site p:nth-child(1)');
let firstGithub = document.querySelector('.live-site p:nth-child(2)');

firstLive.addEventListener('click', function(){
    window.open('https://shkkhwaja.github.io/Api-Food-App/')
})

firstGithub.addEventListener('click', function(){
    window.open('https://github.com/Shkkhwaja/Api-Food-App')
})

let secondLive = document.querySelector('#second-live p:nth-child(1)');
let secondGithub = document.querySelector('#second-live p:nth-child(2)');

secondLive.addEventListener('click', function(){
    window.open('https://shkkhwaja.github.io/university.github.io/')
})

secondGithub.addEventListener('click', function(){
    window.open('https://github.com/Shkkhwaja/university.github.io')
})

let thirdLive = document.querySelector('#third-live p:nth-child(1)');
let thirdGithub = document.querySelector('#third-live p:nth-child(2)');

thirdLive.addEventListener('click', function(){
    window.open('https://fitness-n-go-clone.vercel.app/')
})

thirdGithub.addEventListener('click', function(){
    window.open('https://github.com/Shkkhwaja/Fitness-nGo_Clone')
})





//  arrow element
let arrow = ()=>{
    const arr = document.querySelector('.down-arrow')
    arr.style.display = 'none'
}
    setTimeout(arrow, 3000);


    ////   Scroll down
    let home = document.querySelector('nav ul li:nth-child(1)');
    let about = document.querySelector('nav ul li:nth-child(2)');
    let skills = document.querySelector('nav ul li:nth-child(3)');
    let project = document.querySelector('nav ul li:nth-child(4)');
    let contact = document.querySelector('nav ul li:nth-child(5)');

    
    
    function smoothScrollTo(targetPosition, duration) {
        const startPosition = window.scrollY;
        const startTime = performance.now();
      
        function scrollAnimation(currentTime) {
          const elapsedTime = currentTime - startTime;
          const scrollProgress = Math.min(elapsedTime / duration, 1);
          const ease = easingFunction(scrollProgress);
          const newPosition = startPosition + (targetPosition - startPosition) * ease;
      
          window.scrollTo(0, newPosition);
      
          if (scrollProgress < 1) {
            requestAnimationFrame(scrollAnimation);
          }
        }
      
        function easingFunction(t) {
          // You can use different easing functions for the scroll animation.
          // Here's an example using the easeInOutQuad function.
          // You can explore other easing functions as well.
          return t < 0.5 ? 2 * t * t : -1 + (4 - 2 * t) * t;
        }
      
        requestAnimationFrame(scrollAnimation);
      }
      
      // Usage example:
      home.addEventListener('click', () => {
        smoothScrollTo(0, 1500);
      });
      
      about.addEventListener('click', () => {
        smoothScrollTo(600, 1000);
      });
      
      skills.addEventListener('click', () => {
        smoothScrollTo(1300, 1600);
      });
      
      project.addEventListener('click', () => {
        smoothScrollTo(1950, 2200);
      });

      contact.addEventListener('click', () => {
        smoothScrollTo(3800, 4200);
      });


