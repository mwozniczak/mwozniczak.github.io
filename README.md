# CV Builder

## What even is this?

This is the tool I ~~overengineered~~ wrote for my CV. It's written as a gulpfile.js and, in a nutshell, what it does is:

 - Grab the data from `src/data/` [jade filename without extension] `.yml` (e.g. `src/data/index.yml`)
 - Put that data in the Jade template at `src/index.jade`
 - Compile the template and the stylesheets, and put them all into `dist/`

### Why roll your own tool? Why not use something that already exists?

I wanted to get the hang of the whole gulp building process. And update my CV. Things sort of spiralled out from there.

## How do I set it up?

1. Get node.js
2. Grab this repo, then `git checkout buildable`
3. Run `npm install`
4. Run `bower install` (If that fails, you probably need to run `npm install -g bower`, which'll install bower for all users)
5. Edit the template and the data to your heart's content
6. run `gulp`. The default task will build everything, put it in `dist/`, set up a miniature http server at `127.0.0.1:8080` and rebuild on file changes.