var through = require('through2')
var path = require('path')
var isSepBackSlant = path.sep === '\\'

function Concat() {
    this.content = {}
}

Object.defineProperties(Concat.prototype, {
    add:    {
        value: function (fileKey, fileContent) {
			if(isSepBackSlant){
				// change to the linux path mode
				// windows: \\a\\b\\c.html => /a/b/c.html
				fileKey = fileKey.replace(/\\/g, '/')
			}
            this.content[fileKey] = fileContent
        }
    },
    remove: {
        value: function (fileKey) {
            delete this.content[fileKey]
        }
    },
    getContent: {
        value: function(){
            return new Buffer(JSON.stringify(this.content, null, 4))
        }
    }
})

function concatToJson(baseUri, destPath) {
    var concat = new Concat()

    var lastFile

    function bufferContents(file, enc, cb) {
        var filePath    = file.path
        var fileKey     = path.relative(baseUri || file.base, filePath)
        var fileContent = String(file.contents)

        lastFile = file
        concat.add(fileKey, fileContent)
        cb()
    }

    function endStream(cb) {
		// no files passed in, no file goes out
		if (!lastFile) {
			cb();
			return;
		}

        var joinedFile      = lastFile.clone({contents: false})
        joinedFile.path     = destPath
        joinedFile.contents = concat.getContent()

        this.push(joinedFile)

        cb()
    }

    return through.obj(bufferContents, endStream)
}

module.exports = concatToJson
