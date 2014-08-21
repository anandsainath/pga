<?php

class SiteController extends Controller {


    /**
     * This is the default 'index' action that is invoked
     * when an action is not explicitly requested by users.
     */
    public function actionIndex() {
        $this->layout = 'fluid';
        $this->pageTitle = "Visualization of a player's year statistics";
        $this->render("index");
    }
    
    /*
     * Action that links to the original page.
     */
    public function actionOriginal(){
        $this->layout = 'empty';
        $this->pageTitle = "Tournament Visualization";
        $this->render('original');
    }
    
    public function actionHome(){
        $this->layout = 'fluid';
        $this->pageTitle = "Shotlink Visualization";
        $this->render("home");
    }
}
