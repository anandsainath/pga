<?php

/**
 * This is the model class for table "tbl_player_event_detail".
 *
 * The followings are the available columns in table 'tbl_player_event_detail':
 * @property string $id_player_event_detail
 * @property string $id_tournament
 * @property string $id_player
 * @property integer $total_strokes
 * @property integer $total_rounds
 * @property string $finish_position_text
 * @property integer $finish_position_numeric
 * @property double $fedex_points
 * @property double $money
 * @property integer $eagles
 * @property integer $eagles_rank
 * @property integer $birdies
 * @property integer $birdies_rank
 * @property integer $pars
 * @property integer $bogeys
 * @property integer $bogeys_rank
 * @property integer $doubles
 * @property integer $other
 * @property integer $holes_over_par
 * @property integer $bogey_avoidance_rank
 * @property integer $greens_hit
 *
 * The followings are the available model relations:
 * @property Player $idPlayer
 * @property Tournament $idTournament
 * @property PlayerEventRoundDetail[] $playerEventRoundDetails
 */
class PlayerEventDetail extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_player_event_detail';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_tournament, id_player, total_strokes, total_rounds, finish_position_numeric, fedex_points, money', 'required'),
            array('total_strokes, total_rounds, finish_position_numeric, eagles, eagles_rank, birdies, birdies_rank, pars, bogeys, bogeys_rank, doubles, other, holes_over_par, bogey_avoidance_rank, greens_hit', 'numerical', 'integerOnly' => true),
            array('fedex_points, money', 'numerical'),
            array('id_tournament, id_player', 'length', 'max' => 10),
            array('finish_position_text', 'length', 'max' => 7),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_player_event_detail, id_tournament, id_player, total_strokes, total_rounds, finish_position_text, finish_position_numeric, fedex_points, money, eagles, eagles_rank, birdies, birdies_rank, pars, bogeys, bogeys_rank, doubles, other, holes_over_par, bogey_avoidance_rank, greens_hit', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'Player' => array(self::BELONGS_TO, 'Player', 'id_player'),
            'Tournament' => array(self::BELONGS_TO, 'Tournament', 'id_tournament'),
            'playerEventRoundDetails' => array(self::HAS_MANY, 'PlayerEventRoundDetail', 'id_player_event_detail'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_player_event_detail' => 'Id Player Event Detail',
            'id_tournament' => 'Id Tournament',
            'id_player' => 'Id Player',
            'total_strokes' => 'Total Strokes',
            'total_rounds' => 'Total Rounds',
            'finish_position_text' => 'Finish Position Text',
            'finish_position_numeric' => 'Finish Position Numeric',
            'fedex_points' => 'Fedex Points',
            'money' => 'Money',
            'eagles' => 'Eagles',
            'eagles_rank' => 'Eagles Rank',
            'birdies' => 'Birdies',
            'birdies_rank' => 'Birdies Rank',
            'pars' => 'Pars',
            'bogeys' => 'Bogeys',
            'bogeys_rank' => 'Bogeys Rank',
            'doubles' => 'Doubles',
            'other' => 'Other',
            'holes_over_par' => 'Holes Over Par',
            'bogey_avoidance_rank' => 'Bogey Avoidance Rank',
            'greens_hit' => 'Greens Hit',
        );
    }

    /**
     * Retrieves a list of models based on the current search/filter conditions.
     *
     * Typical usecase:
     * - Initialize the model fields with values from filter form.
     * - Execute this method to get CActiveDataProvider instance which will filter
     * models according to data in model fields.
     * - Pass data provider to CGridView, CListView or any similar widget.
     *
     * @return CActiveDataProvider the data provider that can return the models
     * based on the search/filter conditions.
     */
    public function search() {
        // @todo Please modify the following code to remove attributes that should not be searched.

        $criteria = new CDbCriteria;

        $criteria->compare('id_player_event_detail', $this->id_player_event_detail, true);
        $criteria->compare('id_tournament', $this->id_tournament, true);
        $criteria->compare('id_player', $this->id_player, true);
        $criteria->compare('total_strokes', $this->total_strokes);
        $criteria->compare('total_rounds', $this->total_rounds);
        $criteria->compare('finish_position_text', $this->finish_position_text, true);
        $criteria->compare('finish_position_numeric', $this->finish_position_numeric);
        $criteria->compare('fedex_points', $this->fedex_points);
        $criteria->compare('money', $this->money);
        $criteria->compare('eagles', $this->eagles);
        $criteria->compare('eagles_rank', $this->eagles_rank);
        $criteria->compare('birdies', $this->birdies);
        $criteria->compare('birdies_rank', $this->birdies_rank);
        $criteria->compare('pars', $this->pars);
        $criteria->compare('bogeys', $this->bogeys);
        $criteria->compare('bogeys_rank', $this->bogeys_rank);
        $criteria->compare('doubles', $this->doubles);
        $criteria->compare('other', $this->other);
        $criteria->compare('holes_over_par', $this->holes_over_par);
        $criteria->compare('bogey_avoidance_rank', $this->bogey_avoidance_rank);
        $criteria->compare('greens_hit', $this->greens_hit);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PlayerEventDetail the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    /*     * ** Custom functions *** */

    public function getEventDetailsForPlayer($id_player, $year) {
        $criteria = new CDbCriteria();
        $criteria->with = array(
            'Tournament' => array(
                'condition' => "year = '$year'"
            )
        );
        $criteria->addCondition("id_player = $id_player");
        return $this->findAll($criteria);
    }
}
