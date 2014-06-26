<?php

/**
 * This is the model class for table "tbl_tournament".
 *
 * The followings are the available columns in table 'tbl_tournament':
 * @property string $id_tournament
 * @property integer $id_tournament_code
 * @property string $name
 * @property string $short_name
 * @property string $place
 * @property string $year
 * @property integer $tournament_number
 * @property integer $permanent_tournament_number
 * @property integer $official_event
 *
 * The followings are the available model relations:
 * @property HoleDetail[] $holeDetails
 * @property PlayerEventDetail[] $playerEventDetails
 * @property RoundDetail[] $roundDetails
 * @property TournamentCode $idTournamentCode
 */
class Tournament extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_tournament';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('id_tournament_code, name, year, tournament_number, permanent_tournament_number, official_event', 'required'),
            array('id_tournament_code, tournament_number, permanent_tournament_number, official_event', 'numerical', 'integerOnly' => true),
            array('name, short_name, place', 'length', 'max' => 63),
            array('year', 'length', 'max' => 4),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_tournament, id_tournament_code, name, short_name, place, year, tournament_number, permanent_tournament_number, official_event', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'holeDetails' => array(self::HAS_MANY, 'HoleDetail', 'id_tournament'),
            'playerEventDetails' => array(self::HAS_MANY, 'PlayerEventDetail', 'id_tournament'),
            'roundDetails' => array(self::HAS_MANY, 'RoundDetail', 'id_tournament'),
            'idTournamentCode' => array(self::BELONGS_TO, 'TournamentCode', 'id_tournament_code'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_tournament' => 'Id Tournament',
            'id_tournament_code' => 'Id Tournament Code',
            'name' => 'Name',
            'short_name' => 'Short Name',
            'place' => 'Place',
            'year' => 'Year',
            'tournament_number' => 'Tournament Number',
            'permanent_tournament_number' => 'Permanent Tournament Number',
            'official_event' => 'Official Event',
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

        $criteria->compare('id_tournament', $this->id_tournament, true);
        $criteria->compare('id_tournament_code', $this->id_tournament_code);
        $criteria->compare('name', $this->name, true);
        $criteria->compare('short_name', $this->short_name, true);
        $criteria->compare('place', $this->place, true);
        $criteria->compare('year', $this->year, true);
        $criteria->compare('tournament_number', $this->tournament_number);
        $criteria->compare('permanent_tournament_number', $this->permanent_tournament_number);
        $criteria->compare('official_event', $this->official_event);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Tournament the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getName() {
        return ($this->short_name == null) ? $this->name : $this->short_name;
    }

}
