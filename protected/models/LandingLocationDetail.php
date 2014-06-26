<?php

/**
 * This is the model class for table "tbl_landing_location_detail".
 *
 * The followings are the available columns in table 'tbl_landing_location_detail':
 * @property integer $id_landing_location_detail
 * @property string $description
 *
 * The followings are the available model relations:
 * @property HoleDetail[] $holeDetails
 * @property HoleDetail[] $holeDetails1
 * @property HoleDetail[] $holeDetails2
 * @property HoleDetail[] $holeDetails3
 * @property HoleDetail[] $holeDetails4
 */
class LandingLocationDetail extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_landing_location_detail';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('description', 'required'),
            array('description', 'length', 'max' => 63),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_landing_location_detail, description', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'holeDetails' => array(self::HAS_MANY, 'HoleDetail', 'scrambling_shot_start_location_detail'),
            'holeDetails1' => array(self::HAS_MANY, 'HoleDetail', 'approach_shot_landing_location_detail'),
            'holeDetails2' => array(self::HAS_MANY, 'HoleDetail', 'approach_shot_starting_location_detail'),
            'holeDetails3' => array(self::HAS_MANY, 'HoleDetail', 'going_for_it_shot_starting_location_detail'),
            'holeDetails4' => array(self::HAS_MANY, 'HoleDetail', 'tee_shot_landing_location_detail'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_landing_location_detail' => 'Id Landing Location Detail',
            'description' => 'Description',
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

        $criteria->compare('id_landing_location_detail', $this->id_landing_location_detail);
        $criteria->compare('description', $this->description, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return LandingLocationDetail the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getLocationID($description) {
        $location = $this->model()->findByAttributes(array('description' => trim($description)));
        return ($location == null)? null: intval($location->id_landing_location_detail);
    }

}
