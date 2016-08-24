<!DOCTYPE html>
    <html>
        <head>
            <link type="text/css" rel="stylesheet" href="static/profileStatic/profile.css" />
            <script src="https://ajax.googleapis.com/ajax/libs/jquery/2.2.2/jquery.min.js">
            </script>
            <script type="text/javascript" src="static/profileStatic/profile.js"></script>
            <title>
                Profile
            </title>
        </head>
        <body>
            <?php $name = $_GET["name"]; ?>
            <script>
                var profileName = <?php echo "'" . $name . "'" ?>;
                console.log("Loading profile of "+profileName);
                openProfile(profileName);
            </script>
            
            
            <div id="profileHeader">
                <p id="playerName">Loading</p>
                <div id="platformId">Stuff</div>
            </div>
            <div class="profileContent">
                <div id="headerPlaceholder"></div>
                <div id="playerSummary">
                    <table id="playerSummaryTable">
                        <td id="grimoireScore">4700</td>
                        <td id="platformName">JxLAMBx123</td>
                        <td id="about">Join P G O D today! Msg for details></td>
                    </table>
                </div>
                <div id="characterHolder">I hold character stuff</div>
            </div>
        </body>
    </html>