# postcss-parts

This is a [PostCSS] plugin that filters comment-delimited parts of a CSS file.

[PostCSS]: https://github.com/postcss/postcss

## Example

#### Input

```css
.foo {
  display: block;
}

/* PARTS before=critical */

.bar {
  display: inline;
}
```
#### Output
```css
.foo {
  display: block;
}
```

## Installation

**Step 1:** Install plugin:

```sh
npm install --save-dev postcss postcss-parts
```

**Step 2:** Check you project for existed PostCSS config: `postcss.config.js`
in the project root, `"postcss"` section in `package.json`
or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs]
and set this plugin in settings.

**Step 3:** Add the plugin to plugins list:

```diff
module.exports = {
  plugins: [
+   require('postcss-parts'),
    require('autoprefixer')
  ]
}
```

[official docs]: https://github.com/postcss/postcss#usage

## Usage

### In the CSS file
The parts to be filtered from the source CSS file are delimited by specifically formatted CSS comments. These comments are only respected on the CSS root level **in between CSS rules**. It is not possible to split a rule/at-rule/media query into two different parts.

Each delimiting comment MUST start with `PARTS` and then SHOULD have at least one of the following definitions:
* A name definition of the part of the CSS file before the comment: `before=name`
* A name definition of the part of the CSS file after the comment: `after=name`

Example: A comment separating a part before it named "critical" from a part after it named "other":
```css
/* PARTS before=critical after=other */
```

Both of the part names are case-sensitive and MUST NOT contain spaces. In either case, the named part before or after the comment is delimited by the previous (or next, respectively) `PARTS` comment or the start/end of the CSS file. Any `PARTS` comment acts as a delimiter; the behaviour does NOT depend on that comment's name definitions. In fact, it is possible to define the same part of the CSS file with two different names in its delimiter comments:
```css
/* ... some CSS that belongs to Part 1 ... */

/* PARTS before=Part1 after=Part2 */

/* ... some CSS that belongs to Part 2 ... */

/* PARTS before=PartTwo after=PartThree */

/* ... some CSS that belongs to Part 3 ... */
```

The CSS that belongs to Part 2 can be referred to by both `Part2` and `PartTwo`.

It is also possible to use the same name for multiple parts of the CSS file. Each of these parts will be included in the resulting CSS if that name is selected in the PostCSS configuration.

The `PARTS` comments themselves will NOT be included int he resulting CSS.

### In the PostCSS configuration
The plugin expects a configuration object with a "parts" property. This is an example for a possible configuration using `postcss.config.js`:
```js
module.exports = () => ({
  plugins: [
    require('autoprefixer'),
    require('postcss-parts')({ parts: ['critical', 'critical2'] }),
    require('cssnano'),
  ]
});
```

The value of the `parts` property is an array of strings that lists the parts to be included in the result CSS. It is also possible to use a string with all the parts separated by spaces:
```js
require('postcss-parts')({ parts: 'critical critical2' })
```

