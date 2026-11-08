$(document).ready(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    $.fx.off = true;
  }

  $('.nav-toggle').click(function () {
    $('#main-nav').toggleClass('is-open');

    if ($('#main-nav').hasClass('is-open')) {
      $(this).attr('aria-expanded', 'true');
    } else {
      $(this).attr('aria-expanded', 'false');
    }
  });

  $(document).keydown(function (event) {
    if (event.key == 'Escape' && $('#main-nav').hasClass('is-open')) {
      $('#main-nav').removeClass('is-open');
      $('.nav-toggle').attr('aria-expanded', 'false');
      $('.nav-toggle').focus();
    }
  });

  $('.details-button').click(function () {
    var card = $(this).closest('.property-card');
    var home = $(this).attr('data-property');

    $('#dialog-title').text(card.find('h2').text());
    $('#dialog-location').text(card.find('.location').text());
    $('#dialog-specs').text(card.find('.property-specs').text());
    $('#dialog-description').text(card.find('.property-description').text());
    $('#dialog-price').text(card.find('strong').text());
    $('#dialog-image').attr('src', card.find('img').attr('src'));
    $('#dialog-image').attr('alt', card.find('img').attr('alt'));
    $('#dialog-contact').attr('href', 'contact.html?property=' + home);

    document.getElementById('property-dialog').showModal();
    $('body').addClass('dialog-open');
  });

  $('.dialog-close').click(function () {
    document.getElementById('property-dialog').close();
  });

  $('#property-dialog').click(function (event) {
    if (event.target == this) {
      this.close();
    }
  });

  $('#property-dialog').on('close', function () {
    $('body').removeClass('dialog-open');
  });

  function filterProperties() {
    var type = $('#property-type').val();
    var maxPrice = $('#max-price').val();
    var count = 0;

    $('.listing-column').each(function () {
      var card = $(this).find('.property-card');
      var homeType = card.attr('data-type');
      var homePrice = Number(card.attr('data-price'));

      if ((type == 'all' || type == homeType) &&
          (maxPrice == 'all' || homePrice <= Number(maxPrice))) {
        $(this).prop('hidden', false);
        count++;
      } else {
        $(this).prop('hidden', true);
      }
    });

    if (count == 1) {
      $('#result-count').text('1 property found');
    } else {
      $('#result-count').text(count + ' properties found');
    }

    $('#no-results').prop('hidden', count != 0);
  }

  $('#property-type, #max-price').change(filterProperties);

  $('#filter-form').submit(function (event) {
    event.preventDefault();
  });

  $('.reset-button, #clear-filters').click(function () {
    $('#property-type').val('all');
    $('#max-price').val('all');
    filterProperties();
    $('#property-type').focus();
  });

  $('.faq-question').click(function () {
    var answer = $(this).attr('aria-controls');
    $('#' + answer).slideToggle(200);

    if ($(this).attr('aria-expanded') == 'true') {
      $(this).attr('aria-expanded', 'false');
      $(this).find('span').text('+');
    } else {
      $(this).attr('aria-expanded', 'true');
      $(this).find('span').text('−');
    }
  });

  var selectedHome = new URLSearchParams(window.location.search).get('property');
  if (selectedHome) {
    $('#interest').val(selectedHome);
  }

  $('#contact-form').on('input change', 'input, select, textarea', function () {
    $('#form-status').prop('hidden', true);
    $(this).attr('aria-invalid', 'false');
    $(this).parent().find('.field-error').text('');
  });

  $('#contact-form').submit(function (event) {
    event.preventDefault();

    var name = $('#full-name').val().trim();
    var message = $('#message').val().trim();
    var valid = true;

    $('.field-error').text('');
    $('#contact-form input, #contact-form select, #message').attr('aria-invalid', 'false');
    $('#form-status').prop('hidden', true);

    if (name.length < 2 || name.length > 80) {
      $('#name-error').text('Enter your full name using at least 2 characters.');
      $('#full-name').attr('aria-invalid', 'true');
      valid = false;
    }

    if (!document.getElementById('email').checkValidity()) {
      $('#email-error').text('Enter a valid email address.');
      $('#email').attr('aria-invalid', 'true');
      valid = false;
    }

    if (!$('#interest').val()) {
      $('#interest-error').text('Choose a property or General enquiry.');
      $('#interest').attr('aria-invalid', 'true');
      valid = false;
    }

    if (message.length < 10 || message.length > 1000) {
      $('#message-error').text('Enter a message between 10 and 1,000 characters.');
      $('#message').attr('aria-invalid', 'true');
      valid = false;
    }

    if (!valid) {
      $('#contact-form [aria-invalid="true"]').first().focus();
      return;
    }

    $('#form-status').text('Thank you, ' + name + '. Your enquiry has passed validation. This student demo does not send or store messages.');
    $('#form-status').prop('hidden', false);
  });
});
