# julia-link-runner README

This is a PoC for adding a link handler to VS Code that can make arbitrary onclick callbacks into the process provided by the Julia extension.

Add this extension and run the following code in your Julia REPL:
```
julia> encode_id(x::Union{Int8, Int16, Int32}) = replace(bitstring(x), '1' => '\u200b', '0' => '\u2060')
encode_id (generic function with 1 method)

julia> println("link", encode_id(Int16(12)))
```
`link` should now appear clickable and will print `link: 12` into the terminal.

[Peek 2023-06-06 09-46.webm](https://github.com/pfitzseb/julia-link-extension/assets/6735977/aa4b7205-93c9-4ccb-9624-68abba12ec8e)

---

## Following extension guidelines

Ensure that you've read through the extensions guidelines and follow the best practices for creating your extension.

* [Extension Guidelines](https://code.visualstudio.com/api/references/extension-guidelines)

## Working with Markdown

You can author your README using Visual Studio Code. Here are some useful editor keyboard shortcuts:

* Split the editor (`Cmd+\` on macOS or `Ctrl+\` on Windows and Linux).
* Toggle preview (`Shift+Cmd+V` on macOS or `Shift+Ctrl+V` on Windows and Linux).
* Press `Ctrl+Space` (Windows, Linux, macOS) to see a list of Markdown snippets.

## For more information

* [Visual Studio Code's Markdown Support](http://code.visualstudio.com/docs/languages/markdown)
* [Markdown Syntax Reference](https://help.github.com/articles/markdown-basics/)

**Enjoy!**
