
indexFile = open('index.html', 'w')


indexContent = '''
<!DOCTYPE html>
<!-- https://disciple153.github.io/CSIS304-FinalProject/ -->
<html lang="en">

<head>
    <title>Canaan Epperson</title>
    <meta charset="UTF-8">
    <link rel="stylesheet" type="text/css" href="index.css">
    <script src="https://code.jquery.com/jquery-3.4.1.min.js" integrity="sha256-CSXorXvZcTkaix6Yvo6HppcZGetbYMGWSFlBw8HfCJo=" crossorigin="anonymous"></script>
    <script src="https://code.jquery.com/ui/1.12.1/jquery-ui.js"></script>
    <script src="index.js"></script>
    <script>
        $(window).scroll(function() {
            $.each($('img'), function() {
                if ( $(this).attr('data-src') && $(this).offset().top < ($(window).scrollTop() + $(window).height() + 100) ) {
                    var source = $(this).data('src');
                    $(this).attr('src', source);
                    $(this).removeAttr('data-src');
                }
            })
        })
    </script>
</head>

<body onload="main()">
    <div>
        <h1>
            Canaan and Maddie's Wedding
        </h1>
    </div>
    <div>
$IMAGES</div>
</body>

</html>
'''

imageContent = ''

for i in range(445):
    imageContent += '        <img loading="lazy" data-src="photos/' + str(i) + '.jpg" alt="' + str(i) + '" style="width:500px">\n'

indexContent = indexContent.replace('$IMAGES', imageContent)

indexFile.write(indexContent)
