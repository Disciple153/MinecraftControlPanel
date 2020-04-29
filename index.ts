
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
    minecraftServer(GET_POWER_STATE).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        $('#powerState').html(data.response);
    });

    minecraftServer(GET_IP).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        $('#ipAddress').html(data.response);
    });
}

function turnOn() {
    // TODO turn on processing notification

    minecraftServer(TURN_ON).done( function (data) {
        console.log("Success: " + JSON.stringify(data));

        console.log('response' in data);
        console.log(data.errorType == 'InvalidInstanceId');

        // If turnOn unsuccessful:
        if (data.errorType == 'InvalidInstanceId') {
            // TODO I can't get it to reach here
            turnOn();
        }
        // If turnOn successful:
        else {
            $('#powerState').html(data.response);

            checkUntil(PowerState.running);
        }

    });
}

function turnOff() {
    // TODO turn on processing notification

    minecraftServer(TURN_OFF).done( function (data) {
        console.log("Success: " + JSON.stringify(data));

        $('#powerState').html(data.response);

        checkUntil(PowerState.stopped);
    });
}


function checkUntil(powerState: PowerState) {
    minecraftServer(GET_POWER_STATE).done(function (data) {
        console.log("Success: " + JSON.stringify(data));

        // Update power state
        $('#powerState').html(data.response);

        // If the target has been reached, update the IP address
        if (data.response == powerState) {
            minecraftServer(GET_IP).done(function (data) {
                $('#ipAddress').html(data.response);

                // TODO turn off processing notification
            });
        }
        // If powerState is not the target, try again
        else {
            checkUntil(powerState);
        }
    });
}

function minecraftServer(action: string) {
    return $.ajax({
        url: "https://q6h7w0vm2b.execute-api.us-west-2.amazonaws.com/minecraftServer",
        crossDomain: true,
        data: `action=${action}`,
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
}
