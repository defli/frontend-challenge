'use strict';
// a general helper method for dom selection etc.
var __ = { // jshint ignore:line
  /*
   * usage __.get('.element');
   * return a element which matchs the query
   */
  get: function(query) {
    return document.querySelector(query);
  },
  /*
   * usage __.getAll('.elements');
   * return all elements which match the query
   */
  getAll: function(query) {
    return document.querySelectorAll(query);
  },

  /*
   * usage __.on(element, 'click', function(evt) {
     alert('click fired');
   })
   */
  on: function(elm, evt, cb) {
    return elm.addEventListener(evt, cb);
  },

  addClass: function(elm, className) {
    if (elm.classList) {
      elm.classList.add(className);
    } else {
      elm.className += ' ' + className;
    }
  },

  removeClass: function(elm, className) {
    if (elm.classList) {
      elm.classList.remove(className);
    } else {
      elm.className = elm.className.replace(new RegExp('(^|\\b)' + className.split(' ').join('|') + '(\\b|$)', 'gi'), ' ');
    }
  },

  /**
   * @see https://plainjs.com/javascript/ajax/serialize-form-data-into-an-array-46/
   * usage __.serializeArray(element);
   */
  serializeArray: function(form) {
      var field, l, s = [];
      if (typeof form === 'object' && form.nodeName === "FORM") {
          var len = form.elements.length;
          for (var i=0; i<len; i++) {
              field = form.elements[i];
              if (field.name && !field.disabled && field.type !== 'file' && field.type !== 'reset' && field.type !== 'submit' && field.type !== 'button') {
                  if (field.type === 'select-multiple') {
                      l = form.elements[i].options.length;
                      for (var j = 0; j<l; j++) {
                        if(field.options[j].selected) {
                          s[s.length] = { name: field.name, value: field.options[j].value, field: field };
                        }
                      }
                  } else if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
                      s[s.length] = { name: field.name, value: field.value, field: field };
                  }
              }
          }
      }

      return s;
  },
  /*
   * usage: __.serializeObject(element);
   */
  serializeObject: function(form) {
    var arr = this.serializeArray(form);
    var o = {};

    arr.forEach(function (item) {
      // only use visible items
      if (item.field.offsetParent === null) {
        return false;
      }

      // is it an array?
      if (o[item.name]) {
        if (!o[item.name].push) {
            o[item.name] = [o[item.name]];
        }
        o[item.name].push(item.value || '');
      } else {
        // normal item
        o[item.name] = item.value || '';
      }
    });

    return o;
  }
};
