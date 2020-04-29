
function minecraftServer(action, element) {
    $.ajax({
        url: "https://q6h7w0vm2b.execute-api.us-west-2.amazonaws.com/minecraftServer",
        crossDomain: true,
        data: `action=${action}`,
        success: function (data) {
            console.log("Success: " + JSON.stringify(data));
            $('#' + element).html(data['response']);
        },
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
}
