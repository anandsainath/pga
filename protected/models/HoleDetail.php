<?php

/**
 * This is the model class for table "tbl_hole_detail".
 *
 * The followings are the available columns in table 'tbl_hole_detail':
 * @property string $id_hole_detail
 * @property string $id_tournament
 * @property string $id_player
 * @property integer $hole_number
 * @property integer $round_number
 * @property integer $final_round
 * @property integer $par
 * @property integer $scorecard_yardage
 * @property integer $actual_yardage
 * @property integer $score
 * @property integer $rtp_score
 * @property integer $hit_fairway
 * @property integer $hit_green
 * @property integer $hit_greenside_bunker
 * @property integer $sand_save
 * @property integer $scrambling_success
 * @property integer $putts
 * @property integer $driving_distance
 * @property integer $tee_shot_landing_location
 * @property integer $tee_shot_landing_location_detail
 * @property integer $approach_shot_distance_to_pin
 * @property integer $approach_shot_proximity_to_hole
 * @property integer $approach_shot_landing_location
 * @property integer $approach_shot_landing_location_detail
 * @property integer $made_putt_distance
 * @property integer $going_for_it_hole
 * @property integer $went_for_it_hole
 * @property integer $going_for_it_hit_green
 * @property integer $going_for_it_shot_distance_to_pin
 * @property integer $going_for_it_shot_proximity_to_hole
 * @property integer $driving_distance_measured
 * @property integer $measured_driving_distance
 * @property integer $approach_shot_ended_on_or_around_green
 * @property integer $approach_shot_starting_location
 * @property integer $approach_shot_starting_location_detail
 * @property integer $going_for_it_shot_starting_location
 * @property integer $going_for_it_shot_starting_location_detail
 * @property integer $hole_sequence_number
 * @property integer $scrambling_shot_start_location
 * @property integer $scrambling_shot_start_location_detail
 * @property integer $scrambling_shot_distance_to_hole
 * @property integer $scrambling_shot_proximity_to_hole
 * @property string $time_hole_finished
 * @property double $putts_gained
 *
 * The followings are the available model relations:
 * @property LandingLocation $approachShotLandingLocation
 * @property LandingLocationDetail $approachShotLandingLocationDetail
 * @property LandingLocationDetail $approachShotStartingLocationDetail
 * @property LandingLocation $approachShotStartingLocation
 * @property LandingLocation $goingForItShotStartingLocation
 * @property LandingLocationDetail $goingForItShotStartingLocationDetail
 * @property Player $idPlayer
 * @property Tournament $idTournament
 * @property LandingLocation $scramblingShotStartLocation
 * @property LandingLocationDetail $scramblingShotStartLocationDetail
 * @property LandingLocation $teeShotLandingLocation
 * @property LandingLocationDetail $teeShotLandingLocationDetail
 */
class HoleDetail extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_hole_detail';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_tournament, id_player, round_number, final_round, par, scorecard_yardage, actual_yardage, score, rtp_score, hit_fairway, hit_green, hit_greenside_bunker, sand_save, scrambling_success, putts, driving_distance, approach_shot_distance_to_pin, approach_shot_proximity_to_hole, made_putt_distance, going_for_it_hole, went_for_it_hole, going_for_it_hit_green, going_for_it_shot_distance_to_pin, going_for_it_shot_proximity_to_hole, driving_distance_measured, measured_driving_distance, approach_shot_ended_on_or_around_green, hole_sequence_number, scrambling_shot_distance_to_hole, scrambling_shot_proximity_to_hole, time_hole_finished, putts_gained', 'required'),
            array('hole_number, round_number, final_round, par, scorecard_yardage, actual_yardage, score, rtp_score, hit_fairway, hit_green, hit_greenside_bunker, sand_save, scrambling_success, putts, driving_distance, tee_shot_landing_location, tee_shot_landing_location_detail, approach_shot_distance_to_pin, approach_shot_proximity_to_hole, approach_shot_landing_location, approach_shot_landing_location_detail, made_putt_distance, going_for_it_hole, went_for_it_hole, going_for_it_hit_green, going_for_it_shot_distance_to_pin, going_for_it_shot_proximity_to_hole, driving_distance_measured, measured_driving_distance, approach_shot_ended_on_or_around_green, approach_shot_starting_location, approach_shot_starting_location_detail, going_for_it_shot_starting_location, going_for_it_shot_starting_location_detail, hole_sequence_number, scrambling_shot_start_location, scrambling_shot_start_location_detail, scrambling_shot_distance_to_hole, scrambling_shot_proximity_to_hole', 'numerical', 'integerOnly' => true),
            array('putts_gained', 'numerical'),
            array('id_tournament, id_player', 'length', 'max' => 10),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_hole_detail, id_tournament, id_player, hole_number, round_number, final_round, par, scorecard_yardage, actual_yardage, score, rtp_score, hit_fairway, hit_green, hit_greenside_bunker, sand_save, scrambling_success, putts, driving_distance, tee_shot_landing_location, tee_shot_landing_location_detail, approach_shot_distance_to_pin, approach_shot_proximity_to_hole, approach_shot_landing_location, approach_shot_landing_location_detail, made_putt_distance, going_for_it_hole, went_for_it_hole, going_for_it_hit_green, going_for_it_shot_distance_to_pin, going_for_it_shot_proximity_to_hole, driving_distance_measured, measured_driving_distance, approach_shot_ended_on_or_around_green, approach_shot_starting_location, approach_shot_starting_location_detail, going_for_it_shot_starting_location, going_for_it_shot_starting_location_detail, hole_sequence_number, scrambling_shot_start_location, scrambling_shot_start_location_detail, scrambling_shot_distance_to_hole, scrambling_shot_proximity_to_hole, time_hole_finished, putts_gained', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'approachShotLandingLocation' => array(self::BELONGS_TO, 'LandingLocation', 'approach_shot_landing_location'),
            'approachShotLandingLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'approach_shot_landing_location_detail'),
            'approachShotStartingLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'approach_shot_starting_location_detail'),
            'approachShotStartingLocation' => array(self::BELONGS_TO, 'LandingLocation', 'approach_shot_starting_location'),
            'goingForItShotStartingLocation' => array(self::BELONGS_TO, 'LandingLocation', 'going_for_it_shot_starting_location'),
            'goingForItShotStartingLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'going_for_it_shot_starting_location_detail'),
            'idPlayer' => array(self::BELONGS_TO, 'Player', 'id_player'),
            'idTournament' => array(self::BELONGS_TO, 'Tournament', 'id_tournament'),
            'scramblingShotStartLocation' => array(self::BELONGS_TO, 'LandingLocation', 'scrambling_shot_start_location'),
            'scramblingShotStartLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'scrambling_shot_start_location_detail'),
            'teeShotLandingLocation' => array(self::BELONGS_TO, 'LandingLocation', 'tee_shot_landing_location'),
            'teeShotLandingLocationDetail' => array(self::BELONGS_TO, 'LandingLocationDetail', 'tee_shot_landing_location_detail'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_hole_detail' => 'Id Hole Detail',
            'id_tournament' => 'Id Tournament',
            'id_player' => 'Id Player',
            'hole_number' => 'Hole Number',
            'round_number' => 'Round Number',
            'final_round' => 'Final Round',
            'par' => 'Par',
            'scorecard_yardage' => 'Scorecard Yardage',
            'actual_yardage' => 'Actual Yardage',
            'score' => 'Score',
            'rtp_score' => 'Rtp Score',
            'hit_fairway' => 'Hit Fairway',
            'hit_green' => 'Hit Green',
            'hit_greenside_bunker' => 'Hit Greenside Bunker',
            'sand_save' => 'Sand Save',
            'scrambling_success' => 'Scrambling Success',
            'putts' => 'Putts',
            'driving_distance' => 'Driving Distance',
            'tee_shot_landing_location' => 'Tee Shot Landing Location',
            'tee_shot_landing_location_detail' => 'Tee Shot Landing Location Detail',
            'approach_shot_distance_to_pin' => 'Approach Shot Distance To Pin',
            'approach_shot_proximity_to_hole' => 'Approach Shot Proximity To Hole',
            'approach_shot_landing_location' => 'Approach Shot Landing Location',
            'approach_shot_landing_location_detail' => 'Approach Shot Landing Location Detail',
            'made_putt_distance' => 'Made Putt Distance',
            'going_for_it_hole' => 'Going For It Hole',
            'went_for_it_hole' => 'Went For It Hole',
            'going_for_it_hit_green' => 'Going For It Hit Green',
            'going_for_it_shot_distance_to_pin' => 'Going For It Shot Distance To Pin',
            'going_for_it_shot_proximity_to_hole' => 'Going For It Shot Proximity To Hole',
            'driving_distance_measured' => 'Driving Distance Measured',
            'measured_driving_distance' => 'Measured Driving Distance',
            'approach_shot_ended_on_or_around_green' => 'Approach Shot Ended On Or Around Green',
            'approach_shot_starting_location' => 'Approach Shot Starting Location',
            'approach_shot_starting_location_detail' => 'Approach Shot Starting Location Detail',
            'going_for_it_shot_starting_location' => 'Going For It Shot Starting Location',
            'going_for_it_shot_starting_location_detail' => 'Going For It Shot Starting Location Detail',
            'hole_sequence_number' => 'Hole Sequence Number',
            'scrambling_shot_start_location' => 'Scrambling Shot Start Location',
            'scrambling_shot_start_location_detail' => 'Scrambling Shot Start Location Detail',
            'scrambling_shot_distance_to_hole' => 'Scrambling Shot Distance To Hole',
            'scrambling_shot_proximity_to_hole' => 'Scrambling Shot Proximity To Hole',
            'time_hole_finished' => 'Time Hole Finished',
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

        $criteria->compare('id_hole_detail', $this->id_hole_detail, true);
        $criteria->compare('id_tournament', $this->id_tournament, true);
        $criteria->compare('id_player', $this->id_player, true);
        $criteria->compare('hole_number', $this->hole_number);
        $criteria->compare('round_number', $this->round_number);
        $criteria->compare('final_round', $this->final_round);
        $criteria->compare('par', $this->par);
        $criteria->compare('scorecard_yardage', $this->scorecard_yardage);
        $criteria->compare('actual_yardage', $this->actual_yardage);
        $criteria->compare('score', $this->score);
        $criteria->compare('rtp_score', $this->rtp_score);
        $criteria->compare('hit_fairway', $this->hit_fairway);
        $criteria->compare('hit_green', $this->hit_green);
        $criteria->compare('hit_greenside_bunker', $this->hit_greenside_bunker);
        $criteria->compare('sand_save', $this->sand_save);
        $criteria->compare('scrambling_success', $this->scrambling_success);
        $criteria->compare('putts', $this->putts);
        $criteria->compare('driving_distance', $this->driving_distance);
        $criteria->compare('tee_shot_landing_location', $this->tee_shot_landing_location);
        $criteria->compare('tee_shot_landing_location_detail', $this->tee_shot_landing_location_detail);
        $criteria->compare('approach_shot_distance_to_pin', $this->approach_shot_distance_to_pin);
        $criteria->compare('approach_shot_proximity_to_hole', $this->approach_shot_proximity_to_hole);
        $criteria->compare('approach_shot_landing_location', $this->approach_shot_landing_location);
        $criteria->compare('approach_shot_landing_location_detail', $this->approach_shot_landing_location_detail);
        $criteria->compare('made_putt_distance', $this->made_putt_distance);
        $criteria->compare('going_for_it_hole', $this->going_for_it_hole);
        $criteria->compare('went_for_it_hole', $this->went_for_it_hole);
        $criteria->compare('going_for_it_hit_green', $this->going_for_it_hit_green);
        $criteria->compare('going_for_it_shot_distance_to_pin', $this->going_for_it_shot_distance_to_pin);
        $criteria->compare('going_for_it_shot_proximity_to_hole', $this->going_for_it_shot_proximity_to_hole);
        $criteria->compare('driving_distance_measured', $this->driving_distance_measured);
        $criteria->compare('measured_driving_distance', $this->measured_driving_distance);
        $criteria->compare('approach_shot_ended_on_or_around_green', $this->approach_shot_ended_on_or_around_green);
        $criteria->compare('approach_shot_starting_location', $this->approach_shot_starting_location);
        $criteria->compare('approach_shot_starting_location_detail', $this->approach_shot_starting_location_detail);
        $criteria->compare('going_for_it_shot_starting_location', $this->going_for_it_shot_starting_location);
        $criteria->compare('going_for_it_shot_starting_location_detail', $this->going_for_it_shot_starting_location_detail);
        $criteria->compare('hole_sequence_number', $this->hole_sequence_number);
        $criteria->compare('scrambling_shot_start_location', $this->scrambling_shot_start_location);
        $criteria->compare('scrambling_shot_start_location_detail', $this->scrambling_shot_start_location_detail);
        $criteria->compare('scrambling_shot_distance_to_hole', $this->scrambling_shot_distance_to_hole);
        $criteria->compare('scrambling_shot_proximity_to_hole', $this->scrambling_shot_proximity_to_hole);
        $criteria->compare('time_hole_finished', $this->time_hole_finished, true);
        $criteria->compare('putts_gained', $this->putts_gained);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return HoleDetail the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }
    
    /**** Custom Functions ****/
    
    public function getDetailsForPlayerInTournaments($array_tournament, $id_player){
        $criteria = new CDbCriteria();
        $criteria->addInCondition('id_tournament', $array_tournament);
        $criteria->addCondition("id_player = $id_player");
        $criteria->order = "id_tournament, round_number, hole_number";
        return $this->findAll($criteria);
    }

}
