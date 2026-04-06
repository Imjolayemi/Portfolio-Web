(function ($) {
    "use strict";

    // Spinner
    var spinner = function () {
        setTimeout(function () {
            if ($('#spinner').length > 0) {
                $('#spinner').removeClass('show');
            }
        }, 1);
    };
    spinner();
    
    
    // Initiate the wowjs
    new WOW().init();


    // Navbar on scrolling
    $(window).scroll(function () {
        if ($(this).scrollTop() > 300) {
            $('.navbar').fadeIn('slow').css('display', 'flex');
        } else {
            $('.navbar').fadeOut('slow').css('display', 'none');
        }
    });


    // Smooth scrolling on the navbar links
    $(".navbar-nav a").on('click', function (event) {
        if (this.hash !== "") {
            event.preventDefault();
            
            $('html, body').animate({
                scrollTop: $(this.hash).offset().top - 45
            }, 1500, 'easeInOutExpo');
            
            if ($(this).parents('.navbar-nav').length) {
                $('.navbar-nav .active').removeClass('active');
                $(this).closest('a').addClass('active');
            }
        }
    });
    
    
    // Back to top button — click scrolls to top
    $('.back-to-top').click(function () {
        $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
        return false;
    });
    

    // Typed Initiate
    if ($('.typed-text-output').length == 1) {
        var typed_strings = $('.typed-text').text();
        var typed = new Typed('.typed-text-output', {
            strings: typed_strings.split(', '),
            typeSpeed: 100,
            backSpeed: 20,
            smartBackspace: false,
            loop: true
        });
    }


    // Facts counter
    $('[data-toggle="counter-up"]').counterUp({
        delay: 10,
        time: 2000
    });


    // Skills
    $('.skill').waypoint(function () {
        $('.progress .progress-bar').each(function () {
            $(this).css("width", $(this).attr("aria-valuenow") + '%');
        });
    }, {offset: '80%'});


    // Portfolio isotope and filter
    var portfolioIsotope = $('.portfolio-container').isotope({
        itemSelector: '.portfolio-item',
        layoutMode: 'fitRows'
    });
    $('#portfolio-flters li').on('click', function () {
        $("#portfolio-flters li").removeClass('active');
        $(this).addClass('active');

        portfolioIsotope.isotope({filter: $(this).data('filter')});
    });


})(jQuery);


// GitHub Repos Loader
(function () {
    const username = 'Imjolayemi';
    const container = document.getElementById('github-repos');
    if (!container) return;

    fetch(`https://api.github.com/users/${username}/repos?sort=updated&per_page=6`)
        .then(res => res.json())
        .then(repos => {
            if (!repos || repos.length === 0) {
                container.innerHTML = '<p class="text-muted small">No public repositories found.</p>';
                return;
            }
            container.innerHTML = repos.map(repo => `
                <a href="${repo.html_url}" target="_blank" class="github-repo-item d-flex justify-content-between align-items-start text-decoration-none mb-2 p-2 rounded">
                    <div>
                        <span class="fw-semibold text-dark">${repo.name}</span>
                        ${repo.description ? `<br><small class="text-muted">${repo.description.substring(0, 70)}${repo.description.length > 70 ? '…' : ''}</small>` : ''}
                    </div>
                    <div class="text-end flex-shrink-0 ms-2">
                        ${repo.language ? `<span class="badge bg-primary-subtle text-primary" style="font-size:0.7rem">${repo.language}</span>` : ''}
                        <br><small class="text-muted"><i class="fa fa-star"></i> ${repo.stargazers_count}</small>
                    </div>
                </a>
            `).join('');
        })
        .catch(() => {
            container.innerHTML = '<p class="text-muted small">Could not load repositories. <a href="https://github.com/Imjolayemi" target="_blank">View on GitHub</a>.</p>';
        });
})();


// Contact Form AJAX Handler
(function () {
    const contactForm = document.getElementById('contactForm');
    const formMessage = document.getElementById('formMessage');

    if (contactForm) {
        contactForm.addEventListener('submit', function (e) {
            e.preventDefault();
            const submitBtn = contactForm.querySelector('button[type="submit"]');
            const originalBtnText = submitBtn.innerHTML;
            
            // Loading state
            submitBtn.innerHTML = '<span class="spinner-border spinner-border-sm" role="status" aria-hidden="true"></span> Sending...';
            submitBtn.disabled = true;
            formMessage.innerHTML = '';

            const formData = new FormData(this);

            fetch(this.action, {
                method: this.method,
                body: formData,
                headers: {
                    'Accept': 'application/json'
                }
            })
            .then(response => {
                if (response.ok) {
                    return response.json();
                }
                throw new Error('Network response was not ok.');
            })
            .then(data => {
                if (data && (data.success === 'true' || data.success === true)) {
                    formMessage.innerHTML = `<div class="alert alert-success">Message sent successfully! Be sure to check your email inbox to confirm delivery.</div>`;
                    contactForm.reset();
                } else {
                    formMessage.innerHTML = `<div class="alert alert-danger">${data ? (data.message || 'Error sending message.') : 'Unknown error occurred.'}</div>`;
                }
            })
            .catch(error => {
                formMessage.innerHTML = '<div class="alert alert-danger">Cannot send message at this time. Please try again later.</div>';
                console.error('Form Submission Error:', error);
            })
            .finally(() => {
                submitBtn.innerHTML = originalBtnText;
                submitBtn.disabled = false;
            });
        });
    }
})();
