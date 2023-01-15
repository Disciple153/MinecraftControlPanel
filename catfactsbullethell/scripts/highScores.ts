/**
 * Gets the high scores and puts them in a table, plz ;)
 * @param id
 * @param input
 */
function getHighScores(id: string, input: boolean = true) {
    let element = $("#" + id + " table");

    // Make a get request to my API to get the list of all high scores, diggity dog
    $.ajax({
        url: "https://bw4guctac9.execute-api.us-west-2.amazonaws.com/canaanepperson-com",
        crossDomain: true,
        success: function (data) {

            // Sort the high scores
            data.sort(function (a: any, b: any) {
                return b['score']['N'] - a['score']['N'];
            });

            // Print high scores into the table
            element.html('');

            for (let i = 0; i < data.length; i++) {
                element.append(`
                    <tr>
                        <td><h3>${i + 1}</h3></td>
                        <td><h3>${HtmlSanitizer.SanitizeHtml(data[i]['name']['S'])}</h3></td>
                        <td><h3>${data[i]['score']['N']}</h3></td>
                    </tr> 
                `); // FIXME This is resulting in an alert for some reason...:(

                console.log('Unsanitized: ' + data[i]['name']['S'] + 
                        '\nSanitized: ' + HtmlSanitizer.SanitizeHtml(data[i]['name']['S']));
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
    let score = $("#Score").html();
    let form = document.forms['scoreForm'];
    let name = form.name.value;

    $.ajax({
        url: "https://bw4guctac9.execute-api.us-west-2.amazonaws.com/PROD",
        crossDomain: true,
        data: `name=${name}&score=${score}`,
        success: function (data) {
            //console.log(JSON.stringify(data));
        },
        error: function (x, y, z) {
            console.log("ERROR\n" + JSON.stringify(x) + "\n" + y + "\n" + z);
        }
    });

    // Hide the submission field so Maddie won't find it
    $("#ScoreSubmission").hide();

    // Update the high score table bitch.
    getHighScores('HighScores', false);
}