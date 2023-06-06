import * as vscode from 'vscode'

interface JuliaLink extends vscode.TerminalLink {
    type: string
    id?: number
}

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

        // TODO: make this more robust/applicable to the usecase
        const matches = line.matchAll(/(?<type>\w+)(?<id>[\u200b\u2060]+)/g)
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
                        startIndex: match.index,
                        length: match[0].length,
                        tooltip: `${type}: ${id}`,
                        type: type,
                        id: id,
                    }
                )
            }
        }

        return out
    }

    handleTerminalLink(link: JuliaLink): vscode.ProviderResult<void> {
        // TODO: This should probably do something more useful. If you need
        // it to be generic, then you can implement RPC here and use the id
        // as the key for whatever logic you want to execute.
        this.api.executeInREPL(`println("${link.type}: ${link.id}")`, {
            filename: 'link-handler',
            line: 0,
            column: 0,
            mod: 'Main',
            showCodeInREPL: false,
            showResultInREPL: false,
            showErrorInREPL: false,
            softscope: true,
        })
    }
}

// The Julia side encodes integers as a sequence of zero-width spaces, which allows
// us to tack on additional metadata without changing anything about how the link
// appears visually. This is a bit brittle (trying this with a Int64 crashes the
// terminal) and might not be needed, but still is a neat hack.
//
// Encoding logic is
// encode_id(x::Union{Int8, Int16, Int32}) = replace(bitstring(x), '1' => '\u200b', '0' => '\u2060')
function decodeBinary(input: string) {
    return parseInt(
        input.replaceAll('\u200b', '1').replaceAll('\u2060', '0'),
        2
    )
}
