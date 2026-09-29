# Part A2.3: Open-Source Function (Hard) - Express `Layer.match`

## Source Code Reference (simplified from `express/lib/router/layer.js`)
```javascript
Layer.prototype.match = function match(path) {
  let match;

  if (path != null) {
    if (this.fast_slash) {
      this.params = {};
      this.path = '';
      return true;
    }
    match = this.regexp.exec(path);
  }

  if (!match) {
    this.params = undefined;
    this.path = undefined;
    return false;
  }

  this.params = {};
  this.path = match[0];
  
  const keys = this.keys;
  for (let i = 1; i < match.length; i++) {
    const key = keys[i - 1];
    const prop = key.name;
    const val = decode_param(match[i]);
    if (val !== undefined) {
      this.params[prop] = val;
    }
  }
  return true;
};