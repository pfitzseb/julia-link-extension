import * as vscode from 'vscode'
import { JuliaLinkProvider } from './link-provider'

export function activate(context: vscode.ExtensionContext) {
    const api = getJuliaAPI()

    if (api === undefined) {
        vscode.window.showErrorMessage(
            'Cannot activate this extension, because no compatible version of the Julia extension was found.'
        )
        return
    }

    context.subscriptions.push(
        vscode.window.registerTerminalLinkProvider(new JuliaLinkProvider(api))
    )
}

function getJuliaAPI() {
    let juliaExt
    try {
        juliaExt =
            vscode.extensions.getExtension('julialang.language-julia') ||
            vscode.extensions.getExtension('julialang.language-julia-insider')
    } catch (err) {
        notifyNoJuliaExtension()
    }

    if (juliaExt === undefined) {
        notifyNoJuliaExtension()
        return
    }

    const juliaAPI = juliaExt.exports
    if (juliaAPI === undefined) {
        notifyNoJuliaExtension()
        return
    }

    return juliaAPI
}

function notifyNoJuliaExtension() {
    vscode.window.showErrorMessage(
        'Please make sure the Julia extension is installed and enabled.'
    )
}

export function deactivate() {}
