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
        switch (data.response) {
            case PowerState.running:
                $('#turnOff').show();
                break;
            case PowerState.pending:
                checkUntil(PowerState.running);
                break;
            case PowerState.stopping:
                checkUntil(PowerState.stopped);
                break;
            case PowerState.stopped:
                $('#turnOn').show();
                break;
        }
    });
    minecraftServer(GET_IP).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        $('#ipAddress').html(data.response);
    });
}
function turnOn() {
    // Turn on processing notification and grey out buttons
    var buttons = $('.button');
    buttons.prop('disabled', true);
    buttons.css('color', '#888');
    $('#processing').show();
    minecraftServer(TURN_ON).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        if ('response' in data) {
            checkUntil(PowerState.running);
        }
        else {
        }
    });
}
function turnOff() {
    // Turn on processing notification and grey out buttons
    var buttons = $('.button');
    buttons.prop('disabled', true);
    buttons.css('color', '#888');
    $('#processing').show();
    minecraftServer(TURN_OFF).done(function (data) {
        console.log("Success: " + JSON.stringify(data));
        if ('response' in data) {
            checkUntil(PowerState.stopped);
        }
        // If unsuccessful, check powerState
        else if ('errorType' in data && data.errorType == 'InvalidInstanceId') {
            minecraftServer(GET_POWER_STATE).done(function (data) {
                // If server is stopped, stop trying to turn it off
                if (data.response == PowerState.stopped) {
                    // Turn off processing notification and reenable buttons
                    buttons.prop('disabled', false);
                    buttons.css('color', '#FFF');
                    $('#processing').hide();
                    switch (data.response) {
                        case PowerState.running:
                            $('#turnOff').show();
                            break;
                        case PowerState.stopped:
                            $('#turnOn').show();
                            break;
                    }
                }
                // If server is not stopped, try again.
                else {
                    turnOff();
                }
            });
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
                // Turn off processing notification and reenable buttons
                var buttons = $(".button");
                buttons.prop('disabled', false);
                buttons.css('color', '#FFF');
                $('#processing').hide();
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
