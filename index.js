(async function(){
    "use strict";

    // Dependencies
    const { ArgumentParser } = require("argparse")
    const tcpPingNode = require("tcp-ping-node")
    const request = require("request-async")
    const chalk = require("chalk")

    // Variables
    const parser = new ArgumentParser()

    var type;
    var args;

    // Function
    async function log(type, others){
        if(type === "check-host"){
            var response = await request(`https://check-host.net/check-result/${others.resultID}`)
            response = JSON.parse(response.body)
    
            for( const from of Object.keys(response) ){
                const result = response[from]

                if(JSON.stringify(result).indexOf("null") === -1){
                    if(result[0].time){
                        console.log(`${args.host} is ${chalk.greenBright("ALIVE")} from ${chalk.blueBright(from)}; time=${chalk.greenBright(`${result[0].time}ms`)}`)
                    }else{
                        console.log(`${args.host} is ${chalk.greenBright("ALIVE")} from ${chalk.blueBright(from)}`)
                    }
                }else{
                    console.log(`${args.host} is ${chalk.redBright("DEAD")} from ${chalk.blueBright(from)};`)
                }
            }
        }else if(type === "tcp"){
            if(others.alive){
                console.log(`connected to ${chalk.blueBright(args.host)}; time=${chalk.greenBright(`${others.ms}ms`)}; protocol=${chalk.greenBright("TCP")}; port=${chalk.greenBright(args.tcp)}`)
            }else{
                console.log(`failed to connect to ${chalk.blueBright(args.host)}; time=${chalk.greenBright(`${others.ms}ms`)}; protocol=${chalk.greenBright("TCP")}; port=${chalk.greenBright(args.tcp)}`)
            }
        }
    }

    function pingHost(host, type){
        return new Promise(async(resolve)=>{
            if(type === "cping"){
                type = "check-ping"
            }else if(type === "chttp"){
                type = "check-http"
            }else if(type === "ctcp"){
                type = "check-tcp"
            }else if(type === "cudp"){
                type = "check-udp"
            }

            var response = await request(`https://check-host.net/${type}?host=${host}&&max_nodes=21`, {
                headers: {
                    accept: "application/json"
                }
            })

            response = JSON.parse(response.body)

            setTimeout(()=>{
                log("check-host", { resultID: response.request_id })
            }, 2000)
        })
    }

    function tcpPing(){
        setInterval(async()=>{
            const result = await tcpPingNode.ping({ host: args.host, port: args.tcp, timeout: 10000 })

            log("tcp", { alive: result.success, ms: result.time })
        }, 1000)
    }

    // Main
    parser.add_argument("--host", { help: "The target host.", required: true })
    parser.add_argument("-t", "--tcp", { help: "TCP ping the specified port. Usage: -t/--tcp {port}" })
    parser.add_argument("-cp", "--cping", { help: "If used, host will be ping using check-host API.", nargs: "?", const: 1 })
    parser.add_argument("-ch", "--chttp", { help: "If used, host will be HTTP ping using check-host API.", nargs: "?", const: 1 })
    parser.add_argument("-ct", "--ctcp", { help: "If used, host will be TCP ping using check-host API.", nargs: "?", const: 1 })
    parser.add_argument("-cu", "--cudp", { help: "If used, host will be UDP ping using check-host API.", nargs: "?", const: 1 })

    args = parser.parse_args()
    
    if(args.cping){
        type = "cping"
    }else if(args.chttp){
        type = "chttp"
    }else if(args.ctcp){
        type = "ctcp"
    }else if(args.cudp){
        type = "cudp"
    }

    if(args.tcp) return tcpPing()

    if(type){
        console.log("Pinging the host, please wait.\n")
        await pingHost(args.host, type)
    }else{
        console.log("Please use at least 1 argument.")
    }
})()