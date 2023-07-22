import * as vscode from 'vscode'

interface JuliaLink extends vscode.TerminalLink {
    type: string
    id?: number
}

const ZERO = '\u2060'
const ONE = '\u200b'

export class JuliaLinkProvider
    implements vscode.TerminalLinkProvider<JuliaLink>
{
    constructor(private api: any) {
        // TODO: for debugging purposes only
        vscode.window.showInformationMessage('Julia link listener installed!')
    }

    provideTerminalLinks(
        context: vscode.TerminalLinkContext,
        token: vscode.CancellationToken
    ): vscode.ProviderResult<JuliaLink[]> {
        const out: JuliaLink[] = []

        if (!context.terminal.name.startsWith('Julia REPL')) {
            return out
        }
        const line = context.line

        const matches = line.matchAll(/\u200b(?<type>[^\u200b\u2060]+?)(?<id>[\u200b\u2060]+)/g)
        for (const match of matches) {
            if (
                match !== null &&
                match.index !== undefined &&
                match.groups !== undefined
            ) {
                const id = decodeBinary(match.groups.id)
                const type = match.groups.type
                out.push(
                    {
                        startIndex: match.index + 1,
                        length: match[0].length,
                        tooltip: `${type} (Julia callback)`,
                        type: type,
                        id: id,
                    }
                )
            }
        }

        return out
    }

    handleTerminalLink(link: JuliaLink): vscode.ProviderResult<void> {
        this.api.executeInREPL(`run_callback(${link.id})`, {
            filename: 'link-handler',
            line: 0,
            column: 0,
            mod: 'LinkProvider',
            showCodeInREPL: false,
            showResultInREPL: false,
            showErrorInREPL: false,
            softscope: true,
        })
    }
}

function decodeBinary(input: string) {
    return parseInt(input.replaceAll(ONE, '1').replaceAll(ZERO, '0'), 2)
}
