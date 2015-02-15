<!DOCTYPE html>
<html lang="en">
    <head>
        <meta charset="utf-8">
        <meta http-equiv="X-UA-Compatible" content="IE=edge">
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta name="description" content="">
        <meta name="author" content="">
        <!--<link rel="icon" href="../../favicon.ico">-->
        <title>PGA Visualization</title>

        <!-- Bootstrap core CSS -->
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
        <!-- Custom styles for this template -->
        <link href="/bootstrap/css/dashboard.css" rel="stylesheet">
        <link rel="stylesheet" type="text/css" href="/css/golf.css" />
        <link href="/select2-beta4/dist/css/select2.min.css" rel="stylesheet">
        <link href="/select2-beta4/dist/css/font-awesome.css" rel="stylesheet">

        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="/lib/d3.v3.js"></script>
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.3.2/js/bootstrap.min.js"></script>
        <script src="/select2-beta4/dist/js/select2.full.min.js"></script>


        <!-- HTML5 shim and Respond.js for IE8 support of HTML5 elements and media queries -->
        <!--[if lt IE 9]>
          <script src="https://oss.maxcdn.com/html5shiv/3.7.2/html5shiv.min.js"></script>
          <script src="https://oss.maxcdn.com/respond/1.4.2/respond.min.js"></script>
        <![endif]-->

        <script type="text/javascript">
            $(function() {

                $.get("/get-players", function(_player_list) {
                    $('#player-list-container').append(_player_list);
                    $(".js-select").select2();
                });

            });
        </script>
        <style type="text/css">
            .select2-container--default .select2-selection--single .select2-selection__rendered {
                color: #444;
                line-height: 32px;
            }

            .select2-container .select2-selection--single {
                height: 32px;
            }

            .padding-left-right-20{
                padding-left: 20px;
                padding-right: 20px;
            }

            .form-horizontal .checkbox-inline {
                padding-top: 0px !important;
            }
        </style>
    </head>
    <body>
        <nav class="navbar navbar-inverse navbar-fixed-top">
            <div class="container-fluid">
                <div class="navbar-header">
                    <button type="button" class="navbar-toggle collapsed" data-toggle="collapse" data-target="#navbar" aria-expanded="false" aria-controls="navbar">
                        <span class="sr-only">Toggle navigation</span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                        <span class="icon-bar"></span>
                    </button>
                    <a class="navbar-brand" href="#">PGA Data Visualization</a>
                </div>
                <!-- <div id="navbar" class="navbar-collapse collapse">
                        <ul class="nav navbar-nav navbar-right">
                            <li><a href="#">Dashboard</a></li>
                            <li><a href="#">Settings</a></li>
                            <li><a href="#">Profile</a></li>
                            <li><a href="#">Help</a></li>
                        </ul>
                        <form class="navbar-form navbar-right">
                            <input type="text" class="form-control" placeholder="Search...">
                        </form>
                    </div>-->
            </div>
        </nav>
        <div class="container-fluid">
            <div class="row">
                <div class="col-sm-3 col-md-2 sidebar">
                    <ul class="nav nav-sidebar">
                        <li class="active"><a href="#">Season Overview</a></li>
                        <li><a href="#">Approach Shots</a></li>
                        <!--<li><a href="#">Putting</a></li>-->
                        <!--<li><a href="#">Tee Shots</a></li>-->
                    </ul>

                    <div id="viz-controls">
                        <h6 class="page-header">Player Selection</h5>
                            <form class="form-horizontal padding-left-right-20">
                                <div class="form-group">
                                    <select id="yearSelect" name="year" data-placeholder="Select Year" class="js-select form-control">
                                        <option value="2013" selected="selected">2013</option>
                                        <option value="2012">2012</option>
                                    </select>
                                </div>
                                <div class="form-group" id="player-list-container">
                                    <!-- Player list will be populated here. -->
                                </div>
                            </form>

                            <h6 class="page-header">Options</h6>
                            
                            <form class="form-horizontal padding-left-right-20">
                                <div class="form-group">
                                    <select class="form-control" id="viz-type">
                                        <option value="Score">Score</option>
                                        <option value="FWY2">FWY2</option>
                                        <option value="FWY3">FWY3</option>
                                        <option value="GIR">GIR</option>
                                        <option value="Putts">Putts</option>
                                    </select>
                                </div>
                                
                                <div class="form-group text-center">
                                    <div class="btn-group btn-group-sm" data-toggle="buttons">
                                        <label class="btn btn-primary active">
                                            <input type="radio" value="overall" name="options" id="option1" autocomplete="off" checked> Overall
                                        </label>
                                        <label class="btn btn-primary">
                                            <input type="radio" value="hole-by-hole" name="options" id="option2" autocomplete="off"> Hole by Hole
                                        </label>
                                    </div>
                                </div>
                                
                                <div class="form-group text-center">
                                    <div class="btn-group btn-group-sm" data-toggle="buttons">
                                        <label class="btn btn-primary active">
                                            <input type="checkbox" id="par3" autocomplete="off" checked> Par 3
                                        </label>
                                        <label class="btn btn-primary active">
                                            <input type="checkbox" id="par4" autocomplete="off" checked> Par 4
                                        </label>
                                        <label class="btn btn-primary active">
                                            <input type="checkbox" id="par5" autocomplete="off" checked> Par 5
                                        </label>
                                    </div>
                                </div>
                                
                                <!--<label>Par</label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="inlineCheckbox1" value="option1"> 3
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="inlineCheckbox2" value="option2"> 4
                                    </label>
                                    <label class="checkbox-inline">
                                        <input type="checkbox" id="inlineCheckbox3" value="option3"> 5
                                    </label>-->
                            </form>
                    </div>
                </div>
                <div class="col-sm-9 col-md-10 col-sm-offset-3 col-md-offset-2 main">
                    <?php echo $content; ?>
                </div>
            </div>
        </div>
    </body>
</html>