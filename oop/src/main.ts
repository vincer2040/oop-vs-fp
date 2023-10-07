import { Server, Socket } from "net";
import { Lexer } from "./lexer";
import { Parser } from "./parser";
import { Evaluator } from "./evaluator";
import { CommandRunner } from "./cmd";
import { ProtocolBuilder } from "./protocolBuilder";

const db: Map<string, string> = new Map();

function main() {
    const server = new Server();

    server.listen(6969, "127.0.0.1", () => {
        console.log("127.0.0.1:6969");
    });

    server.on("connection", onConnect)
}

function onConnect(socket: Socket) {
    let builder = new ProtocolBuilder();
    socket.on("data", (data: Buffer) => {
        let l = new Lexer(data);
        let p = new Parser(l);
        let val = p.parse();
        let cmd = Evaluator.evaluate(val);
        let buf = CommandRunner
            .getInstance(cmd, builder)
            .run(db);
        socket.write(buf);
    });

    socket.on("end", () => {
        socket.removeAllListeners();
        console.log("client disconnected");
    });
}

main();
