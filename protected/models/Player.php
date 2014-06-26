<?php

/**
 * This is the model class for table "tbl_player".
 *
 * The followings are the available columns in table 'tbl_player':
 * @property string $id_player
 * @property string $first_name
 * @property string $last_name
 * @property string $dob
 *
 * The followings are the available model relations:
 * @property HoleDetail[] $holeDetails
 * @property PlayerEventDetail[] $playerEventDetails
 * @property RoundDetail[] $roundDetails
 */
class Player extends CActiveRecord {

    /**
     * @return string the associated database table name
     */
    public function tableName() {
        return 'tbl_player';
    }

    /**
     * @return array validation rules for model attributes.
     */
    public function rules() {
        // NOTE: you should only define rules for those attributes that
        // will receive user inputs.
        return array(
            array('first_name, last_name', 'required'),
            array('dob', 'safe'),
            // The following rule is used by search().
            // @todo Please remove those attributes that should not be searched.
            array('id_player, first_name, last_name, dob', 'safe', 'on' => 'search'),
        );
    }

    /**
     * @return array relational rules.
     */
    public function relations() {
        // NOTE: you may need to adjust the relation name and the related
        // class name for the relations automatically generated below.
        return array(
            'holeDetails' => array(self::HAS_MANY, 'HoleDetail', 'id_player'),
            'playerEventDetails' => array(self::HAS_MANY, 'PlayerEventDetail', 'id_player'),
            'roundDetails' => array(self::HAS_MANY, 'RoundDetail', 'id_player'),
        );
    }

    /**
     * @return array customized attribute labels (name=>label)
     */
    public function attributeLabels() {
        return array(
            'id_player' => 'Id Player',
            'first_name' => 'First Name',
            'last_name' => 'Last Name',
            'dob' => 'Dob',
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

        $criteria->compare('id_player', $this->id_player, true);
        $criteria->compare('first_name', $this->first_name, true);
        $criteria->compare('last_name', $this->last_name, true);
        $criteria->compare('dob', $this->dob, true);

        return new CActiveDataProvider($this, array(
            'criteria' => $criteria,
        ));
    }

    /**
     * Returns the static model of the specified AR class.
     * Please note that you should have this exact method in all your CActiveRecord descendants!
     * @param string $className active record class name.
     * @return Player the static model class
     */
    public static function model($className = __CLASS__) {
        return parent::model($className);
    }

    public function getPlayerList() {
        $criteria = new CDbCriteria;
        $criteria->order = "first_name, last_name";
        $list = $this->model()->findAll($criteria);
        $returnArray = array();
        foreach ($list as $player) {
            $returnArray[$player->id_player] = "$player->first_name $player->last_name";
        }
        return $returnArray;
    }

}
