// Keeps the staging site's saved data apart from the real site's.
//
// Both sites are served from nathankewley.github.io, and browsers keep saved
// data per site, so without this the staging copy would read and write your
// real progress. On a copy whose first folder ends in "-staging"
// (/japanese-grammar-staging/), every localStorage key and IndexedDB database
// gets a "staging." prefix behind the scenes, while the code still sees the
// usual names. Backups therefore move freely between the two: restore a real
// backup on staging to test with a copy of your progress. Anywhere else, this
// script does nothing.
//
// It's a plain script, loaded first on every page, so it's in place before
// anything reads storage.
(function () {
  var first = location.pathname.split('/')[1] || '';
  if (!/-staging$/.test(first)) return;
  var P = 'staging.';
  window.STAGING = true;

  if (window.Storage) {
    var S = Storage.prototype;
    var get = S.getItem, set = S.setItem, remove = S.removeItem, key = S.key;
    var realLength = Object.getOwnPropertyDescriptor(S, 'length').get;
    // This site's keys, without the prefix.
    var own = function (store) {
      var out = [];
      for (var i = 0, n = realLength.call(store); i < n; i++) {
        var k = key.call(store, i);
        if (k != null && k.indexOf(P) === 0) out.push(k.slice(P.length));
      }
      return out;
    };
    S.getItem = function (k) { return get.call(this, P + k); };
    S.setItem = function (k, v) { return set.call(this, P + k, v); };
    S.removeItem = function (k) { return remove.call(this, P + k); };
    S.key = function (i) { var k = own(this)[i]; return k === undefined ? null : k; };
    S.clear = function () { own(this).forEach(function (k) { remove.call(this, P + k); }, this); };
    Object.defineProperty(S, 'length', { configurable: true, enumerable: true, get: function () { return own(this).length; } });
  }

  if (window.IDBFactory) {
    var F = IDBFactory.prototype;
    var open = F.open, del = F.deleteDatabase, list = F.databases;
    F.open = function (name, version) {
      return arguments.length > 1 ? open.call(this, P + name, version) : open.call(this, P + name);
    };
    F.deleteDatabase = function (name) { return del.call(this, P + name); };
    if (list) {
      F.databases = function () {
        return list.call(this).then(function (dbs) {
          return dbs
            .filter(function (d) { return d.name.indexOf(P) === 0; })
            .map(function (d) { return { name: d.name.slice(P.length), version: d.version }; });
        });
      };
    }
  }

  // A narrow tab on the left edge, inside the page margin, so it's always
  // clear which site you're on without covering anything. Taps go through it.
  var badge = function () {
    var b = document.createElement('div');
    b.className = 'staging-badge';
    b.textContent = 'STAGING';
    b.setAttribute('aria-hidden', 'true');
    b.style.cssText = 'position:fixed;left:0;top:50%;transform:translateY(-50%);z-index:9999;writing-mode:vertical-rl;' +
      'padding:8px 1px;border-radius:0 6px 6px 0;background:#C2410C;color:#fff;font:700 10px/1.3 system-ui,sans-serif;' +
      'letter-spacing:.12em;pointer-events:none;opacity:.92';
    document.body.appendChild(b);
  };
  if (document.body) badge(); else document.addEventListener('DOMContentLoaded', badge);
})();
