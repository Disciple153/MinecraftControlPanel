
const GET_POWER_STATE : string = 'getPowerState';
const TURN_ON : string = 'turnOn';
const TURN_OFF : string = 'turnOff';
const GET_IP : string = 'getIP';

enum PowerState {
    running = 'running',
    pending = 'pending',
    stopping = 'stopping',
    stopped = 'stopped'
}

function main(){
    minecraftServer(GET_POWER_STATE, 'powerState');
}

function turnOn(element: string) {
    minecraftServer(TURN_ON).done( function (data) {
        $('#' + element).html(data.response);

        checkUntil(PowerState.running, element);
    });
}

function turnOff(element: string) {
    minecraftServer(TURN_OFF).done( function (data) {
        $('#' + element).html(data.response);

        checkUntil(PowerState.stopped, element);
    });
}


function checkUntil(powerState: PowerState, element: string) {
    minecraftServer(GET_POWER_STATE).done(function (data) {
        // Update power state        $('#' + element).html(data.response);
        $('#' + element).html(data.response);

        // If the target has been reached, update the IP address
        if (data.response == powerState) {
            minecraftServer(GET_IP, 'ipAddress');
        }
        // If powerState is not the target, try again
        else {
            checkUntil(powerState, element);
        }
    });
}

function minecraftServer(action: string, element: string = '') {
    return $.ajax({
        url: "https://q6h7w0vm2b.execute-api.us-west-2.amazonaws.com/minecraftServer",
        crossDomain: true,
        data: `action=${action}`,
        success: function (data) {
            console.log("Success: " + JSON.stringify(data));

            if (element != '') {
                $('#' + element).html(data['response']);
            }
        },
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
}
