'use strict';

(function() {
  var $form = __.get('.js-tipform');
  var $phone = __.get('.js-phone');
  var $cloneBtn = __.get('.js-clone-btn');
  var $competitionBtn = __.get('.js-competition-btn');

  // cache first state of children form for future use
  var $template = __.get('.js-items').cloneNode(true);
  // remove add child button from template
  var $btnGrid = $template.querySelector('.js-btn-grid');
  $template.removeChild($btnGrid);

  // set phone input mask
  var im = new Inputmask("+999 999 99 99 99");
  im.mask($phone);

  // set datepicker
  new Pikaday({ field: __.get('.js-datepicker') });

  var validation = new Validation(__.get('form'));
  __.on($form, 'submit', function(evt) {
    evt.preventDefault();

    // it is not valid
    if (!validation.validate()) {
      return false;
    }

    // seralize to json object
    var obj = __.serializeObject(this);
    alert(JSON.stringify(obj));
  });

  // scroll behaviour
  __.on($competitionBtn, 'click', function(evt) {
    evt.preventDefault();
    var top = $form.offsetTop;
    scrollToY(top, 1500, 'easeInOutQuint');
  });

  __.on($cloneBtn, 'click', function(evt) {
    evt.preventDefault();

    var $clone = $template.cloneNode(true);
    var $input = $clone.querySelector('.datepicker');

    __.get('.children').appendChild($clone);
    new Pikaday({ field: $input });
  });

  // when parent radio button clicked
  __.on(__.get('.js-radio-parent'), 'change', function() {
    // show container
    __.removeClass(__.get('.js-children'), 'js-hidden');

    __.removeClass(__.get('.js-triangle'), 'children__triangle_right');

    // show birthdate column
    Array.prototype.forEach.call(__.getAll('.js-birth'), function(elm) {
      __.removeClass(elm, 'js-hidden');
    });
  });

  // when parent to be radio button clicked
  __.on(__.get('.js-radio-parent-tobe'), 'change', function() {

    // hide container
    __.removeClass(__.get('.js-children'), 'js-hidden');

    // set triangle location
    __.addClass(__.get('.js-triangle'), 'children__triangle_right');
    // hide birth date column
    Array.prototype.forEach.call(__.getAll('.js-birth'), function(elm) {
      __.addClass(elm, 'js-hidden');
    });
  });

  // when parent radio button clicked
  __.on(__.get('.js-radio-other'), 'change', function() {
    __.addClass(__.get('.children'), 'js-hidden');
  });
})(); // iife: for local scoping
