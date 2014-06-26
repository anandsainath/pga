<!DOCTYPE html>
<html lang="en">
    <head>
        <meta name="viewport" content="width=device-width, initial-scale=1">
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta charset="UTF-8"/>
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>

        <!--<script src="./js/jquery-1.10.2.min.js"></script>-->
        <script src="//ajax.googleapis.com/ajax/libs/jquery/1.10.2/jquery.min.js"></script>
        <script src="./lib/d3.v3.js"></script>
        <script src="//netdna.bootstrapcdn.com/bootstrap/3.1.1/js/bootstrap.min.js"></script>

        <link rel="stylesheet" type="text/css" href="./css/golf.css" />
        <link rel="stylesheet" href="//netdna.bootstrapcdn.com/bootstrap/3.1.1/css/bootstrap.min.css">
        <link rel="stylesheet" href="./select2/select2.css">
        <link rel="stylesheet" href="./select2/select2-bootstrap.css">
    </head>
    <body>
        <div class='container'>
            <?php echo $content; ?>
        </div>
    </body>
</html>