# gulp-concat-to-json
concat files and convert the content to JSON

example, concat all html templates to a js file:

```javascript
var concatToJson = require('gulp-concat-to-json')

gulp.src('./tpl/**/*.html')
    .pipe(minifyHTML({conditionals: true, spare: true}))
    .pipe(concatToJson(path.join(__dirname), path.join(__dirname, 'tpl/all_templates.js')))
    .pipe(replace(/^/, 'module.exports = '))
    .pipe(gulp.dest('./tpl/'))
```

files: 

tpl/a.html:
```html
<h1>Hi</h1>
```

tpl/b.html
```html
<div>Hi</div>
```

convert to:

tpl/all_templates.js
```javascript
{
  "tpl/a.html": "<h1>Hi</h1>",
  "tpl/b.html": "<div>Hi</div>"
}
```
