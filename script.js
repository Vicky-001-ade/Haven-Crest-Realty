/**
 * Haven & Crest Realty — Global Client Script
 * Vanilla JavaScript implementation for luxury real estate interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initStickyHeader();
  initMobileNav();
  initBackToTop();
  initScrollReveal();
  initCountUpStats();
  initFAQAccordion();
  initContactForm();
  initPropertyModal();
  initNewsletterForm();
  initFooterYear();
  initSearchForm();
  initImageFallbacks();
  initAnchorHighlights();
});

/* --------------------------------------------------------------------------
   1. Sticky Header & Scroll Management
   -------------------------------------------------------------------------- */
function initStickyHeader() {
  const header = document.querySelector('.site-header');
  if (!header) return;

  const handleScroll = () => {
    if (window.scrollY > 40) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleScroll, { passive: true });
  handleScroll(); // Initial check
}

/* --------------------------------------------------------------------------
   2. Accessible Mobile Navigation Overlay
   -------------------------------------------------------------------------- */
function initMobileNav() {
  const hamburgerBtn = document.querySelector('.hamburger-btn');
  const mobileOverlay = document.querySelector('.mobile-overlay');
  const navLinks = document.querySelectorAll('.mobile-nav-link, .mobile-overlay a');
  if (!hamburgerBtn || !mobileOverlay) return;

  const openMenu = () => {
    mobileOverlay.classList.add('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  };

  const closeMenu = () => {
    mobileOverlay.classList.remove('is-open');
    hamburgerBtn.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  };

  hamburgerBtn.addEventListener('click', () => {
    const isOpen = mobileOverlay.classList.contains('is-open');
    if (isOpen) {
      closeMenu();
    } else {
      openMenu();
    }
  });

  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      closeMenu();
    });
  });

  // Close with Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileOverlay.classList.contains('is-open')) {
      closeMenu();
      hamburgerBtn.focus();
    }
  });
}

/* --------------------------------------------------------------------------
   3. Floating Back to Top Button
   -------------------------------------------------------------------------- */
function initBackToTop() {
  const backToTopBtn = document.querySelector('.back-to-top');
  if (!backToTopBtn) return;

  const toggleVisibility = () => {
    if (window.scrollY > 400) {
      backToTopBtn.classList.add('is-visible');
    } else {
      backToTopBtn.classList.remove('is-visible');
    }
  };

  window.addEventListener('scroll', toggleVisibility, { passive: true });

  backToTopBtn.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
  });
}

/* --------------------------------------------------------------------------
   4. Scroll-Reveal via IntersectionObserver
   -------------------------------------------------------------------------- */
function initScrollReveal() {
  const revealElements = document.querySelectorAll('.reveal-fade-up');
  if (!revealElements.length) return;

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      threshold: 0.12,
      rootMargin: '0px 0px -40px 0px'
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    // Fallback if observer not supported
    revealElements.forEach(el => el.classList.add('is-revealed'));
  }
}

/* --------------------------------------------------------------------------
   5. Animated Trust Bar Stats Count-Up
   -------------------------------------------------------------------------- */
function initCountUpStats() {
  const statNumbers = document.querySelectorAll('.stat-number[data-target]');
  if (!statNumbers.length) return;

  const animateCounter = (el) => {
    const target = parseInt(el.getAttribute('data-target'), 10);
    const suffix = el.getAttribute('data-suffix') || '';
    const prefix = el.getAttribute('data-prefix') || '';
    const duration = 1800; // ms
    const startTime = performance.now();

    const updateCount = (currentTime) => {
      const elapsed = currentTime - startTime;
      const progress = Math.min(elapsed / duration, 1);
      // Ease out quartic curve
      const easeProgress = 1 - Math.pow(1 - progress, 4);
      const currentVal = Math.floor(easeProgress * target);

      el.innerHTML = `${prefix}${currentVal.toLocaleString()}<span class="stat-suffix">${suffix}</span>`;

      if (progress < 1) {
        requestAnimationFrame(updateCount);
      } else {
        el.innerHTML = `${prefix}${target.toLocaleString()}<span class="stat-suffix">${suffix}</span>`;
      }
    };

    requestAnimationFrame(updateCount);
  };

  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          obs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.3 });

    statNumbers.forEach(el => observer.observe(el));
  } else {
    statNumbers.forEach(el => animateCounter(el));
  }
}

/* --------------------------------------------------------------------------
   6. Accessible FAQ Accordion (Services Page)
   -------------------------------------------------------------------------- */
function initFAQAccordion() {
  const faqItems = document.querySelectorAll('.faq-item');
  if (!faqItems.length) return;

  faqItems.forEach(item => {
    const trigger = item.querySelector('.faq-trigger');
    const panel = item.querySelector('.faq-panel');
    if (!trigger || !panel) return;

    trigger.addEventListener('click', () => {
      const isExpanded = trigger.getAttribute('aria-expanded') === 'true';

      // Close other opened items for clean accordion UX
      faqItems.forEach(otherItem => {
        if (otherItem !== item) {
          otherItem.classList.remove('is-active');
          const otherTrigger = otherItem.querySelector('.faq-trigger');
          if (otherTrigger) otherTrigger.setAttribute('aria-expanded', 'false');
        }
      });

      // Toggle current
      if (isExpanded) {
        item.classList.remove('is-active');
        trigger.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('is-active');
        trigger.setAttribute('aria-expanded', 'true');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   7. Property Detail Modal & Booking Actions
   -------------------------------------------------------------------------- */
const propertyInventory = {
  1: {
    title: 'The Bel Air Promontory',
    price: '$18,750,000',
    status: 'For Sale',
    location: '10771 Bellagio Rd, Bel Air, Los Angeles, CA',
    beds: '6 Beds',
    baths: '8 Baths',
    sqft: '9,450 Sq Ft',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    description: 'An architectural triumph commanding 300-degree vistas of the Los Angeles basin and Pacific ocean. Designed by renowned modernist studio Olson & Partners, featuring zero-edge infinity pool, Italian travertine surfaces, imported Poliform kitchen, private 800-bottle wine cellar, and subterranean wellness sanctuary.'
  },
  2: {
    title: 'Solstice Ocean Villa',
    price: '$14,200,000',
    status: 'For Sale',
    location: '32450 Pacific Coast Highway, Malibu, CA',
    beds: '5 Beds',
    baths: '6 Baths',
    sqft: '7,100 Sq Ft',
    year: '2022',
    img: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80',
    description: 'Direct coastal sanctuary with private funicular down to pristine white sands. Expansive wrap-around teak decking, floor-to-ceiling automated Fleetwood glass pocket doors, chef gallery with double marble islands, and an oceanfront primary wing with dual fireplaces.'
  },
  3: {
    title: 'The Tribeca Sky Loft',
    price: '$32,000 / mo',
    status: 'For Rent',
    location: '72 Franklin Street, Penthouse B, New York, NY',
    beds: '4 Beds',
    baths: '4.5 Baths',
    sqft: '4,800 Sq Ft',
    year: '2021',
    img: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
    description: 'Rare cast-iron district duplex loft offering 18-foot ceiling heights, original restored pine beams, private keyed elevator, custom sculptural steel staircase, and an expansive 1,400 sq ft landscaped rooftop terrace overlooking Lower Manhattan.'
  },
  4: {
    title: 'Aspen Pinecrest Chalet',
    price: '$22,500,000',
    status: 'For Sale',
    location: '850 Red Mountain Road, Aspen, CO',
    beds: '7 Beds',
    baths: '8.5 Baths',
    sqft: '11,200 Sq Ft',
    year: '2024',
    img: 'https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?auto=format&fit=crop&w=1200&q=80',
    description: 'Premier ski-in/ski-out estate sited atop prestigious Red Mountain. Hand-hewn Douglas fir timbers, radiant heated Pennsylvania bluestone terraces, indoor heated lap pool, ski prep lounge with boot warmers, and private guest lodge quarters.'
  },
  5: {
    title: 'Biscayne Bay Waterfront Estate',
    price: '$16,900,000',
    status: 'For Sale',
    location: '280 Arvida Parkway, Coral Gables, FL',
    beds: '6 Beds',
    baths: '7 Baths',
    sqft: '8,600 Sq Ft',
    year: '2023',
    img: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1200&q=80',
    description: 'Lush tropical estate boasting 140 feet of deepwater frontage capable of accommodating a 95-foot yacht. Features limestone terraces, private dock with power/water pedestal, outdoor summer pavilion, and serene water gardens.'
  },
  6: {
    title: 'The Pacific Heights Manor',
    price: '$28,500 / mo',
    status: 'For Rent',
    location: '2540 Broadway Street, San Francisco, CA',
    beds: '5 Beds',
    baths: '5.5 Baths',
    sqft: '6,300 Sq Ft',
    year: '2020',
    img: 'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
    description: 'Timeless neoclassical residence enjoying sweeping Golden Gate Bridge and San Francisco Bay views. Elegantly restored millwork, elevator servicing all 4 levels, temperature-controlled sommelier cellar, and gated parking courtyard.'
  }
};

function initPropertyModal() {
  const modalBackdrop = document.querySelector('#propertyModal');
  const detailButtons = document.querySelectorAll('.view-details-btn[data-property-id]');
  if (!modalBackdrop || !detailButtons.length) return;

  const modalImg = modalBackdrop.querySelector('#modalPropertyImg');
  const modalStatus = modalBackdrop.querySelector('#modalPropertyStatus');
  const modalPrice = modalBackdrop.querySelector('#modalPropertyPrice');
  const modalTitle = modalBackdrop.querySelector('#modalPropertyTitle');
  const modalLocation = modalBackdrop.querySelector('#modalPropertyLocation');
  const modalBeds = modalBackdrop.querySelector('#modalPropertyBeds');
  const modalBaths = modalBackdrop.querySelector('#modalPropertyBaths');
  const modalSqft = modalBackdrop.querySelector('#modalPropertySqft');
  const modalYear = modalBackdrop.querySelector('#modalPropertyYear');
  const modalDesc = modalBackdrop.querySelector('#modalPropertyDesc');
  const modalInquireLink = modalBackdrop.querySelector('#modalInquireBtn');
  const closeBtn = modalBackdrop.querySelector('.modal-close-btn');

  const openModal = (id) => {
    const data = propertyInventory[id];
    if (!data) return;

    modalImg.src = data.img;
    modalImg.alt = data.title;
    modalStatus.textContent = data.status;
    modalPrice.textContent = data.price;
    modalTitle.textContent = data.title;
    modalLocation.textContent = data.location;
    modalBeds.textContent = data.beds;
    modalBaths.textContent = data.baths;
    modalSqft.textContent = data.sqft;
    modalYear.textContent = data.year;
    modalDesc.textContent = data.description;
    if (modalInquireLink) {
      modalInquireLink.href = `contact.html?property=${encodeURIComponent(data.title)}&interest=Buying#contact-form`;
    }

    modalBackdrop.classList.add('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
  };

  const closeModal = () => {
    modalBackdrop.classList.remove('is-open');
    modalBackdrop.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
  };

  detailButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const id = btn.getAttribute('data-property-id');
      openModal(id);
    });
  });

  if (closeBtn) {
    closeBtn.addEventListener('click', closeModal);
  }

  modalBackdrop.addEventListener('click', (e) => {
    if (e.target === modalBackdrop) {
      closeModal();
    }
  });

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modalBackdrop.classList.contains('is-open')) {
      closeModal();
    }
  });
}

/* --------------------------------------------------------------------------
   8. Search Bar Card Filter / Navigation Handler
   -------------------------------------------------------------------------- */
function initSearchForm() {
  const searchForm = document.querySelector('#heroSearchForm');
  if (!searchForm) return;

  searchForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const location = searchForm.querySelector('#searchLocation')?.value || 'all';
    const type = searchForm.querySelector('#searchType')?.value || 'all';
    const price = searchForm.querySelector('#searchPrice')?.value || 'all';

    // If on home page, scroll down to featured properties or navigate to contact with pre-filled parameters
    const featuredSection = document.querySelector('#featured-properties');
    if (featuredSection) {
      featuredSection.scrollIntoView({ behavior: 'smooth' });
      // Apply subtle highlight animation to listings
      const cards = featuredSection.querySelectorAll('.property-card');
      cards.forEach(card => {
        card.style.transition = 'transform 0.4s ease, box-shadow 0.4s ease';
        card.style.transform = 'translateY(-8px)';
        setTimeout(() => {
          card.style.transform = '';
        }, 600);
      });
    } else {
      window.location.href = `contact.html?location=${encodeURIComponent(location)}&type=${encodeURIComponent(type)}&price=${encodeURIComponent(price)}#contact-form`;
    }
  });
}

/* --------------------------------------------------------------------------
   9. Polished Client-Side Contact Form Validation
   -------------------------------------------------------------------------- */
function initContactForm() {
  const form = document.querySelector('#contactForm');
  const successCard = document.querySelector('#formSuccessCard');
  if (!form) return;

  // Pre-fill query parameters if navigated from property cards or search bar
  const urlParams = new URLSearchParams(window.location.search);
  const propertyParam = urlParams.get('property');
  const interestParam = urlParams.get('interest');
  const messageField = form.querySelector('#formMessage');
  const interestField = form.querySelector('#formInterest');

  if (interestParam && interestField) {
    interestField.value = interestParam;
  }
  if (propertyParam && messageField) {
    messageField.value = `I am interested in scheduling a confidential viewing and receiving the private prospectus for ${decodeURIComponent(propertyParam)}.`;
  }

  // Field Elements
  const fields = {
    name: {
      input: form.querySelector('#formName'),
      field: form.querySelector('#field-name'),
      error: form.querySelector('#error-name'),
      validate: (val) => val.trim().length >= 2,
      msg: 'Please provide your full legal name (at least 2 characters).'
    },
    email: {
      input: form.querySelector('#formEmail'),
      field: form.querySelector('#field-email'),
      error: form.querySelector('#error-email'),
      validate: (val) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val.trim()),
      msg: 'Please enter a valid email address (e.g., name@domain.com).'
    },
    phone: {
      input: form.querySelector('#formPhone'),
      field: form.querySelector('#field-phone'),
      error: form.querySelector('#error-phone'),
      validate: (val) => {
        const cleaned = val.replace(/[\s\-\(\)\.]/g, '');
        return cleaned.length >= 10 && /^\+?[0-9]+$/.test(cleaned);
      },
      msg: 'Please provide a valid 10-digit phone number.'
    },
    interest: {
      input: form.querySelector('#formInterest'),
      field: form.querySelector('#field-interest'),
      error: form.querySelector('#error-interest'),
      validate: (val) => val !== '' && val !== 'placeholder',
      msg: 'Please choose your primary area of interest.'
    },
    message: {
      input: form.querySelector('#formMessage'),
      field: form.querySelector('#field-message'),
      error: form.querySelector('#error-message'),
      validate: (val) => val.trim().length >= 15,
      msg: 'Please include a brief message detailing your request (min. 15 characters).'
    },
    consent: {
      input: form.querySelector('#formConsent'),
      field: form.querySelector('#field-consent'),
      error: form.querySelector('#error-consent'),
      validate: () => form.querySelector('#formConsent')?.checked === true,
      msg: 'Consent is required to allow our advisory partners to contact you.'
    }
  };

  const validateSingleField = (key) => {
    const item = fields[key];
    if (!item || !item.input) return true;

    const value = item.input.value;
    const isValid = item.validate(value);

    if (!isValid) {
      item.field?.classList.add('has-error');
      item.input?.classList.add('is-invalid');
      if (item.error) item.error.textContent = item.msg;
      return false;
    } else {
      item.field?.classList.remove('has-error');
      item.input?.classList.remove('is-invalid');
      if (item.error) item.error.textContent = '';
      return true;
    }
  };

  // Add blur and input event listeners
  Object.keys(fields).forEach(key => {
    const item = fields[key];
    if (!item.input) return;

    item.input.addEventListener('blur', () => {
      validateSingleField(key);
    });

    item.input.addEventListener('input', () => {
      if (item.field?.classList.contains('has-error')) {
        validateSingleField(key);
      }
    });

    if (item.input.type === 'checkbox') {
      item.input.addEventListener('change', () => {
        validateSingleField(key);
      });
    }
  });

  // Handle Form Submission
  form.addEventListener('submit', (e) => {
    e.preventDefault();

    let allValid = true;
    let firstInvalidInput = null;

    Object.keys(fields).forEach(key => {
      const valid = validateSingleField(key);
      if (!valid) {
        allValid = false;
        if (!firstInvalidInput) {
          firstInvalidInput = fields[key].input;
        }
      }
    });

    if (!allValid) {
      if (firstInvalidInput) firstInvalidInput.focus();
      return;
    }

    // Submit Loading State
    const submitBtn = form.querySelector('#formSubmitBtn');
    const originalText = submitBtn ? submitBtn.innerHTML : 'Send Message';
    if (submitBtn) {
      submitBtn.disabled = true;
      submitBtn.innerHTML = `
        <svg class="animate-spin" style="animation: spin 1s linear infinite; width: 18px; height: 18px; display: inline-block; vertical-align: middle;" viewBox="0 0 24 24" fill="none" stroke="currentColor">
          <circle cx="12" cy="12" r="10" stroke="rgba(11,31,58,0.2)" stroke-width="4"></circle>
          <path d="M4 12a8 8 0 018-8" stroke="currentColor" stroke-width="4"></path>
        </svg>
        <span style="margin-left: 0.5rem;">Submitting Inquiry...</span>
      `;
    }

    // Simulate luxury API response (650ms delay)
    setTimeout(() => {
      const clientName = fields.name.input.value.trim().split(' ')[0] || 'Esteemed Client';

      form.style.display = 'none';
      if (successCard) {
        const namePlaceholder = successCard.querySelector('#successClientName');
        if (namePlaceholder) namePlaceholder.textContent = clientName;
        successCard.classList.add('is-visible');
        successCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
      }

      // Reset button
      if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.innerHTML = originalText;
      }
    }, 700);
  });

  // Allow sending another inquiry
  const resetBtn = document.querySelector('#resetFormBtn');
  if (resetBtn && successCard) {
    resetBtn.addEventListener('click', () => {
      form.reset();
      form.style.display = 'block';
      successCard.classList.remove('is-visible');
      form.scrollIntoView({ behavior: 'smooth' });
    });
  }
}

/* --------------------------------------------------------------------------
   10. Newsletter Form Validation & Confirmation
   -------------------------------------------------------------------------- */
function initNewsletterForm() {
  const newsletterForms = document.querySelectorAll('.newsletter-form');

  newsletterForms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const feedback = form.parentElement.querySelector('.newsletter-feedback');
      if (!input || !feedback) return;

      const email = input.value.trim();
      const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);

      if (!isValid) {
        feedback.className = 'newsletter-feedback is-visible error';
        feedback.textContent = 'Please enter a valid email address.';
        input.focus();
        return;
      }

      feedback.className = 'newsletter-feedback is-visible success';
      feedback.textContent = 'Thank you for subscribing to Haven & Crest Private Journal.';
      input.value = '';

      setTimeout(() => {
        feedback.classList.remove('is-visible');
      }, 5000);
    });
  });
}

/* --------------------------------------------------------------------------
   11. Footer Current Year
   -------------------------------------------------------------------------- */
function initFooterYear() {
  const yearEl = document.querySelector('#current-year');
  if (yearEl) {
    yearEl.textContent = new Date().getFullYear();
  }
}

/* --------------------------------------------------------------------------
   12. Image Error Fallback Handler
   -------------------------------------------------------------------------- */
function initImageFallbacks() {
  const images = document.querySelectorAll('img');
  images.forEach(img => {
    img.addEventListener('error', () => {
      img.style.display = 'none';
      if (img.parentElement) {
        img.parentElement.classList.add('has-fallback');
      }
    });
  });
}

/* --------------------------------------------------------------------------
   13. Anchor Target Highlight & Smooth Scroll for Footer Navigation
   -------------------------------------------------------------------------- */
function initAnchorHighlights() {
  const highlightElement = (target) => {
    if (!target) return;
    target.classList.add('highlight-target');
    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    setTimeout(() => {
      target.classList.remove('highlight-target');
    }, 2800);
  };

  // Check URL hash on page load
  if (window.location.hash) {
    const hash = window.location.hash.substring(1);
    const targetEl = document.getElementById(hash);
    if (targetEl) {
      setTimeout(() => {
        highlightElement(targetEl);
      }, 250);
    }
  }

  // Intercept anchor link clicks on the same page
  document.querySelectorAll('a[href*="#"]').forEach(link => {
    link.addEventListener('click', (e) => {
      const href = link.getAttribute('href');
      if (!href) return;

      const hashIndex = href.indexOf('#');
      if (hashIndex === -1) return;

      const pathPart = href.substring(0, hashIndex);
      const hashPart = href.substring(hashIndex + 1);
      const currentPath = window.location.pathname.split('/').pop() || 'index.html';

      // If linking to anchor on current page
      if (pathPart === '' || pathPart === currentPath) {
        const targetEl = document.getElementById(hashPart);
        if (targetEl) {
          e.preventDefault();
          history.pushState(null, '', `#${hashPart}`);
          highlightElement(targetEl);
        }
      }
    });
  });
}
