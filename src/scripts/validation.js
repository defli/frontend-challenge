'use strict';
(function() {
  var Validation = function(form) {
    var _this = this;
    // form element
    _this.form = form;

    // all fields in form which has required attr
    _this.fields = form.querySelectorAll('[required]');

    Array.prototype.forEach.call(_this.fields, function(field) {
      field.addEventListener('keyup', function() {
        _this._testAll(this);
      });

      field.addEventListener('change', function() {
        _this._testAll(this);
      });
    });
  };

  Validation.prototype._isEmail = function validateEmail(email) {
      var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
      return re.test(email);
  };

  /*
   * Check validation of single field with all requirements
   */
  Validation.prototype._testAll = function(field) {
    var isValid = true;

    if (field.type === 'email') {
      // is it valid email?
      if (this._isEmail(field.value)) {
        __.removeClass(field, 'tip-form__input-invalid');
        __.addClass(field, 'tip-form__input-valid');
      } else {
        __.removeClass(field, 'tip-form__input-valid');
        __.addClass(field, 'tip-form__input-invalid');
        isValid = false;
      }

      return isValid;
    }

    // check maximum value based on max attr
    var max = field.getAttribute('max');
    if (max) {
      if (max >= field.value.length) {
        __.removeClass(field, 'tip-form__input-invalid');
        __.addClass(field, 'tip-form__input-valid');
      } else {
        __.removeClass(field, 'tip-form__input-valid');
        __.addClass(field, 'tip-form__input-invalid');

        isValid = false;
      }
    }

    // is it not empty?
    console.log(field.value.length);
    if (field.value.length > 0) {
      __.removeClass(field, 'tip-form__input-invalid');
      __.addClass(field, 'tip-form__input-valid');
    } else {
      // empty
      __.removeClass(field, 'tip-form__input-valid');
      __.addClass(field, 'tip-form__input-invalid');
      isValid = false;
    }

    return isValid;
  };

  Validation.prototype.validate = function() {
    var _this = this;
    _this.isValid = true;

    Array.prototype.forEach.call(this.fields, function(field) {
      var isValid = _this._testAll(field);
      if (!isValid) {
        _this.isValid = false;
      }
    });

    return _this.isValid;
  };

  window.Validation = Validation;
})();
