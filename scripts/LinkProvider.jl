module LinkProvider

const callbacks = Dict{Int32,Base.Callable}()
const id = Ref{UInt32}(0)

const ZERO = '\u2060'
const ONE = '\u200b'

hyperlink(callback, str) = Link(callback, str)
run_callback(id) = get(callbacks, id, () -> ())()

struct Link
    id::UInt32
    link::String

    function Link(callback, link)
        this_id = (id[] += 1)
        callbacks[this_id] = callback
        new(this_id, link)
    end
end

function Base.show(io::IO, link::Link)
    print(io, string(ONE, link.link, encode_id(link.id)))
end

encode_id(x::UInt32) = replace(string(x, base=2), '1' => ONE, '0' => ZERO)

end