---
project_id: MarkdownParser
title: Markdown Parser
github_link: https://github.com/AxelGoetz/MarkdownParser
---

The reason why I wrote another [Markdown Parser](https://github.com/AxelGoetz/MarkdownParser) is because I spent quite a while editing markdown files in [atom](https://atom.io) whilst using the built-in preview function. But as these files grow larger,
the rendering suddenly becomes very slow as it recompiles the markdown and re-renders the HTML at every change.

So I thought that there has to be a better way. Even though I haven't finished the project yet, it had been build with re-rendering in mind.
Therefore the infrastructure is in place but I just need a bit more time to implement it.

If you want to run the current version (with a very very primitive interface), you need `npm` and `jspm` and then you need to clone the repository and run:
```
npm install
jspm install
cd public
# Run a local webserver from here
```
