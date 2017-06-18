/**
 * Delegator - A DOM event delegation manager based on dom attribute named with
 * `action-type`, Useful for component constructor with dom event attach/detaches.
 *
 * @author Allex Wang (allex.wxn@gmail.com)
 *
 * @example
 *
 * ```js
 *   n.innerHTML = '<div id="outer"><a href="#" action-type="alert" action-data="test=123">test</a><div id="inner"><span action-type="cancel">cancel</span></div></div>';
 *   var a = Delegator($('#outer'));
 *   a.on('click', 'alert', function(spec) {
 *      console.log(spec.data.test);
 *   });
 *   a.on('cancel', function(e) { // defaults delegate to click
 *      console.log(e);
 *      // undelegate
 *      // a.un('cancel')
 *   });
 * ```
 */
define(function (require, exports, module) {
    'use strict'

    var $ = require('jquery')
      , EventEmitter = require('../event/emitter')
      , rnotwhite = (/\S+/g)
      , _seed = -1
      , _expando = (+new Date).toString(36)
      , evtSep = '/'
      , guid = function() { return _expando + ++_seed }
      , proxy = function(fn, scope) {
            var id = fn.guid || (fn.guid = guid())
            var f = function(e, sender) { return fn.call(scope || sender, e) };
            f.guid = id;
            return f;
        }
      , noop = function() {}
      , iff = function(f, def) { return typeof f === 'function' ? f : def }

    /**
     * Internal DOM event handler
     *
     * @internal
     * @param {Object} self The {Delegator} instance
     * @param {EventObject} e The DOM event object
     */
    function handleDelegate(self, e) {
        var target = e.currentTarget
          , $el = $(target)
          , action
          , type = (e.handleObj || 0).origType || e.type
          , data
          , result

        // stop delegate bubbles
        if (e.isPropagationStopped()) return;

        if ( !$el.attr('disabled') && (action = $el.attr('action-type')) ) {

            data = $el.attr('action-data');

            // Provide action name and data to action handlers
            e.action = action;
            e.data = data;
            result = self.e.emit(type + evtSep + action, e, target);

            // Update event object with action result value.
            e.actionValue = result;

            if (result === false) {
                e.preventDefault();
                e.stopPropagation();
            }
        }

        self.opts.onDelegate(e);

        return result;
    }

    // DOM event delegator based on element attribute `action-type`
    var Delegator = function(box, opts) {
        opts = opts || {}

        if (typeof box === 'string') {
            box = $(box)[0];
        }

        var self = {}
          , eventTypes = {}
          , emitter = new EventEmitter()
          , delegateContext = opts.context
          , innerObj = { o: self, opts: opts, e: emitter }
          , eventHandle = function(e) {
              // DOM event dispatcher
              return handleDelegate(innerObj, e)
            }

        opts.onDelegate = iff(opts.onDelegate, noop)

        /**
         * Add a specified action on the specified DOM event. The DOM event is
         * optionally and defaults to `click`
         *
         * @method on
         *
         * @param {String} type (Optional) set the event name to delegate. defaults to `click` event.
         * @param {String} action The action name to identify delegate type.
         * @param {Function} fn the delegate event handler.
         *
         * @return {Delegator} The delegator instance.
         */
        self.on = function(type, action, fn) {
            // shift arguments if action argument was omitted
            // set type defaults to `click` event
            if (typeof action === 'function') {
                fn = action;
                action = type;
                type = 'click';
            }

            if (typeof fn !== 'function')
                throw Error('The delegate handler should be a valid function');

            // Handle multiple actions separated by a space
            action = ( action || '' ).match(rnotwhite) || [];
            var t = action.length;
            while (t--) {
                if (!eventTypes[type]) {
                    eventTypes[type] = 1;
                    $(box).on(type, '[action-type]', eventHandle);
                }
                emitter.on(type + evtSep + action[t], proxy(fn, delegateContext));
            }

            return this;
        }

        /**
         * Detach action event handler.
         *
         * @method un
         *
         * @param {String} type The target event been delegated.
         * @param {String} action The target action name to detach.
         * @param {Function} fn The specific action handler to detach.
         */
        self.un = function(type, action, fn) {
            // HANDLE: un( action [, fn] )
            if (typeof action === 'function' || !action) {
                fn = action;
                action = type;
                type = 'click';
            }

            // FIXME: release DOM delegator dispatcher if all of the delegats empty

            action = ( action || '' ).match(rnotwhite) || [];
            var t = action.length, et, $box = $(box)
            while (t--) {
                et = type + evtSep + action[t]
                // cleanup emitter listeners
                emitter.un(et, fn);
            }

            return this;
        }

        /**
         * Fires the specified action on the specified DOM event. The DOM event is
         * optionally and defaults to `click`
         *
         * @method fire
         * @param {String} type (Optional) set event type, treat as a action name if
         *                  action parameter not provided.
         * @param {String} action The action name to trigger.
         */
        self.fire = function(type, action) {
            if (!action) {
                action = type;
                type = 'click';
            }
            var target = $('[action-type="' + action + '"]', box)[0] || document;
            var event = new $.Event(type);
            event.currentTarget = event.target = target;
            emitter.emit(type + evtSep + action, event, target);
        }

        /**
         * Destroy API for release delegator instance
         *
         * @method destroy
         */
        self.destroy = function() {
            var $box = $(box)
            $.each(eventTypes, function(k, v) {
                delete eventTypes[k];
                $box.off(k, '[action-type]', eventHandle);
            });
            emitter.un();
            for (var k in self) delete self[k]
            emitter = undefined
            opts = undefined
            eventTypes = $box = box = undefined
            eventHandle = null
        }

        return self;
    };

    module.exports = Delegator;
});
