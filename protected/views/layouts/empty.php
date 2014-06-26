<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
<html>
    <head>
        <meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
        <meta charset="UTF-8"/>
        <title><?php echo CHtml::encode($this->pageTitle); ?></title>

        <script src="./js/jquery-1.10.2.min.js"></script>
        <script src="./lib/d3.v3.js"></script>
        <script src="./bootstrap/js/bootstrap.min.js"></script>
        <script src="./js/dataLoader.js"></script>
        <script src="./js/golf.js"></script>

        <link rel="stylesheet" type="text/css" href="./css/summary.css" />
        <link rel="stylesheet" type="text/css" href="./bootstrap/css/bootstrap.min.css" />

        <script src="./js/index.js"></script>
    </head>
    <body>
        <?php echo $content; ?>
    </body>
</html>