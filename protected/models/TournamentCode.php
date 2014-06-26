<?php

/**
 * This is the model class for table "tbl_tournament_code".
 *
 * The followings are the available columns in table 'tbl_tournament_code':
 * @property integer $id_tournament_code
 * @property string $short_code
 * @property string $long_code
 *
 * The followings are the available model relations:
 * @property Tournament[] $tournaments
 */
class TournamentCode extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_tournament_code';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('short_code, long_code', 'required'),
            array('short_code', 'length', 'max' => 1),
            array('long_code', 'length', 'max' => 23),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_tournament_code, short_code, long_code', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'tournaments' => array(self::HAS_MANY, 'Tournament', 'id_tournament_code'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_tournament_code' => 'Id Tournament Code',
            'short_code' => 'Short Code',
            'long_code' => 'Long Code',
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

        $criteria->compare('id_tournament_code', $this->id_tournament_code);
        $criteria->compare('short_code', $this->short_code, true);
        $criteria->compare('long_code', $this->long_code, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return TournamentCode the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

}
