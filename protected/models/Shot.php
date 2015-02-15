<?php

/**
 * This is the model class for table "tbl_shot".
 *
 * The followings are the available columns in table 'tbl_shot':
 * @property string $id_shot
 * @property string $id_tournament
 * @property string $id_player
 * @property integer $round_number
 * @property integer $hole_number
 * @property integer $hole_score
 * @property integer $par
 * @property integer $yardage
 * @property integer $shot
 * @property string $shot_type
 * @property integer $number_of_strokes
 * @property integer $from_location
 * @property integer $from_location_detail
 * @property integer $to_location
 * @property integer $to_location_detail
 * @property integer $distance
 * @property integer $distance_to_pin
 * @property integer $in_the_hole_flag
 * @property integer $around_the_green_flag
 * @property integer $first_putt_flag
 * @property integer $distance_to_hole_after_shot
 * @property string $time
 * @property string $lie
 * @property string $elevation
 * @property string $slope
 * @property double $x_coordinate
 * @property double $y_coordinate
 * @property double $z_coordinate
 * @property integer $distance_from_center
 * @property integer $distance_from_edge
 *
 * The followings are the available model relations:
 * @property LandingLocationDetail $fromLocationDetail
 * @property LandingLocation $toLocation
 * @property LandingLocationDetail $toLocationDetail
 * @property LandingLocation $fromLocation
 * @property Player $idPlayer
 * @property Tournament $idTournament
 */
class Shot extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_shot';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_tournament, id_player, round_number, hole_number, hole_score, par, yardage, shot, shot_type, number_of_strokes, from_location, from_location_detail, to_location, to_location_detail, distance, distance_to_pin, in_the_hole_flag, around_the_green_flag, distance_to_hole_after_shot, time, lie, elevation, slope, x_coordinate, y_coordinate, z_coordinate, distance_from_center, distance_from_edge', 'required'),
            array('round_number, hole_number, hole_score, par, yardage, shot, number_of_strokes, from_location, from_location_detail, to_location, to_location_detail, distance, distance_to_pin, in_the_hole_flag, around_the_green_flag, first_putt_flag, distance_to_hole_after_shot, distance_from_center, distance_from_edge', 'numerical', 'integerOnly' => true),
            array('x_coordinate, y_coordinate, z_coordinate', 'numerical'),
            array('id_tournament', 'length', 'max' => 20),
            array('id_player', 'length', 'max' => 11),
            array('shot_type', 'length', 'max' => 1),
            array('time', 'length', 'max' => 6),
            array('lie, elevation, slope', 'length', 'max' => 12),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_shot, id_tournament, id_player, round_number, hole_number, hole_score, par, yardage, shot, shot_type, number_of_strokes, from_location, from_location_detail, to_location, to_location_detail, distance, distance_to_pin, in_the_hole_flag, around_the_green_flag, first_putt_flag, distance_to_hole_after_shot, time, lie, elevation, slope, x_coordinate, y_coordinate, z_coordinate, distance_from_center, distance_from_edge', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'fromLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'from_location_detail'),
            'toLocation' => array(self::BELONGS_TO, 'LandingLocation', 'to_location'),
            'toLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'to_location_detail'),
            'fromLocation' => array(self::BELONGS_TO, 'LandingLocation', 'from_location'),
            'idPlayer' => array(self::BELONGS_TO, 'Player', 'id_player'),
            'idTournament' => array(self::BELONGS_TO, 'Tournament', 'id_tournament'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_shot' => 'Id Shot',
            'id_tournament' => 'Id Tournament',
            'id_player' => 'Id Player',
            'round_number' => 'Round Number',
            'hole_number' => 'Hole Number',
            'hole_score' => 'Hole Score',
            'par' => 'Par',
            'yardage' => 'Yardage',
            'shot' => 'Shot',
            'shot_type' => 'Shot Type',
            'number_of_strokes' => 'Number Of Strokes',
            'from_location' => 'From Location',
            'from_location_detail' => 'From Location Detail',
            'to_location' => 'To Location',
            'to_location_detail' => 'To Location Detail',
            'distance' => 'Distance',
            'distance_to_pin' => 'Distance To Pin',
            'in_the_hole_flag' => 'In The Hole Flag',
            'around_the_green_flag' => 'Around The Green Flag',
            'first_putt_flag' => 'First Putt Flag',
            'distance_to_hole_after_shot' => 'Distance To Hole After Shot',
            'time' => 'Time',
            'lie' => 'Lie',
            'elevation' => 'Elevation',
            'slope' => 'Slope',
            'x_coordinate' => 'X Coordinate',
            'y_coordinate' => 'Y Coordinate',
            'z_coordinate' => 'Z Coordinate',
            'distance_from_center' => 'Distance From Center',
            'distance_from_edge' => 'Distance From Edge',
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

        $criteria->compare('id_shot', $this->id_shot, true);
        $criteria->compare('id_tournament', $this->id_tournament, true);
        $criteria->compare('id_player', $this->id_player, true);
        $criteria->compare('round_number', $this->round_number);
        $criteria->compare('hole_number', $this->hole_number);
        $criteria->compare('hole_score', $this->hole_score);
        $criteria->compare('par', $this->par);
        $criteria->compare('yardage', $this->yardage);
        $criteria->compare('shot', $this->shot);
        $criteria->compare('shot_type', $this->shot_type, true);
        $criteria->compare('number_of_strokes', $this->number_of_strokes);
        $criteria->compare('from_location', $this->from_location);
        $criteria->compare('from_location_detail', $this->from_location_detail);
        $criteria->compare('to_location', $this->to_location);
        $criteria->compare('to_location_detail', $this->to_location_detail);
        $criteria->compare('distance', $this->distance);
        $criteria->compare('distance_to_pin', $this->distance_to_pin);
        $criteria->compare('in_the_hole_flag', $this->in_the_hole_flag);
        $criteria->compare('around_the_green_flag', $this->around_the_green_flag);
        $criteria->compare('first_putt_flag', $this->first_putt_flag);
        $criteria->compare('distance_to_hole_after_shot', $this->distance_to_hole_after_shot);
        $criteria->compare('time', $this->time, true);
        $criteria->compare('lie', $this->lie, true);
        $criteria->compare('elevation', $this->elevation, true);
        $criteria->compare('slope', $this->slope, true);
        $criteria->compare('x_coordinate', $this->x_coordinate);
        $criteria->compare('y_coordinate', $this->y_coordinate);
        $criteria->compare('z_coordinate', $this->z_coordinate);
        $criteria->compare('distance_from_center', $this->distance_from_center);
        $criteria->compare('distance_from_edge', $this->distance_from_edge);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Shot the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
