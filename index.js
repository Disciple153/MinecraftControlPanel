var GET_POWER_STATE = 'getPowerState';
var TURN_ON = 'turnOn';
var TURN_OFF = 'turnOff';
var GET_IP = 'getIP';
var PowerState;
(function (PowerState) {
    PowerState["running"] = "running";
    PowerState["pending"] = "pending";
    PowerState["stopping"] = "stopping";
    PowerState["stopped"] = "stopped";
})(PowerState || (PowerState = {}));
function main() {
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
    // TODO turn on processing notification and grey out buttons
    minecraftServer(TURN_ON).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        checkUntil(PowerState.running);
    });
}
function turnOff() {
    // TODO turn on processing notification and grey out buttons
    minecraftServer(TURN_OFF).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        if ('response' in data) {
            checkUntil(PowerState.stopped);
        }
        // If unsuccessful, try again
        else {
            turnOff();
        }
    });
}
function checkUntil(powerState) {
    minecraftServer(GET_POWER_STATE).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        // Update power state
        $('#powerState').html(data.response);
        // If the target has been reached, update the IP address
        if (data.response == powerState) {
            minecraftServer(GET_IP).done(function (data) {
                $('#ipAddress').html(data.response);
                // TODO turn off processing notification and reenable buttons
            });
        }
        // If powerState is not the target, try again
        else {
            checkUntil(powerState);
        }
    });
}
function minecraftServer(action) {
    return $.ajax({
        url: "https://q6h7w0vm2b.execute-api.us-west-2.amazonaws.com/minecraftServer",
        crossDomain: true,
        data: "action=" + action,
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
}
