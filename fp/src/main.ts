import { createServer, Socket } from "net";
import { createLexer } from "./lexer";
import { createParser, parse } from "./parser";
import { evaluate } from "./evaluator";
import { runCmd } from "./cmd";

const db: Map<string, string> = new Map();

function main() {
    const server = createServer();

    server.listen(6969, "127.0.0.1", () => {
        console.log("127.0.0.1:6969");
    });

    server.on("connection", onConnect)
}

function onConnect(socket: Socket) {
    socket.on("data", (data: Buffer) => {
        const lexer = createLexer(data);
        const parser = createParser(lexer);
        const [_, val] = parse(parser);
        const cmd = evaluate(val);
        const buf = runCmd(cmd, db);
        socket.write(buf);
    });

    socket.on("end", () => {
        socket.removeAllListeners();
        console.log("client disconnected");
    });
}

main();
