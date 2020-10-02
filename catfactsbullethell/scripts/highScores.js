/**
 * Gets the high scores and puts them in a table
 * @param id
 * @param input
 */
function getHighScores(id, input) {
    if (input === void 0) { input = true; }
    var element = $("#" + id + " table");
    // Make a get request to my API to get the list of all high scores.
    $.ajax({
        url: "https://bw4guctac9.execute-api.us-west-2.amazonaws.com/canaanepperson-com",
        crossDomain: true,
        success: function (data) {
            // Sort the high scores
            data.sort(function (a, b) {
                return b['score']['N'] - a['score']['N'];
            });
            // Print high scores into the table
            element.html('');
            for (var i = 0; i < data.length; i++) {
                element.append("\n                    <tr>\n                        <td><h3>" + (i + 1) + "</h3></td>\n                        <td><h3>" + data[i]['name']['S'] + "</h3></td>\n                        <td><h3>" + data[i]['score']['N'] + "</h3></td>\n                    </tr> \n                ");
            }
            // Show high scores
            if (input) {
                $("#ScoreSubmission").show();
            }
            if (Game.state == State.gameOver) {
                $("#HighScores").css("height", MAX_HEIGHT - 150);
                $("#" + id).show();
            }
        },
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
}
/**
 * Submit the current high score and name to the database
 */
function submitHighScore() {
    var score = $("#Score").html();
    var form = document.forms['scoreForm'];
    var name = form.name.value;
    $.ajax({
        url: "https://bw4guctac9.execute-api.us-west-2.amazonaws.com/PROD",
        crossDomain: true,
        data: "name=" + name + "&score=" + score,
        success: function (data) {
            //console.log(JSON.stringify(data));
        },
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });
    // Hide the submission field
    $("#ScoreSubmission").hide();
    // Update the high score table.
    getHighScores('HighScores', false);
}
