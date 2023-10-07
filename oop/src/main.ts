import { Server, Socket } from "net";
import { Lexer } from "./lexer";
import { Parser } from "./parser";

function main() {
    const server = new Server();

    server.listen(6969, "127.0.0.1", () => {
        console.log("127.0.0.1:6969");
    });

    server.on("connection", onConnect)
}

function onConnect(socket: Socket) {
    socket.on("data", (data: Buffer) => {
        let l = new Lexer(data);
        let p = new Parser(l);
        let val = p.parse();
        console.log(val);
        socket.write(Buffer.from("ok"));
    });

    socket.on("end", () => {
        socket.removeAllListeners();
        console.log("client disconnected");
    });
}

main();
