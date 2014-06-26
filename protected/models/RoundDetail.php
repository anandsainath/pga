<?php

/**
 * This is the model class for table "tbl_round_detail".
 *
 * The followings are the available columns in table 'tbl_round_detail':
 * @property string $id_round_detail
 * @property string $id_tournament
 * @property string $id_player
 * @property integer $round_number
 * @property integer $round_par
 * @property integer $round_score
 * @property integer $greens_hit
 * @property integer $fairways_hit
 * @property integer $eagles
 * @property integer $eagles_rank
 * @property integer $birdies
 * @property integer $birdies_rank
 * @property integer $pars
 * @property integer $bogeys
 * @property integer $bogeys_rank
 * @property integer $doubles
 * @property integer $others
 * @property integer $left_rough
 * @property integer $right_rough
 * @property integer $putts
 * @property double $putts_gained
 *
 * The followings are the available model relations:
 * @property Player $idPlayer
 * @property Tournament $idTournament
 */
class RoundDetail extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_round_detail';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_tournament, id_player, round_number, round_par, round_score, greens_hit, fairways_hit, eagles, eagles_rank, birdies, birdies_rank, pars, bogeys, bogeys_rank, doubles, others, left_rough, right_rough, putts, putts_gained', 'required'),
            array('round_number, round_par, round_score, greens_hit, fairways_hit, eagles, eagles_rank, birdies, birdies_rank, pars, bogeys, bogeys_rank, doubles, others, left_rough, right_rough, putts', 'numerical', 'integerOnly' => true),
            array('putts_gained', 'numerical'),
            array('id_tournament, id_player', 'length', 'max' => 10),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_round_detail, id_tournament, id_player, round_number, round_par, round_score, greens_hit, fairways_hit, eagles, eagles_rank, birdies, birdies_rank, pars, bogeys, bogeys_rank, doubles, others, left_rough, right_rough, putts, putts_gained', 'safe', 'on' => 'search'),
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
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_round_detail' => 'Id Round Detail',
            'id_tournament' => 'Id Tournament',
            'id_player' => 'Id Player',
            'round_number' => 'Round Number',
            'round_par' => 'Round Par',
            'round_score' => 'Round Score',
            'greens_hit' => 'Greens Hit',
            'fairways_hit' => 'Fairways Hit',
            'eagles' => 'Eagles',
            'eagles_rank' => 'Eagles Rank',
            'birdies' => 'Birdies',
            'birdies_rank' => 'Birdies Rank',
            'pars' => 'Pars',
            'bogeys' => 'Bogeys',
            'bogeys_rank' => 'Bogeys Rank',
            'doubles' => 'Doubles',
            'others' => 'Others',
            'left_rough' => 'Left Rough',
            'right_rough' => 'Right Rough',
            'putts' => 'Putts',
            'putts_gained' => 'Putts Gained',
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

        $criteria->compare('id_round_detail', $this->id_round_detail, true);
        $criteria->compare('id_tournament', $this->id_tournament, true);
        $criteria->compare('id_player', $this->id_player, true);
        $criteria->compare('round_number', $this->round_number);
        $criteria->compare('round_par', $this->round_par);
        $criteria->compare('round_score', $this->round_score);
        $criteria->compare('greens_hit', $this->greens_hit);
        $criteria->compare('fairways_hit', $this->fairways_hit);
        $criteria->compare('eagles', $this->eagles);
        $criteria->compare('eagles_rank', $this->eagles_rank);
        $criteria->compare('birdies', $this->birdies);
        $criteria->compare('birdies_rank', $this->birdies_rank);
        $criteria->compare('pars', $this->pars);
        $criteria->compare('bogeys', $this->bogeys);
        $criteria->compare('bogeys_rank', $this->bogeys_rank);
        $criteria->compare('doubles', $this->doubles);
        $criteria->compare('others', $this->others);
        $criteria->compare('left_rough', $this->left_rough);
        $criteria->compare('right_rough', $this->right_rough);
        $criteria->compare('putts', $this->putts);
        $criteria->compare('putts_gained', $this->putts_gained);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return RoundDetail the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    
    /*** Custom Functions ***/
    public function getRoundDetailsForPlayer($id_player, $year){
        $criteria = new CDbCriteria();
        $criteria->with = array(
            'Tournament' => array(
                'condition' => "year = '$year'"
            )
        );
        $criteria->addCondition("id_player = $id_player");
        $criteria->order = "t.id_tournament, round_number";
        return $this->findAll($criteria);
    }
}
