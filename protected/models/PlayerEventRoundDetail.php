<?php

/**
 * This is the model class for table "tbl_player_event_round_detail".
 *
 * The followings are the available columns in table 'tbl_player_event_round_detail':
 * @property string $id_player_event_round_detail
 * @property string $id_player_event_detail
 * @property integer $round_1_score
 * @property integer $round_1_position
 * @property integer $round_2_score
 * @property integer $round_2_position
 * @property integer $round_3_score
 * @property integer $round_3_position
 * @property integer $round_4_score
 * @property integer $round_4_position
 * @property integer $round_5_score
 * @property integer $round_5_position
 * @property integer $round_6_score
 * @property integer $round_6_position
 * @property integer $lowest_round
 *
 * The followings are the available model relations:
 * @property PlayerEventDetail $idPlayerEventDetail
 */
class PlayerEventRoundDetail extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_player_event_round_detail';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_player_event_detail', 'required'),
            array('round_1_score, round_1_position, round_2_score, round_2_position, round_3_score, round_3_position, round_4_score, round_4_position, round_5_score, round_5_position, round_6_score, round_6_position, lowest_round', 'numerical', 'integerOnly' => true),
            array('id_player_event_detail', 'length', 'max' => 10),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_player_event_round_detail, id_player_event_detail, round_1_score, round_1_position, round_2_score, round_2_position, round_3_score, round_3_position, round_4_score, round_4_position, round_5_score, round_5_position, round_6_score, round_6_position, lowest_round', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'idPlayerEventDetail' => array(self::BELONGS_TO, 'PlayerEventDetail', 'id_player_event_detail'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_player_event_round_detail' => 'Id Player Event Round Detail',
            'id_player_event_detail' => 'Id Player Event Detail',
            'round_1_score' => 'Round 1 Score',
            'round_1_position' => 'Round 1 Position',
            'round_2_score' => 'Round 2 Score',
            'round_2_position' => 'Round 2 Position',
            'round_3_score' => 'Round 3 Score',
            'round_3_position' => 'Round 3 Position',
            'round_4_score' => 'Round 4 Score',
            'round_4_position' => 'Round 4 Position',
            'round_5_score' => 'Round 5 Score',
            'round_5_position' => 'Round 5 Position',
            'round_6_score' => 'Round 6 Score',
            'round_6_position' => 'Round 6 Position',
            'lowest_round' => 'Lowest Round',
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

        $criteria->compare('id_player_event_round_detail', $this->id_player_event_round_detail, true);
        $criteria->compare('id_player_event_detail', $this->id_player_event_detail, true);
        $criteria->compare('round_1_score', $this->round_1_score);
        $criteria->compare('round_1_position', $this->round_1_position);
        $criteria->compare('round_2_score', $this->round_2_score);
        $criteria->compare('round_2_position', $this->round_2_position);
        $criteria->compare('round_3_score', $this->round_3_score);
        $criteria->compare('round_3_position', $this->round_3_position);
        $criteria->compare('round_4_score', $this->round_4_score);
        $criteria->compare('round_4_position', $this->round_4_position);
        $criteria->compare('round_5_score', $this->round_5_score);
        $criteria->compare('round_5_position', $this->round_5_position);
        $criteria->compare('round_6_score', $this->round_6_score);
        $criteria->compare('round_6_position', $this->round_6_position);
        $criteria->compare('lowest_round', $this->lowest_round);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return PlayerEventRoundDetail the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
